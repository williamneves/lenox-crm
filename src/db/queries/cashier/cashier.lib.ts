import { q, z } from 'groqd'
import { metaDataFields, referenceFields } from '../commons.lib'
import { retailStoreFieldsFetch } from '../retailStore/retailStore.lib'

// ** CASHIER ** //
// This fields are extracted from sanity/schemas/cashier.doc.ts
export const cashierFields = {
  _type: q.literal('cashier'),
  inactive: q.boolean().optional(),
  name: q.string(),
  retailStoreLinked: q.object(referenceFields).or(q.object(retailStoreFieldsFetch)),
  balance: q.number()
}

export const cashierFieldsFetch = {
  ...metaDataFields,
  ...cashierFields
}

export const cashierFieldsMutationInsert = z.object({
  ...cashierFields,
  retailStoreLinked: q.object(referenceFields)
})

export const cashierFieldsMutationUpdate = cashierFieldsMutationInsert
  .omit({
    _type: true
  })
  .partial()

// ** INPUT PARAMS ** //
export const getCashierByIdParams = z.object({
  id: q.string()
})

export const getCashiersByStoreIdParams = z.object({
  retailStoreId: q.string()
})
