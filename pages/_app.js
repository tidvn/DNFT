import "../styles/globals.css";
import { MeshProvider } from "@meshsdk/react";

function MyApp({ Component, pageProps }) {
  return (
    <MeshProvider>
      <div className="container mx-auto">
      <Component {...pageProps} />
      </div>
    </MeshProvider>
  );
}

export default MyApp;
