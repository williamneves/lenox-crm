import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { lib } from '~/db/queries/lib.index'

// ** CASHIER ROUTER ** //
export const cashierRouter = createTRPCRouter({
  getCashiers: publicProcedure.query(async ({ ctx }) => {
    // Get the RunQuery function from the context
    const { runQuery } = ctx.sanity
    // Get the query from the context
    const { getCashiersQuery } = ctx.sanity.queries.cashier

    return runQuery(getCashiersQuery)
  }),

  getCashierById: publicProcedure
    .input(lib.cashier.getCashierByIdParams)
    .query(async ({ input, ctx }) => {
      // Get the RunQuery function from the context
      const { runQuery } = ctx.sanity
      // Get the query from the context
      const { getCashierByIdQuery } = ctx.sanity.queries.cashier

      // Get the value from the input
      const { id } = input

      return runQuery(getCashierByIdQuery, { id })
    }),

  getCashiersByStoreId: publicProcedure
    .input(lib.cashier.getCashiersByStoreIdParams)
    .query(async ({ input, ctx }) => {
      // Get the RunQuery function from the context
      const { runQuery } = ctx.sanity
      // Get the query from the context
      const { getCashiersByStoreIdQuery } = ctx.sanity.queries.cashier

      // Get the value from the input
      const { retailStoreId } = input

      return runQuery(getCashiersByStoreIdQuery, { retailStoreId })
    })
})
