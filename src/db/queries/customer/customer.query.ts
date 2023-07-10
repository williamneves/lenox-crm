import { q, z } from 'groqd'
import { lib } from '../lib.index'

// ** Queries ** //
// * GRABS * //
export const grabWithReferences = {
  ...lib.customer.customerFieldsFetch,
  createdBy: q('createdBy').deref().grab$(lib.user.userFieldsFetch),
  stores: q('stores')
    .filter()
    .deref()
    .grab$(lib.retailStore.retailStoreFieldsFetch)
    .nullable()
}

// * Default Query * //
export const getCustomersQuery = q('*')
  .filterByType('customer')
  // Not fetch draft documents
  .filter('!(_id in path("drafts.**"))')
  // Filter only Active Customers
  .filter('inactive != true')
  .grab$(grabWithReferences)
