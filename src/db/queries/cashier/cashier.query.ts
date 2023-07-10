import { q, z } from 'groqd'
import { lib } from '../lib.index'

// ** CASHIER QUERIES ** //
export const getCashiersQuery = q('*')
  .filterByType('cashier')
  // Not fetch draft documents
  .filter('!(_id in path("drafts.**"))')
  .grab$({
    ...lib.cashier.cashierFieldsFetch,
    retailStoreLinked: q.object(lib.retailStore.retailStoreFieldsFetch)
  })

export const getCashierByIdQuery = getCashiersQuery.filter('_id == $id')

export const getCashiersByStoreIdQuery = getCashiersQuery.filter(
  'references($retailStoreId)'
)
