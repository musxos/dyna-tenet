import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>DynaSwap</title>
        <meta name="description" content="DynaSwap" />
        <link rel="icon" href="/DYNA.png" type="image/pneg" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <div id="modal-root"></div>
      </body>
    </Html>
  );
}
