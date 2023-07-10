import { q } from 'groqd'
import { z } from 'groqd'
import * as commons from '../commons.lib'
import { userFieldsFetch } from '../user/user.lib'
import { retailStoreFieldsFetch } from '../retailStore/retailStore.lib'
import { isValidPhone, isValidCPF } from '@brazilian-utils/brazilian-utils'

export const customerFields = {
  _type: q.literal('customer'),
  inactive: q.boolean().default(false),
  customerID: q.string().optional(),
  name: q.string().min(3, 'Nome muito curto').max(300, 'Nome muito grande').optional(),
  cpf: q.string().optional()
    .refine(
      value => (!value ? true : isValidCPF(value)), "CPF inválido"
  ),
  avatar: commons.Image.optional(),
  email: q.string().email('Email inválido').optional(),
  phone: q
    .string()
    .optional()
    .refine(
      value => ((value === "" || value === undefined )? true : isValidPhone(value)),
      'Número de telefone inválido'
    )
  ,
  phoneIsWhatsapp: q.boolean().default(false),
  socialMedia: q.array(q.object(commons.socialMediaFields)).optional(),
  demographic: q.object(commons.demographicFields).optional(),
  address: q.object(commons.addressFields).optional(),
  createdBy: q.object(commons.referenceFields).or(q.object(userFieldsFetch)),
  stores: q
    .array(q.object(commons.referenceFields))
    .or(q.array(q.object(retailStoreFieldsFetch)))
    .optional()
}

export const customerFieldsFetch = {
  ...commons.metaDataFields,
  ...customerFields
}

const customerFetch =z.object(customerFieldsFetch)

export type CustomerFetch = z.infer<typeof customerFetch>

// ** Query Params ** //
export const getCustomersQueryParams = z.object({
  referenceId: q.string().optional(),
  customerID: q.string().optional(),
  cpf: q.string().optional(),
  id: q.string().optional(),
  name: q.string().optional(),
  email: q.string().optional(),
  phone: q.string().optional()
})

export const getOneCustomerQueryParams = z.object({
  customerID: q.string().optional(),
  cpf: q.string().optional(),
  id: q.string().optional()
})

// ** Mutations ** //
export const createCustomerMutationParams = z.object({
  ...customerFields,
  avatar: commons.insertImageAsset.optional(),
  createdBy: q.object(commons.referenceFields).optional(),
  stores: q.array(q.object(commons.referenceFields)).optional()
})

export type CreateCustomerParams = z.infer<typeof createCustomerMutationParams>

export const updateCustomerMutationParams = createCustomerMutationParams
  .omit({
    _type: true
  })
  .extend({
    ...commons.metaDataFields
  })
  .deepPartial()

export type UpdateCustomerParams = z.infer<typeof updateCustomerMutationParams>
