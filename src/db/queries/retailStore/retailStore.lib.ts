import { q } from 'groqd'
import {
  addressFields,
  socialMediaFields,
  referenceFields,
  paymentMethodFields,
  metaDataFields
} from '../commons.lib'
import { userFieldsFetch } from '../user/user.lib'

export const retailStoreFields = {
  _type: q.literal('retailStore'),
  name: q.string(),
  taxId: q.string(),
  phoneNumber: q.string().optional(),
  email: q.string().email().optional(),
  socialMedias: q.array(q.object(socialMediaFields)).optional(),
  paymentMethodsAccepted: q.array(q.object(paymentMethodFields)).optional(),
  address: q.object(addressFields).optional(),
  // systemUsers: q.array(q.object(referenceFields)).or(q.array(q.object(userFieldsFetch)))
  systemUsers: q
    .array(q.object(referenceFields).optional())
    .or(q.array(q.object(userFieldsFetch)).optional())
}

// ** Auxiliars variables and types

/**
 * @description
 * RetailStore fields is a merge with the metadata fields and the retailStore fields
 */
export const retailStoreFieldsFetch = {
  ...metaDataFields,
  ...retailStoreFields
}
