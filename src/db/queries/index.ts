import { q, makeSafeQueryRunner, InferType, type TypeFromSelection } from 'groqd'
import { metaDataFields } from './commons.lib'
import * as user from './user/user.query'
import * as retailStore from './retailStore/retailStore.query'
import * as bankAccount from './bankAccount/bankAccount.query'
import * as product from './product/product.query'
import * as inventory from './inventory/inventory.query'
import * as cashier from './cashier/cashier.query'
import * as sale from './sale/sale.query'
import * as customer from './customer/customer.query'

export const employeeFields = {
  name: q.string(),
  email: q.string(),
  user_id: q.string(),
  ...metaDataFields
}

export type Employee = TypeFromSelection<typeof employeeFields>

export const employeeQuery = q('*').filterByType('employee').grab$(employeeFields)

export {
  // User queries
  user,
  // RetailStore queries
  retailStore,
  // BankAccount queries
  bankAccount,
  // Product queries
  product,
  // Inventory queries
  inventory,
  // Cashier queries
  cashier,
  // Sale queries
  sale,
  // Customer queries
  customer
}
