import { Html, Head, Main, NextScript } from "next/document";

import { COLOUR_SCHEME_STORAGE_KEY } from "@/constants/colourScheme";

// Sets the `dark` class before first paint to avoid a flash of light mode
// Duplicates the cookie parsing in getFeatureFlags - keep in sync
const COLOUR_SCHEME_SCRIPT = `(function () {
  try {
    var match = document.cookie.match(/(?:^|; )feature_flags=([^;]*)/);
    if (!match || JSON.parse(match[1])["dark-mode"] !== true) return;
    var saved = localStorage.getItem("${COLOUR_SCHEME_STORAGE_KEY}");
    var isDark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", isDark);
  } catch (e) {}
})();`;

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link rel="stylesheet" href="https://use.typekit.net/qeq0int.css" />
        {process.env.THEME === "cpr" && <script dangerouslySetInnerHTML={{ __html: COLOUR_SCHEME_SCRIPT }} />}
      </Head>
      <body className="root isolate">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
