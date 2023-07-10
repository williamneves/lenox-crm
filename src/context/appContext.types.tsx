import { type RetailStore } from "src/db/queries/retailStore/retailStore.query"
import { type User } from '~/db/queries/user/user.lib'
import { z } from "zod"

export type AppContextType = {
  retailStore: {
    stores: User['stores']
    setStores: (stores: User['stores']) => void
    selectedStoreId: RetailStore['_id'] | null
    setSelectedStoreId: (storeId: RetailStore['_id'] | null) => void
    selectedStore: RetailStore | null
    setSelectedStore: (store: RetailStore | null) => void
    storeLoading: boolean
    setStoreLoading: (loading: boolean) => void
  }
}

export const storeSelectOptions = (stores: User['stores']) => {
  return stores.map(store => ({
    label: store.name,
    value: store._id,
    key: store._id
  }))
}