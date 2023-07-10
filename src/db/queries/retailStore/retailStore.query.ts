import { type InferType, q, z } from 'groqd'
import { retailStoreFieldsFetch } from './retailStore.lib'
import { userFieldsFetch } from '../user/user.lib'

// ** Queries

/**
 * @description
 * Get all retailStores
 */

export const getRetailStoresQuery = q('*')
  .filterByType('retailStore')
  .grab$(retailStoreFieldsFetch)

/**
 * @description
 * Get retailStore by _id or taxId (field) and the corresponding value
 * @param field - @type { '_id' | 'taxId' }
 * @param value - @type { string }
 * @returns
 * A query that returns the query with the right field and value
 * @example
 * ```ts
 * const query = getRetailStoreByIdQuery('taxId', '123')
 * ```
 */

export const getRetailStoreByIdQueryParams = z.object({
  field: z.enum(['_id', 'taxId']),
  value: q.string(),
  derefUsers: q.boolean().optional().default(true)
})

export const getRetailStoreByIdQuery = (
  params: z.infer<typeof getRetailStoreByIdQueryParams>
) => {
  let query

  if (params.derefUsers) {
    query = {
      ...retailStoreFieldsFetch,
      systemUsers: q('systemUsers').filter().deref().grab$(userFieldsFetch)
    }
  } else {
    query = retailStoreFieldsFetch
  }

  const res = q('*')
    .filterByType('retailStore')
    .filter(`${params.field} == '${params.value}'`)
    .grab$(query)
    .slice(0)

  return res
}

export type RetailStore = InferType<typeof getRetailStoresQuery>[number]
