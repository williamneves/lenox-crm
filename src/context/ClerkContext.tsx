// ** React Imports
import React, {
  createContext,
  useState,
  type ReactNode,
  useEffect,
  useContext
} from 'react'

// ** Utils
import { useAuth, useSignIn } from '@clerk/nextjs'
import { api } from '~/utils/api'

// ** Types
import { type ClerkAuthValuesType, type ClerkLoginParamsType } from './clerkContext.types'
import { type User } from '~/db/queries/user/user.lib'
import { useRouter } from 'next/router'

// ** Create Context
const clerkContextValues: ClerkAuthValuesType = {
  user: null,
  setUser: () => null,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  loading: true,
  setLoading: () => null
}

export const ClerkContext = createContext<ClerkAuthValuesType>(clerkContextValues)

// ** Create Context Provider
export const ClerkContextProvider = ({ children }: { children: ReactNode }) => {
  // ** Get Auth Object
  const auth = useAuth()
  const { signIn, setActive } = useSignIn()

  const router = useRouter()

  // ** States
  const [user, setUser] = useState<User | null>(clerkContextValues.user)
  const [loading, setLoading] = useState(clerkContextValues.loading)

  // ** Api
  const {
    data: userData,
    isLoading: userDataIsLoading,
    refetch: refreshUser,
    isFetching: fethingUser
  } = api.user.getUserByParam.useQuery(
    {
      field: 'userId',
      value: auth.userId as string
    },
    {
      enabled: !!auth.userId,
      // Cache user data for 24 hour
      cacheTime: 1000 * 60 * 60 * 24,
      // Stale time for 12 hours
      staleTime: 1000 * 60 * 60 * 12,
      // Not refetch on window focus
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
      retry: 1
    }
  )

  // ** Functions
  const resetUser = () => {
    setUser(null)
  }

  const login = async ({ identifier, password }: ClerkLoginParamsType) => {
    if (!signIn) {
      throw {
        code: 'login_error',
        message: 'Autenticação não disponível no momento'
      }
    }

    try {
      const loginByIdentifier = await signIn.create({
        identifier,
        password
      })

      if (loginByIdentifier.status === 'complete') {
        await setActive({ session: loginByIdentifier.createdSessionId })
      }
    } catch (err: any) {
      if (
        err.errors[0].code === 'form_identifier_not_found' ||
        err.errors[0].code === 'form_password_incorrect'
      ) {
        throw {
          code: 'params_invalid',
          message: 'Identificador ou senha incorretos'
        }
      } else {
        console.error('error', JSON.stringify(err, null, 2))
        throw {
          code: 'login_error',
          message: 'Erro ao fazer login'
        }
      }
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      // router.push('/auth/login')
      await auth.signOut()
      // Invalidate user data
      refreshUser()
    } catch (err: any) {
      console.error('error', JSON.stringify(err, null, 2))
    } finally {
      resetUser()
      setLoading(false)
    }
  }

  // ** Effects
  useEffect(() => {
    if (!auth.isLoaded || fethingUser) {
      setLoading(true)
      return
    }
    // No User is signed in
    if (!auth.isSignedIn && auth.isLoaded && !auth.userId) {
      resetUser()
      setLoading(false)
    }

    // User is signed in
    if (auth.userId && userData) {
      setUser(userData)
      setLoading(false)
    }
  }, [auth.isLoaded, auth.isSignedIn, auth.userId, userData, fethingUser])

  useEffect(() => {
    // If user session not found, but has userData, logout user
    // This happens when user session is expired, or banned
    if (!auth.isSignedIn && auth.isLoaded && userData) {
      console.log('Session for the userData not found, logging out user')
      logout()
    }
  }, [user, auth])

  // ** Return Provider
  return (
    <ClerkContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
        setLoading
      }}
    >
      {children}
    </ClerkContext.Provider>
  )
}

// ** Create Context Hook
export const useAuthContext = () => useContext(ClerkContext)
