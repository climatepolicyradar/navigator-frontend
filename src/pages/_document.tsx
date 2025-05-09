import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link rel="stylesheet" href="https://use.typekit.net/qeq0int.css" />
      </Head>
      <body className="root isolate">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
