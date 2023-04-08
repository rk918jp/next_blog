// import "../wdyr";
import "../styles/globals.css";
import { ThemeProvider } from "@mui/styles";
import { CssBaseline } from "@mui/material";
import theme from "../theme";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "../createEmotionCache";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useEffect } from "react";
import { init, push } from "@socialgouv/matomo-next";
import { useRouter } from "next/router";

const clientSideEmotionCache = createEmotionCache();

function MyApp(props) {
  const router = useRouter();
  const { Component, pageProps, emotionCache = clientSideEmotionCache } = props;

  useEffect(() => {
    init({
      url: process.env.NEXT_PUBLIC_MATOMO_URL,
      siteId: process.env.NEXT_PUBLIC_MATOMO_SITE_ID,
      onRouteChangeComplete: ({ router }) => {
        console.log(...arguments);
        push(["setUserId", 1]);
        push([
          "trackEvent",
          "eventCategory",
          "eventAction",
          "eventName",
          10, // eventValue
        ]);
        push(["trackPageView"]);
      },
      onInitialization: () => {
        // return;
        console.log(...arguments);
      },
    });
  }, []);

  return (
    <LocalizationProvider
      dateAdapter={AdapterMoment}
      dateFormats={{
        fullDateTime24h: "YYYYMMDD HH:mm",
      }}
    >
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
    </LocalizationProvider>
  );
}

MyApp.whyDidYouRender = true;

export default MyApp;
