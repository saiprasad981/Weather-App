import '../styles/globals.css'
import Head from 'next/head'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>WeatherAI Pro - Smart Weather Forecasting</title>
        <meta name="description" content="Next-gen weather intelligence with AI-powered insights" />
        {/* Emoji favicon - works in most modern browsers */}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌤️</text></svg>" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}