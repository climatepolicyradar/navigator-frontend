import { Html, Head, Main, NextScript } from "next/document";
import { generateBrowserEnvConfig } from "@/config";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link rel="stylesheet" href="https://use.typekit.net/qeq0int.css" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__ENV__ = ${JSON.stringify(generateBrowserEnvConfig())};`,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
