import { q, z } from 'groqd'
import { addressFields, metaDataFields, insertImageAsset } from '../commons.lib'
import { userFields, userFieldsFetch } from './user.lib'

// // ** Auxiliars variables and types

// /**
//  * @description
//  * User fields is a merge with the metadata fields and the user fields
//  */
// export const userFieldsFetch = {
//   ...metaDataFields,
//   ...userFields
// }

/**
 * @description
 * Zod schema for the query params of the getUserByIdQuery
 * @param field - @type { '_id' | 'userId' | 'email' | 'username' }
 * @param value - @type { string }
 */
export const getUserByIdQueryParams = z.object({
  field: z.enum(['_id', 'userId', 'email', 'username']),
  value: q.string(),
  derefRetailStore: q.boolean().optional()
})

// ** Queries

/**
 * @description
 * Get all users
 */

const userStoresField = {
  stores: q('*')
    .filterByType('retailStore')
    .filter('references(^._id)')
    .grab$({
      _id: q.string(),
      name: q.string(),
      taxId: q.string(),
      phoneNumber: q.string().optional(),
      email: q.string().email().optional(),
      address: q.object(addressFields).optional()
    })
}

export const getUsersQuery = q('*')
  .filterByType('user')
  .grab$({
    ...userFieldsFetch,
    ...userStoresField
  })

/**
 * @description
 * Get user by id, email or authId (field) and the corresponding value
 * @param field - @type { '_id' | 'userId' | 'email' | 'username' }
 * @param value - @type { string }
 * @returns
 * A query that returns the query with the right field and value
 * @example
 * ```ts
 * const query = getUserByIdQuery('userId', '123')
 * ```
 */
export const getUserByIdQuery = (
  field: z.infer<typeof getUserByIdQueryParams>['field'],
  value: z.infer<typeof getUserByIdQueryParams>['value']
) => {
  return (
    q('*')
      .filterByType('user')
      // Not fetch draft documents
      .filter('!(_id in path("drafts.**"))')
      .filter(`${field} == '${value}'`)
      .grab$({
        ...userFieldsFetch,
        ...userStoresField
      })
  )
}

// ** Mutations
// With the mutations, we will mix the fields to get the exact we need

/**
 * @description
 * Zod schema for the createUserMutation
 * will spread the userFields and set optional to phoneNumber, avatar and address
 */
export const createUserMutation = z.object({
  ...userFields,
  phoneNumber: q.string().optional(),
  avatar: insertImageAsset.optional(),
  address: q.object(addressFields).deepPartial().optional()
})

/**
 * @description
 * Zod schema for the updateUserMutation
 * will spread the userFields and set optional to phoneNumber, avatar and address
 * and set the fields as deepPartial
 */

export const updateUserMutation = z
  .object({
    ...userFields,
    phoneNumber: q.string().optional(),
    avatar: q
      .object({
        _type: q.literal('image'),
        asset: q.object({
          _type: q.literal('reference'),
          _ref: q.string()
        })
      })
      .optional(),
    address: q.object(addressFields).deepPartial().optional()
  })
  .deepPartial()
