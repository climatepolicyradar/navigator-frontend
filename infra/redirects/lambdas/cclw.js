import cf from "cloudfront";

const kvsHandle = cf.kvs();

// Follows URLPattern spec
// @see https://urlpattern.spec.whatwg.org/
const PATTERNS = [
  ["/geography/:slug/laws", "/geographies/:slug"],
  ["/geography/:slug/policies", "/geographies/:slug"],
  ["/geography/:slug/litigation_cases", "/geographies/:slug"],
  ["/geography/:slug/climate_targets/:type*", "/geographies/:slug"],
  ["/cclow/:slug*", "/:slug*"],
];

// Minimal URLPattern, polyfil
// @see: https://urlpattern.spec.whatwg.org/
function URLPattern(init) {
  this.pathname = typeof init === "string" ? init : init.pathname;
}

// @returns {{ pathname: { groups: object, input: string } } | null} a
// URLPatternResult carrying only the pathname component, or null on no match.
URLPattern.prototype.exec = function (input) {
  const pathname = typeof input === "string" ? input : input.pathname;
  const patternParts = this.pathname.split("/");
  const inputParts = pathname.split("/");
  const groups = {};

  for (let i = 0; i < patternParts.length; i++) {
    const part = patternParts[i];

    if (part.charAt(0) !== ":") {
      if (part !== inputParts[i]) {
        return null;
      }
    } else if (part.charAt(part.length - 1) === "*") {
      // Catch-all, always final: takes every remaining segment, or none.
      groups[part.slice(1, -1)] = inputParts.slice(i).join("/");
      return { pathname: { groups: groups, input: pathname } };
    } else if (i >= inputParts.length || inputParts[i] === "") {
      return null;
    } else {
      groups[part.slice(1)] = inputParts[i];
    }
  }

  // Slash-exact, as the spec is: `/a/:b` does not match `/a/c/`. The handler
  // feeds both slash variants in, so tolerance lives in one place.
  if (inputParts.length !== patternParts.length) {
    return null;
  }

  return { pathname: { groups: groups, input: pathname } };
};

URLPattern.prototype.test = function (input) {
  return this.exec(input) !== null;
};

// Compiled once per function init, like the KVS handle above.
const PATTERN_RULES = PATTERNS.map(function (rule) {
  return { pattern: new URLPattern({ pathname: rule[0] }), destination: rule[1] };
});

// Substitute matched groups back into a rule's destination.
function expandPattern(destination, groups) {
  const parts = destination.split("/");

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.charAt(0) === ":") {
      const name = part.charAt(part.length - 1) === "*" ? part.slice(1, -1) : part.slice(1);
      parts[i] = groups[name] === undefined ? "" : groups[name];
    }
  }

  return parts.join("/");
}

function redirect(location) {
  return {
    statusCode: 301,
    statusDescription: "Moved Permanently",
    headers: {
      location: { value: location },
      "cache-control": { value: "max-age=86400" },
      "x-redirect-reason": { value: "redirection-kvs" },
    },
  };
}

async function handler(event) {
  const request = event.request;
  const uri = request.uri;

  try {
    // Checks for /path/to/document and /path/to/document/
    // This is to support legacy URLs were published with
    // trailingslashes and crawlers still request them
    const candidates = [uri];
    if (uri.endsWith("/") && uri.length > 1) {
      candidates.push(uri.slice(0, -1));
    } else if (uri.length > 1) {
      candidates.push(uri + "/");
    }

    // URLPattern matching redirects, in declaration order
    for (let i = 0; i < PATTERN_RULES.length; i++) {
      for (let j = 0; j < candidates.length; j++) {
        const match = PATTERN_RULES[i].pattern.exec({ pathname: candidates[j] });
        if (!match) {
          continue;
        }

        let location = expandPattern(PATTERN_RULES[i].destination, match.pathname.groups);

        if (location.charAt(0) === "/") {
          // Collapse leading slashes and backslashes: a captured group can
          // smuggle //evil.com or /\evil.com into a relative destination,
          // which browsers follow off-site as protocol-relative (they
          // normalise \ to / per the WHATWG URL spec).
          location = location.replace(/^[/\\]+/, "/");

          // Self-loop guard, as below: a rule resolving onto its own input
          // would 301 forever.
          if (location === uri || location === uri + "/") {
            continue;
          }
        }

        console.log("Redirecting: " + uri + " -> " + location);
        return redirect(location);
      }
    }

    // Indexed loop, not for...of: the cloudfront-js-2.0 parser rejects
    // for...of (SyntaxError: Token "of" not supported) even though
    // UpdateFunction validation accepts it. Verify runtime compatibility
    // with scripts/test-edge.sh before publishing changes to this file.
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      if (await kvsHandle.exists(candidate)) {
        const redirectUrl = await kvsHandle.get(candidate);

        if (redirectUrl) {
          // Self-loop guard: request.uri never includes the querystring, so a
          // value pointing back at the requested path (e.g. key /search/ ->
          // /search?l=...) would 301 forever (2026-08-24 incident). The
          // slash-variant would loop too, via the origin's 308 slash-strip.
          const targetPath = redirectUrl.split("?")[0].split("#")[0];
          if (targetPath === uri || targetPath === uri + "/") {
            break;
          }

          console.log("Redirecting: " + uri + " -> " + redirectUrl);
          return redirect(redirectUrl);
        }
      }
    }

    return request;
  } catch (err) {
    console.log("redirection error " + uri + ": " + err.message);
    return request;
  }
}

// We add a conditional export to support testing
// and avoid CloudFront Functions borking as it does not support exporting
if (typeof module !== "undefined" && module.exports) {
  module.exports = { handler };
}
