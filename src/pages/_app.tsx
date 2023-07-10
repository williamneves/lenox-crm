// ** NEXTJS/REACT IMPORTS **
import Head from 'next/head'
import { type NextPage } from 'next'
import { type AppProps, type AppType } from 'next/app'
import { lazy, useState, useEffect, Suspense } from 'react'
import { Router, useRouter } from 'next/router'

// ** TRPC IMPORTS **
import { api } from 'src/utils/api'

// ** Loader Import
import NProgress, { set } from 'nprogress'
import 'nprogress/nprogress.css'
import { RouterTransition } from 'src/@core/components/RouterTransition'

// ** MANTINE IMPORTS **
import {
  MantineProvider,
  useMantineTheme,
  ColorSchemeProvider,
  type ColorScheme
} from '@mantine/core'
import { Notifications } from '@mantine/notifications'
// Modals
import { ModalsProvider } from '@mantine/modals'
import * as modals from 'src/views/modals'

// Custom Modal Provider
import { CustomModalsProvider } from 'src/context/ModalsContext'

// ** CLERK IMPORTS **
import { ClerkProvider } from '@clerk/nextjs'
import { ptBR } from '@clerk/localizations'
import { ClerkContextProvider } from 'src/context/ClerkContext'

// ** Guards
import GuestGuard from 'src/@core/auth/GuestGuard'
import AuthGuard from 'src/@core/auth/AuthGuard'
import { defaultACLObj } from 'src/@core/configs/acl'

// ** IMPORT COMPONENTS **
import Spinner from 'src/@core/components/Spinner'

// ** REACT QUERY DEVTOOLS IMPORTS **
import { useEffectOnce } from 'usehooks-ts'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import usePersistQueryClient from 'src/hooks/usePersistQueryClient'
import ShellLayout from 'src/@core/layouts/ShellLayout'
import AclGuard from 'src/@core/auth/AclGuard'
import { useColorScheme, useMediaQuery, useToggle, useLocalStorage } from '@mantine/hooks'
import { themeUi } from 'src/@core/theme/theme'
import { AppContextProvider } from 'src/context/AppContext'

// SHOW DEVTOOLS ON PRODUCTION with window.toggleDevtools()
const ReactQueryDevtoolsProduction = lazy(() =>
  import('@tanstack/react-query-devtools/build/lib/index.prod.js').then(d => ({
    default: d.ReactQueryDevtools
  }))
)

// ** Extend App Props
type ExtendedAppProps = AppProps & {
  Component: NextPage
}

type GuardProps = {
  authGuard: boolean
  guestGuard: boolean
  children: React.ReactNode
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>
    // return <>{children}</>;
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>
  } else {
    // return <>{children}</>;

    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
  }
}

const MyApp = ({ Component, pageProps }: ExtendedAppProps) => {
  // ** NEXTJS/REACT HOOKS **
  const router = useRouter()

  const authGuard = Component.authGuard ?? true

  const guestGuard = Component.guestGuard ?? false

  const getLayout = Component.getLayout ?? (page => <ShellLayout>{page}</ShellLayout>)

  const aclAbilities = Component.acl ?? defaultACLObj

  // ** REACT QUERY DEVTOOLS **
  usePersistQueryClient()
  // this way the react query devtools can be downloaded in production using window.toggleDevtools() on console
  const [showDevtools, setShowDevtools] = useState(false)

  const [showDevToolsOnDev, setShowDevToolsOnDev] = useState(true)

  const [pageLoading, setPageLoading] = useState(false)
  useEffectOnce(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.toggleDevtools = () => setShowDevtools(old => !old)
  })

  // Effect to check if the route is /studio/* and disable the showDevtools
  useEffect(() => {
    if (router.pathname.startsWith('/studio')) {
      setShowDevToolsOnDev(false)
    }
  }, [router.pathname])

  // Modals Provider Props
  const isMobile = useMediaQuery('(max-width: 36em)')
  const theme = useMantineTheme()

  // ** MANTINE COLOR SCHEME **
  const preferredColorScheme = useColorScheme()
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'visionsis-color-scheme',
    defaultValue: preferredColorScheme || 'light',
    getInitialValueInEffect: true
  })
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

  if (pageLoading) {
    return <Spinner />
  }

  return (
    <>
      <Head>
        <title>Page title</title>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
      </Head>
      <ClerkProvider localization={ptBR} {...pageProps}>
        <ClerkContextProvider>
          <AppContextProvider>
            <ColorSchemeProvider
              colorScheme={colorScheme}
              toggleColorScheme={toggleColorScheme}
            >
              <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                  /** Put your mantine theme override here */
                  ...themeUi,
                  colorScheme
                }}
              >
                <Notifications limit={5} position='top-right' />
                <RouterTransition />
                <Guard authGuard={authGuard} guestGuard={guestGuard}>
                  <AclGuard
                    aclAbilities={aclAbilities}
                    guestGuard={guestGuard}
                    authGuard={authGuard}
                  >
                    <CustomModalsProvider>
                      <ModalsProvider
                        modalProps={{
                          fullScreen: isMobile,
                          size: 'auto',
                          returnFocus: true,
                          centered: true,
                          shadow: 'md',
                          zIndex: 10000,
                          overlayProps: {
                            color:
                              theme.colorScheme === 'dark'
                                ? theme.colors.dark[9]
                                : theme.colors.gray[2],
                            opacity: 0.55,
                            blur: 3
                          }
                        }}
                        modals={modals}
                      >
                        {getLayout(<Component {...pageProps} />)}
                      </ModalsProvider>
                    </CustomModalsProvider>
                  </AclGuard>
                </Guard>
                {showDevToolsOnDev && (
                  <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
                )}
                {showDevtools && (
                  <Suspense fallback={<Spinner />}>
                    <ReactQueryDevtoolsProduction />
                  </Suspense>
                )}
              </MantineProvider>
            </ColorSchemeProvider>
          </AppContextProvider>
        </ClerkContextProvider>
      </ClerkProvider>
    </>
  )
}

export default api.withTRPC(MyApp)
