import { q, z } from 'groqd'
import { bankAccountFieldsFetch } from './bankAccount.lib'
import { retailStoreFieldsFetch } from '../retailStore/retailStore.lib'

export const getBankAccountsQueryParams = z.object({
  references: z.enum(['with', 'without']).optional()
})

export const getBankAccountByIdQueryParams = z.object({
  id: q.string(),
  references: z.enum(['with', 'without']).optional()
})

export const getBankAccountsQuery = q('*')
  .filterByType('bankAccount')
  // Not fetch draft documents
  .filter('!(_id in path("drafts.**"))')
  .grab$(bankAccountFieldsFetch)

export const getBankAccountsWithRefQuery = q('*')
  .filterByType('bankAccount')
  // Not fetch draft documents
  .filter('!(_id in path("drafts.**"))')
  .grab$({
    ...bankAccountFieldsFetch,
    retailStoresLinked: q('retailStoresLinked')
      .filter()
      .deref()
      .grab$(retailStoreFieldsFetch)
  })

export const getBankAccountByIdQuery = q('*')
  .filterByType('bankAccount')
  // Not fetch draft documents
  .filter('!(_id in path("drafts.**"))')
  .filter(`_id == $id`)
  .grab$(bankAccountFieldsFetch)

export const getBankAccountByIdWithRefQuery = q('*')
  .filterByType('bankAccount')
  // Not fetch draft documents
  .filter('!(_id in path("drafts.**"))')
  .filter(`_id == $id`)
  .grab$({
    ...bankAccountFieldsFetch,
    retailStoresLinked: q('retailStoresLinked')
      .filter()
      .deref()
      .grab$(retailStoreFieldsFetch)
  })
