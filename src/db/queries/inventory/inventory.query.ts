import { q, z } from 'groqd'

import { lib } from '../lib.index'

// * PRODUCT INVENTORY ** //
export const getProductInventories = q('*')
  .filterByType('productInventory')
  // Not fetch draft documents
  .filter('!(_id in path("drafts.**"))')
  .grab$(lib.inventory.productInventoryFetch)

export const getProductInventoryById = q('*')
  .filterByType('productInventory')
  // Not fetch draft documents
  .filter('!(_id in path("drafts.**"))')
  .filter(`_id == $id`)
  .grab$(lib.inventory.productInventoryFetch)

export const getProductInventoryByInventoryId = q('*')
  .filterByType('productInventory')
  // Not fetch draft documents
  .filter('!(_id in path("drafts.**"))')
  .filter(`inventory._id == $inventoryId`)
  .grab$(lib.inventory.productInventoryFetch)

export const getProductInventoryByProductId = q('*')
  .filterByType('productInventory')
  // Not fetch draft documents
  .filter('!(_id in path("drafts.**"))')
  .filter(`product._id == $productId`)
  .grab$(lib.inventory.productInventoryFetch)

// * INVENTORY ** //
const withProducts = q('*')
  .filterByType('productInventory')
  // Not fetch draft documents
  .filter('!(_id in path("drafts.**"))')
  .filter(`references(^._id)`)
  .grab$(lib.inventory.productInventoryFetch)

export const getInventories = q('*')
  .filterByType('inventory')
  // Not fetch draft documents
  .filter('!(_id in path("drafts.**"))')
  .grab$(lib.inventory.inventoryFetch)

export const getInventoriesWithProducts = q('*')
  .filterByType('inventory')
  // Not fetch draft documents
  .filter('!(_id in path("drafts.**"))')
  .grab$({ ...lib.inventory.inventoryFetch, products: withProducts })

export const getInventoryById = q('*')
  .filterByType('inventory')
  // Not fetch draft documents
  .filter('!(_id in path("drafts.**"))')
  .filter(`_id == $id`)
  .grab$(lib.inventory.inventoryFetch)

export const getInventoryByIdWithProducts = q('*')
  .filterByType('inventory')
  // Not fetch draft documents
  .filter('!(_id in path("drafts.**"))')
  .filter(`_id == $id`)
  .grab$({ ...lib.inventory.inventoryFetch, products: withProducts })

export const getInventoryByRetailStoreId = q('*')
  .filterByType('inventory')
  // Not fetch draft documents
  .filter('!(_id in path("drafts.**"))')
  .filter(`retailStoresLinked._id == $retailStoreId`)
  .grab$(lib.inventory.inventoryFetch)

export const getInventoryByRetailStoreIdWithProducts = q('*')
  .filterByType('inventory')
  // Not fetch draft documents
  .filter('!(_id in path("drafts.**"))')
  .filter(`retailStoresLinked._id == $retailStoreId`)
  .grab$({ ...lib.inventory.inventoryFetch, products: withProducts })
