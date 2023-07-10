import { q, z } from 'groqd'
import { lib } from '../lib.index'

// ** Queries ** //
// * GRABS * //
const grabWithReferences = {
  ...lib.sale.saleFieldsFetch,
  items: q('items')
    .deref()
    .grab$({
      ...lib.sale.saleItemFields.optional,
      product: q('product').deref().grab$(lib.product.productFieldsFetch)
    })
    .nullable(),
  seller: q('seller').deref().grab$(lib.user.userFieldsFetch),
  streetVendor: q('streetVendor').deref().grab$(lib.user.userFieldsFetch),
  store: q('store').deref().grab$(lib.retailStore.retailStoreFieldsFetch)
}

// * Default Query * //
export const getSalesQuery = q('*')
  .filterByType('sale')
  // Not fetch draft documents
  .filter('!(_id in path("drafts.**"))')
  .grab$(grabWithReferences)

// * Without References Query * //
export const getSalesQueryNoRef = q('*')
  .filterByType('sale')
  // Not fetch draft documents
  .filter('!(_id in path("drafts.**"))')
  .grab$(lib.sale.saleFieldsFetch)
