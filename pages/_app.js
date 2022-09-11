import '../styles/globals.css'
import {ThemeProvider} from "@mui/styles";
import {CssBaseline} from "@mui/material";
import theme from "../theme";
import {CacheProvider} from "@emotion/react";
import createEmotionCache from "../createEmotionCache";

const clientSideEmotionCache = createEmotionCache();

function MyApp({Component, pageProps, emotionCache = clientSideEmotionCache}) {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  )
}

export default MyApp
