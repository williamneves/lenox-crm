// ** React Imports
import { type ReactNode, type ReactElement, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuthContext } from '~/context/ClerkContext'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props

  const auth = useAuthContext()
  const router = useRouter()

  const [routerInTransition, setRouterInTransition] = useState(false)

  useEffect(() => {
    const handleStart = () => {
      setRouterInTransition(true)
    }
    const handleComplete = () => {
      setRouterInTransition(false)
    }
    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)
    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router.pathname])

  useEffect(
    () => {

      if (routerInTransition) {
        return
      }

      if (auth.user === null && !auth.loading) {
        if (router.asPath !== '/') {
          router.replace({
            pathname: '/auth/login',
            query: { returnUrl: router.asPath }
          })
        } else {
          router.replace('/auth/login')
        }
      }
    },
    [auth.user, auth.loading, routerInTransition]
  )

  if (auth.loading || auth.user === null) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
