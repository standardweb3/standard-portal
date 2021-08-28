import { Fragment, FunctionComponent, useEffect } from 'react';
// next
import { NextComponentType, NextPageContext } from 'next';
import { useRouter } from 'next/router'
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic'
// lingui
import { I18nProvider } from '@lingui/react'
import { i18n } from '@lingui/core'
// emotion
import { ThemeProvider } from '@emotion/react';
// redux
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
// web3
import { Web3ReactProvider } from '@web3-react/core'

// web3 component
import Web3ReactManager from '../components-ui/Web3ReactManager';

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


import '../styles/index.css'
import '../styles/globals.css';

const Web3ProviderNetwork = dynamic(() => import('../components-ui/Web3ProviderNetwork'), { ssr: false })

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

  const Layout = Component.Layout || DefaultLayout
  const Provider = Component.Provider || Fragment
  const Guard = Component.Guard || Fragment

  return (
    <>
     {/* <I18nProvider i18n={i18n} forceRenderOnLocaleChange={false}> */}
      <ThemeProvider theme={darkTheme}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ProviderNetwork getLibrary={getLibrary}>
            <Web3ReactManager>
              <ReduxProvider store={store}>
              <PersistGate loading='loading' persistor={persistor}>
                  <>
                    <ListsUpdater />
                    <UserUpdater />
                    <ApplicationUpdater />
                    <TransactionUpdater />
                    <MulticallUpdater />
                  </>
                  <Provider>
                    <Layout>
                      <Component {...pageProps} />
                    </Layout>
                  </Provider>
                </PersistGate>
              </ReduxProvider>
            </Web3ReactManager>
          </Web3ProviderNetwork>
        </Web3ReactProvider>
      </ThemeProvider>
      {/* </I18nProvider> */}
    </>
  )
}
export default MyApp;
