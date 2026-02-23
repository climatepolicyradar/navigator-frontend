export const COOKIE_CONSENT_NAME = "CPR-CC";
export const COOKIE_TUTORIALS_NAME = "CPR-TT";

// ------------------------------------------------------------
// Shadow Search Experimental Cookies
// ------------------------------------------------------------
// Search history (recent queries); only set when user has accepted cookies.
export const SEARCH_HISTORY_COOKIE_NAME = "CPR-SH";
// Shadow search: document IDs (e.g. slugs) the user has clicked. Not clearable by user.
export const CLICKED_DOCUMENTS_COOKIE_NAME = "CPR-CD";
// Max number of clicked document IDs to keep in the cookie. Change to tune storage.
export const CLICKED_DOCUMENTS_MAX_ITEMS = 50;
// Shadow search: document IDs that have "changed" since last view (drives inbox badge).
export const CHANGED_DOCUMENTS_COOKIE_NAME = "CPR-DC";
export const CHANGED_DOCUMENTS_MAX_ITEMS = 20;
// Shadow search: slugs for which we show "Content for X" (after user returned to search).
export const CONTENT_UPDATED_COOKIE_NAME = "CPR-CU";
export const CONTENT_UPDATED_MAX_ITEMS = 50;
