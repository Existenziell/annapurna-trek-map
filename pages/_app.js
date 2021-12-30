import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import Layout from '../components/_Layout'
import Head from 'next/head'

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Annapurna Circuit Trek | christof.digital</title>
        <meta name='description' content='Follow me on the Annapurna Circuit Trek in Nepal, 2019 | christof.digital | shift-happens' />
        <link rel='icon' href='/favicon/favicon.ico' />
        <link rel='apple-touch-icon' sizes='180x180' href='/favicon/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon/favicon-16x16.png' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin="true" />
        <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Gotu&display=swap' />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}

export default App
