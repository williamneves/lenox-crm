// ** React Imports
import { type ReactNode, type ReactElement, useEffect, useState, use } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuthContext } from '~/context/ClerkContext'
import getHomeRoute from '~/@core/acl/getHomeRoute'

interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const GuestGuard = (props: GuestGuardProps) => {
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

  useEffect(() => {

    if (routerInTransition) {
      return
    }
    
    if (!auth.loading && auth.user !== null) {
      const homeRoute = getHomeRoute(auth.user.roles)

      router.replace(homeRoute)
    }
  }, [auth.user, auth.loading, routerInTransition])

  if (auth.loading || auth.user !== null) {
    return fallback
  }

  return <>{children}</>
}

export default GuestGuard
