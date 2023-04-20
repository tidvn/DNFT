import "../styles/globals.css";
import { MeshProvider } from "@meshsdk/react";
import Head from "next/head";
function MyApp({ Component, pageProps }) {
  return (
    <MeshProvider>
      <Head>
        <title>Mint NFT in Cardano</title>
        <link rel="icon" type="image/png" href="/icon.png"/>
      </Head>
      <div className="container mx-auto">
      <Component {...pageProps} />
      </div>
    </MeshProvider>
  );
}

export default MyApp;
