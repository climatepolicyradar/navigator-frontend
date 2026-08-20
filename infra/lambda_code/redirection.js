import cf from "cloudfront";

const kvsHandle = cf.kvs();

function unslugify(str) {
  return str
    .replace(/-/g, " ") // replace dashes with spaces
    .toLowerCase();
}
function urlParam(param, value) {
  return `${param}=${encodeURIComponent(value).replace(/%20/g, "+")}`;
}

function redirect(location) {
  return {
    statusCode: 301,
    statusDescription: "Moved Permanently",
    headers: {
      location: { value: location },
      "cache-control": { value: "max-age=86400" },
      "x-redirect-reason": { value: "ccc-redirection-kvs" },
    },
  };
}

async function handler(event) {
  const request = event.request;
  let uri = request.uri;

  try {
    // The pre-migration site nested everything under
    // /climate-change-litigation/; crawlers still request those URLs.
    // Strip the prefix and run the remainder through the same rules,
    // falling back to a redirect onto the stripped path itself.
    let hadLegacyPrefix = false;
    const legacyPrefixMatch = uri.match(/^\/climate-change-litigation(\/.*)?$/);
    if (legacyPrefixMatch) {
      // Collapse leading slashes and backslashes: a stripped remainder like
      // //evil.com or /\evil.com would otherwise reach the fallback redirect
      // as a protocol-relative URL and send the visitor off-site (browsers
      // normalise \ to / per the WHATWG URL spec).
      uri = (legacyPrefixMatch[1] || "/").replace(/^[/\\]+/, "/");
      hadLegacyPrefix = true;
    }

    // Old WordPress feed URLs; there is no feed on the current site.
    if (uri === "/rss" || uri === "/rss/" || uri === "/feed" || uri === "/feed/") {
      return redirect("/");
    }

    /** Pattern matching redirects */
    // /case-category/clean-water-act/
    const caseCategoryMatch = uri.match(/\/case-category\/((.*)[^\/])/);
    if (caseCategoryMatch) {
      const category = caseCategoryMatch[1];
      const redirectUrl = `/search?${urlParam("cpl", `category/${unslugify(category)}`)}`;
      return redirect(redirectUrl);
    }

    // /non-us-case-category/failure-to-adapt/
    const nonUsCaseCategoryMatch = uri.match(/\/non-us-case-category\/((.*)[^\/])/);
    if (nonUsCaseCategoryMatch) {
      const category = nonUsCaseCategoryMatch[1];
      const redirectUrl = `/search?${urlParam("cpl", `category/${unslugify(category)}`)}`;
      return redirect(redirectUrl);
    }

    // /principle-law/national-environmental-policy-act-nepa/
    const principleLawMatch = uri.match(/\/principle-law\/((.*)[^\/])/);
    if (principleLawMatch) {
      const principalLaw = principleLawMatch[1];
      const redirectUrl = `/search?${urlParam("cpl", `principal_law/${unslugify(principalLaw)}`)}`;
      return redirect(redirectUrl);
    }

    // /non-us-principle-law/un-convention-on-biological-diversity/
    const nonUsPrincipleLawMatch = uri.match(/\/non-us-principle-law\/((.*)[^\/])/);
    if (nonUsPrincipleLawMatch) {
      const nonUsPrincipalLaw = nonUsPrincipleLawMatch[1];
      const redirectUrl = `/search?${urlParam("cpl", `principal_law/${unslugify(nonUsPrincipalLaw)}`)}`;
      return redirect(redirectUrl);
    }

    // /non-us-jurisdiction/superior-council-of-justice-administration/
    const nonUsJurisdictionMatch = uri.match(/\/non-us-jurisdiction\/((.*)[^\/])/);
    if (nonUsJurisdictionMatch) {
      const nonUsJurisdiction = nonUsJurisdictionMatch[1];
      const redirectUrl = `/search?${urlParam("cpl", `jurisdiction/${unslugify(nonUsJurisdiction)}`)}`;
      return redirect(redirectUrl);
    }

    // KVS keys are inconsistent about trailing slashes, and Next.js only
    // strips slashes (never adds), so try the URI both ways.
    const kvsCandidates = [uri];
    if (uri.endsWith("/") && uri.length > 1) {
      kvsCandidates.push(uri.slice(0, -1));
    } else if (uri.length > 1) {
      kvsCandidates.push(uri + "/");
    }
    for (const candidate of kvsCandidates) {
      if (await kvsHandle.exists(candidate)) {
        const redirectUrl = await kvsHandle.get(candidate);

        if (redirectUrl) {
          console.log("Redirecting: " + uri + " -> " + redirectUrl);

          return redirect(redirectUrl);
        }
      }
    }

    /** as a last pass-through for PDFs  */
    // /wp-content/uploads/2025/07/Case-Bundles-2025-07-15.csv
    const wpContentMatch = uri.match(/\/wp-content\/((.*)[^\/])/);
    if (wpContentMatch) {
      const redirectUrl = `https://admin.climatecasechart.com${uri}`;
      return redirect(redirectUrl);
    }

    // No rule matched, but the URI carried the legacy prefix: send the
    // client to the stripped path rather than 404 on the prefixed one.
    if (hadLegacyPrefix) {
      return redirect(uri);
    }

    console.log("No redirect found");
    return request;
  } catch (err) {
    console.log("ccc-redirection error " + uri + ": " + err.message);
    return request;
  }
}

/**
 * We add a conditional export to support testing
 * and avoid CloudFront Functions borking as it does not support exporting
 */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { handler };
}
