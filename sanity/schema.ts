import { type SchemaTypeDefinition } from 'sanity'
import address from './schemas/objects/address.obj'
import socialMedia from './schemas/objects/socialMedia.obj'
import demographic from './schemas/objects/demographic.obj'
import employee from './schemas/employee.doc'
import user from './schemas/user.doc'
import retailStore from './schemas/retailStore.doc'
import customer from './schemas/customer.doc'
import bankAccount from './schemas/bankAccount.doc'
import inventory, {productInventory} from './schemas/inventory.doc'
import product, { productCategory } from './schemas/product.doc'
import cashier from './schemas/cashier.doc'
import paymentMethod from './schemas/objects/paymentMethod.obj'
import sale from './schemas/sale.doc'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Objects
    address,
    socialMedia,
    demographic,
    paymentMethod,
    // Documents
    user,
    retailStore,
    sale,
    employee,
    customer,
    bankAccount,
    cashier,
    inventory,
    productInventory,
    product,
    productCategory,
  ],
}
