import '../bootstrap'
import Head from 'next/head'
import { Fragment, FunctionComponent, useEffect } from 'react';
// next
import { NextComponentType, NextPageContext } from 'next';
import { useRouter } from 'next/router'
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic'
import ReactGA from 'react-ga'

// lingui
// import { I18nProvider } from '@lingui/react'
// import { i18n } from '@lingui/core'
// emotion
import { ThemeProvider } from '@emotion/react';
// redux
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
// web3
import { Web3ReactProvider } from '@web3-react/core'

// web3 component
import Web3ReactManager from '../components-ui/Web3ReactManager';
import { NetworkLogger } from '../components-ui/NetworkLogger';

// functions
import getLibrary from '../functions/getLibrary'
import { darkTheme } from '../theme/theme';
import DefaultLayout from '../layouts/Default'
import store, { persistor } from '../state'

// updaters
import ApplicationUpdater from '../state/application/updater'
import ListsUpdater from '../state/lists/updater'
import MulticallUpdater from '../state/multicall/updater'
import TransactionUpdater from '../state/transactions/updater'
import UserUpdater from '../state/user/updater'
import NetworkGuard from '../guards/Network';


import '../styles/index.css'
import '../styles/globals.css';
import { ChainId } from '@digitalnative/standard-protocol-sdk';
import { useActiveWeb3React } from '../hooks';

const Web3ProviderNetwork = dynamic(() => import('../components-ui/Web3ProviderNetwork'), { ssr: false })
// const Web3ProviderNetworkBridge = dynamic(() => import('../components-ui/Web3ProviderBridge'), { ssr: false })

function MyApp({
  Component,
  pageProps,
}: AppProps & {
  Component: NextComponentType<NextPageContext> & {
    Guard: FunctionComponent
    Layout: FunctionComponent
    Provider: FunctionComponent
  }
}) {
  const router = useRouter()

  const { pathname, query, locale } = router

  // useEffect(() => {
  //   async function load(locale) {
  //     const { messages } = await import(`@lingui/loader!./../../locale/${locale}.po`)
  //     i18n.loadLocaleData(locale, { plurals: plurals[locale] })
  //     i18n.load(locale, messages)
  //     i18n.activate(locale)
  //   }
  //   load(locale)
  // }, [locale])

  useEffect(() => {
    ReactGA.initialize(process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_PROD : process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_DEV)

    const errorHandler = (error) => {
      ReactGA.exception({
        description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
        fatal: true,
      })
    }

    window.addEventListener('error', errorHandler)

    return () => window.removeEventListener('error', errorHandler)
  }, [])

  useEffect(() => {
    ReactGA.pageview(`${pathname}${query}`)
  }, [pathname, query])


  const Layout = Component.Layout || DefaultLayout
  const Provider = Component.Provider || Fragment
  // const Guard = Component.Guard || Fragment

  return (
    <>
    <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <title key="title">Standard Protocol</title>

        <meta
          key="description"
          name="description"
          content="Standard Protocol, building the next multichain money"
        />

        <meta name="application-name" content="Standard" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Standard" />

        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#F338C3" />

        <meta key="twitter:card" name="twitter:card" content="app" />
        <meta key="twitter:title" name="twitter:title" content="Standard" />
        <meta key="twitter:url" name="twitter:url" content="https://apps/standard.tech" />
        <meta
          key="twitter:description"
          name="twitter:description"
          content="Standard Protocol, building the next multichain finance standard"
        />
        {/* <meta key="twitter:image" name="twitter:image" content="https://app.sushi.com/icons/icon-192x192.png" /> */}
        <meta key="twitter:creator" name="twitter:creator" content="@standarddefi" />
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:site_name" property="og:site_name" content="Standard" />
        <meta key="og:url" property="og:url" content="https://apps.standard.tech" />
        {/* <meta key="og:image" property="og:image" content="https://app.sushi.com/apple-touch-icon.png" /> */}
        <meta
          key="og:description"
          property="og:description"
          content="Standard Protocol, building the next multichain finance standard"
        />
        {/* metamask image*/}
        <link rel="shortcut icon" href="https://i.imgur.com/hIKSt2P.png" />
        {/* Remove notch in iOS*/}
        <meta name="viewport" content="initial-scale=1, viewport-fit=cover, width=device-width"></meta>
        <meta name="apple-mobile-web-app-capable" content="yes"></meta>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"></meta>
      </Head>
     {/* <I18nProvider i18n={i18n} forceRenderOnLocaleChange={false}> */}
      <ThemeProvider theme={darkTheme}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ProviderNetwork getLibrary={getLibrary}>

              <ReduxProvider store={store}>
              <PersistGate loading='loading' persistor={persistor}>
              <Web3ReactManager>

                  <>
                    <NetworkLogger/>
                    <ListsUpdater />
                    <UserUpdater />
                    <ApplicationUpdater />
                    <TransactionUpdater />
                    <MulticallUpdater />
                  <Provider>
                    <Layout>
                      <NetworkGuard networks={[ChainId.RINKEBY, ChainId.SHIBUYA, ChainId.SHIDEN]}>
                        <Component {...pageProps} />
                      </NetworkGuard>
                    </Layout>
                  </Provider>
                  </>

                  </Web3ReactManager>

                </PersistGate>
              </ReduxProvider>
          </Web3ProviderNetwork>
        </Web3ReactProvider>
      </ThemeProvider>
      {/* </I18nProvider> */}
    </>
  )
}
export default MyApp;
