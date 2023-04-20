import "../styles/globals.css";
import { MeshProvider } from "@meshsdk/react";
import Head from "next/head";
import Link from "next/link";
function MyApp({ Component, pageProps }) {
  return (
    <MeshProvider>
      <Head>
        <title>Mint an Cardano NFT</title>
        <link rel="icon" type="image/png" href="/icon.png"/>
      </Head>
      <div className="container mx-auto">
      <Component {...pageProps} />
      </div>
      <footer className="footer footer-center p-4 bg-base text-white-content">
      <div>
      <p>This is a mini project under Student Scientific Research Program. Developed by Phung Tien Dung (tiendung0325@gmail.com) with the support of Cardano2vn.io</p>
      </div>
      </footer>
    </MeshProvider>
  );
}

export default MyApp;
