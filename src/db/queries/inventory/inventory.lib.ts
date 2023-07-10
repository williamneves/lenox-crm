import { q, z } from 'groqd'
import { metaDataFields, referenceFields } from '../commons.lib'
import { retailStoreFieldsFetch } from '../retailStore/retailStore.lib'
import { productFieldsFetch } from '../product/product.lib'

// *** This fields is based on sanilty/schemas/inventory.doc.ts

// * PRODUCT INVENTORY ** //
export const productInventoryFields = {
  _type: q.literal('productInventory'),
  inactive: q.boolean().optional(),
  product: q.object(productFieldsFetch).or(q.object(referenceFields)),
  qtd: q.number().default(0),
  sugestedPrice: q.number().default(0).optional(),
  suggestedCost: q.number().default(0).optional(),
  lastPurchasePrice: q.number().default(0).optional(),
  lastPurchaseDate: q.date().optional(),
  inventories: q.array(
    q
      .object({
        _type: q.literal('inventory'),
        inactive: q.boolean().optional(),
        name: q.string(),
        retailStoresLinked: q
          .array(q.object(retailStoreFieldsFetch).or(q.object(referenceFields)))
          .optional(),
        products: q.array(q.object(referenceFields).optional())
      })
      .or(q.object(referenceFields))
  )
}

export const productInventoryFetch = {
  ...metaDataFields,
  ...productInventoryFields
}

export const productInventoryFieldsMutationInsert = z.object({
  ...productInventoryFields,
  product: q.object(referenceFields),
  inventory: q.object(referenceFields)
})

export const productInventoryFieldsMutationUpdate = productInventoryFieldsMutationInsert
  .omit({
    _type: true
  })
  .partial()

export const productInventoryFieldsMutationUpdateQtd =
  productInventoryFieldsMutationInsert.pick({
    qtd: true
  })

export const getProductInventoryByIdParams = z.object({
  id: q.string(),
  withProducts: q.boolean().optional()
})

export const getProductInventoryByInventoryIdParams = z.object({
  inventoryId: q.string(),
  withProducts: q.boolean().optional()
})

export const getProductInventoryByProductIdParams = z.object({
  productId: q.string(),
  withProducts: q.boolean().optional()
})

// * INVENTORY ** //
export const inventoryFields = {
  _type: q.literal('inventory'),
  inactive: q.boolean().optional(),
  name: q.string(),
  retailStoresLinked: q
    .array(q.object(retailStoreFieldsFetch).or(q.object(referenceFields)))
    .optional()
}

export const inventoryFetch = {
  ...metaDataFields,
  ...inventoryFields
}

export const inventoryFieldsMutationInsert = z.object({
  ...inventoryFields,
  retailStoresLinked: q.array(q.object(referenceFields)).optional()
})

export const inventoryFieldsMutationUpdate = inventoryFieldsMutationInsert
  .omit({
    _type: true
  })
  .partial()

export const getInventoryByIdParams = z.object({
  id: q.string()
})

export const getInventoryByRetailStoreIdParams = z.object({
  retailStoreId: q.string()
})
