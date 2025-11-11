import "../styles/globals.css";
import { ThemeProvider } from "next-themes";

import Head from 'next/head';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // registrar solo en producción
      if (process.env.NODE_ENV === 'production') {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('SW registration failed:', err);
        });
      }
    }
  }, []);

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;