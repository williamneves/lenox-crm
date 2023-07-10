// ** React Context API Imports ** //
import { createContext, useContext, ReactNode, useEffect } from 'react'

// ** Libs Imports ** //
import { useAuthContext } from './ClerkContext'
import { api } from 'src/utils/api'
import { z } from 'zod'
import { useSessionStorage } from '@mantine/hooks'

// ** Types ** //
import { type RetailStore } from 'src/db/queries/retailStore/retailStore.query'
import { type AppContextType, storeSelectOptions } from './appContext.types'

// ** Apps ** //
// retailStore
const retailStore = {
  stores: [],
  setStores: () => null,
  selectedStoreId: null,
  setSelectedStoreId: () => null,
  selectedStore: null,
  setSelectedStore: () => null,
  storeLoading: false,
  setStoreLoading: () => null
}

// ** Create Context ** //
const appContextValues: AppContextType = {
  retailStore
}

export const AppContext = createContext<AppContextType>(appContextValues)

// ** Create Context Provider ** //
export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  // ** States ** //
  const [stores, setStores] = useSessionStorage<AppContextType['retailStore']['stores']>({
    key: 'stores',
    defaultValue: retailStore.stores
  })

  const [selectedStoreId, setSelectedStoreId] = useSessionStorage<
    RetailStore['_id'] | null
  >({
    key: 'selectedStoreId',
    defaultValue: retailStore.selectedStoreId
  })

  const [storeLoading, setStoreLoading] = useSessionStorage<boolean>({
    key: 'loading',
    defaultValue: retailStore.storeLoading
  })

  const [selectedStore, setSelectedStore] = useSessionStorage<RetailStore | null>({
    key: 'selectedStore',
    defaultValue: retailStore.selectedStore
  })

  // ** Get User from Auth Context ** //
  const { user } = useAuthContext()

  // When has user, get the user.stores and set it to stores
  useEffect(() => {
    if (user) {
      setStores(user.stores)
    }
  }, [user])

  // ** Get Store Data ** //
  const retailStoreById = api.retailStore.getRetailStoreById.useQuery(
    {
      field: '_id',
      value: selectedStoreId as string,
      derefUsers: true
    },
    {
      enabled: !!selectedStoreId && !!user,
      cacheTime: 1000 * 60 * 60 * 24,
      staleTime: 1000 * 60 * 60 * 12,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false
    }
  )

  useEffect(() => {
    if (retailStoreById.data) {
      setSelectedStore(retailStoreById.data)
    } else {
      setSelectedStore(null)
    }
  }, [retailStoreById.data])

  // Set storeLoading to true when fetching store data
  useEffect(() => {
    if (retailStoreById.isLoading) {
      setStoreLoading(true)
    } else {
      setStoreLoading(false)
    }
  }, [retailStoreById.isLoading])

  return (
    <AppContext.Provider
      value={{
        retailStore: {
          stores,
          setStores,
          selectedStore,
          setSelectedStore,
          storeLoading,
          setStoreLoading,
          selectedStoreId,
          setSelectedStoreId
        }
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// ** Custom Hooks ** //
export const useAppContext = () => useContext(AppContext)
