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
  const uri = request.uri;

  try {
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

    console.log("kvsHandle.exists(uri);");
    const redirectExists = await kvsHandle.exists(uri);

    if (redirectExists) {
      const redirectUrl = await kvsHandle.get(uri);

      if (redirectUrl) {
        console.log("Redirecting: " + uri + " -> " + redirectUrl);

        return redirect(redirectUrl);
      }
    }

    /** as a last pass-through for PDFs  */
    // /wp-content/uploads/2025/07/Case-Bundles-2025-07-15.csv
    const wpContentMatch = uri.match(/\/wp-content\/((.*)[^\/])/);
    if (wpContentMatch) {
      const redirectUrl = `https://admin.climatecasechart.com${uri}`;
      return redirect(redirectUrl);
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
