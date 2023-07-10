import { createTRPCRouter } from '~/server/api/trpc'
import { userRouter } from './routers/user.router'
import { retailStoreRouter } from './routers/rentalStore.router'
import { bankAccountRouter } from './routers/bankAccount.router'
import { productRouter } from './routers/product.router'
import { inventoryRouter } from './routers/inventory.router'
import { saleRouter } from './routers/sale.router'
import { customerRouter } from './routers/customer.router'
import { funcsRouter } from './routers/funcs.router'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  retailStore: retailStoreRouter,
  bankAccount: bankAccountRouter,
  product: productRouter,
  inventory: inventoryRouter,
  sale: saleRouter,
  customer: customerRouter,
  funcs: funcsRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
