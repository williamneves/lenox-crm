import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

import { lib } from '~/db/queries/lib.index'

export const inventoryRouter = createTRPCRouter({
  // ** Product Inventory **
  // Get all product inventory
  getProductInventories: publicProcedure.query(async ({ ctx }) => {
    // Get the RunQuery function from the context
    const { runQuery } = ctx.sanity

    // Get the query from the context
    const { getProductInventories } = ctx.sanity.queries.inventory

    // Return the query
    return runQuery(getProductInventories)
  }),

  // Get product inventory by id
  getProductInventoryById: publicProcedure
    .input(lib.inventory.getProductInventoryByIdParams)
    .query(async ({ input, ctx }) => {
      // Get the value from the input
      const { id } = input
      // Get the RunQuery function from the context
      const { runQuery } = ctx.sanity
      // Get the query from the context
      const { getProductInventoryById } = ctx.sanity.queries.inventory

      // Run the query
      return runQuery(getProductInventoryById, { id })
    }),

  // Get product inventory by product id
  getProductInventoryByProductId: publicProcedure

    .input(lib.inventory.getProductInventoryByProductIdParams)
    .query(async ({ input, ctx }) => {
      // Get the value from the input
      const { productId } = input
      // Get the RunQuery function from the context
      const { runQuery } = ctx.sanity
      // Get the query from the context
      const { getProductInventoryByProductId } = ctx.sanity.queries.inventory

      // Run the query
      return runQuery(getProductInventoryByProductId, { productId })
    }),

  // ** Inventory **
  // Get all inventory
  getInventories: publicProcedure.query(async ({ ctx }) => {
    // Get the RunQuery function from the context
    const { runQuery } = ctx.sanity

    // Get the query from the context
    const { getInventories } = ctx.sanity.queries.inventory

    // Return the query
    return runQuery(getInventories)
  }),

  // Get inventory by id
  getInventoryById: publicProcedure
    .input(lib.inventory.getInventoryByIdParams)
    .query(async ({ input, ctx }) => {
      // Get the value from the input
      const { id } = input
      // Get the RunQuery function from the context
      const { runQuery } = ctx.sanity
      // Get the query from the context
      const { getInventoryById } = ctx.sanity.queries.inventory

      // Run the query
      return runQuery(getInventoryById, { id })
    }),

  // Get inventory by product id
  getInventoryByRetailStore: publicProcedure
    .input(lib.inventory.getInventoryByRetailStoreIdParams)
    .query(async ({ input, ctx }) => {
      // Get the value from the input
      const { retailStoreId } = input
      // Get the RunQuery function from the context
      const { runQuery } = ctx.sanity
      // Get the query from the context
      const { getInventoryByRetailStoreId } = ctx.sanity.queries.inventory

      // Run the query
      return runQuery(getInventoryByRetailStoreId, { retailStoreId })
    })
})
