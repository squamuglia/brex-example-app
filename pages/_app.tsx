import type { AppProps } from "next/app";
import Nav from "@/components/Nav";
import "tailwindcss/tailwind.css";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main>
      <Nav />
      <div className="m-4">
        <Component {...pageProps} />
      </div>
    </main>
  );
}
export default MyApp;
