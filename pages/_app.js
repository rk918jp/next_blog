import '../styles/globals.css'
import {ThemeProvider} from "@mui/styles";
import {CssBaseline} from "@mui/material";
import theme from "../theme";
import {CacheProvider} from "@emotion/react";
import createEmotionCache from "../createEmotionCache";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";

const clientSideEmotionCache = createEmotionCache();

function MyApp({Component, pageProps, emotionCache = clientSideEmotionCache}) {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment} dateFormats={{
      fullDateTime24h: "YYYYMMDD HH:mm"
    }}>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
    </LocalizationProvider>
  )
}

export default MyApp
