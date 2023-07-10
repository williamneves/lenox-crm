import { q, z } from 'groqd'
import { metaDataFields, referenceFields, type SelectOption } from '../commons.lib'
import { retailStoreFieldsFetch } from '../retailStore/retailStore.lib'

// * Account types labels
export const accountTypesLabels = {
  checking: 'Conta Corrente',
  savings: 'Conta Poupança',
  salary: 'Conta Salário',
  payment: 'Conta Pagamento',
  creditCard: 'Conta Cartão de Crédito',
  creditPlan: 'Conta Crediário'
} as const

export type AccountType = keyof typeof accountTypesLabels

/**
 * @description
 * When need to create a select input with all account types options
 * I create this function to auto update the options when the schema change
 * @returns {
 * Array<{
 *  value: AccountType,
 * label: string,
 * key: AccountType
 * }>
 * }
 * }
 */

export const accountTypeOptions = Object.entries(accountTypesLabels).map(
  ([value, label]) => ({ value, label, key: value } as SelectOption)
)

const accountTypes = Object.keys(accountTypesLabels) as [AccountType, ...AccountType[]]

export const bankAccountFields = {
  _type: q.literal('bankAccount'),
  inactive: q.boolean().optional(),
  name: q.string(),
  bankName: q.string(),
  retailStoresLinked: q
    .array(q.object(referenceFields).optional())
    .or(q.array(q.object(retailStoreFieldsFetch)).optional()),
  bankAccountDetails: q
    .object({
      bankNumber: q.string().optional(),
      routingNumber: q.string().optional(),
      accountNumber: q.string().optional(),
      accountType: z.enum(accountTypes).optional(),
      chavePix: q.string().optional()
    })
    .optional()
}

export const bankAccountFieldsMutationInsert = z.object({
  ...bankAccountFields,
  retailStoresLinked: q.array(q.object(referenceFields)).optional()
})

export const bankAccountFieldsMutationUpdate = bankAccountFieldsMutationInsert
  .omit({
    _type: true
  })
  .partial()

export const bankAccountFieldsFetch = {
  ...metaDataFields,
  ...bankAccountFields
}
