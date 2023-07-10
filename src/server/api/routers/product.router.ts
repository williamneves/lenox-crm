import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

import { lib } from '~/db/queries/lib.index'

export const productRouter = createTRPCRouter({
  getProductCategories: publicProcedure.query(async ({ ctx }) => {
    // Get the RunQuery function from the context
    const { runQuery } = ctx.sanity

    // Get the query from the context
    const { getProductCategoriesQuery } = ctx.sanity.queries.product

    // Return the query
    return runQuery(getProductCategoriesQuery)
  }),

  getProductCategoryById: publicProcedure
    .input(lib.product.getProductByCategoryIdQueryParams)
    .query(async ({ input, ctx }) => {
      // Get the value from the input
      const { id } = input
      // Get the RunQuery function from the context
      const { runQuery } = ctx.sanity
      // Get the query from the context
      const { getProductCategoryByIdQuery } = ctx.sanity.queries.product

      // Run the query
      return runQuery(getProductCategoryByIdQuery, { id })
    }),
  getProducts: publicProcedure.query(async ({ ctx }) => {
    // Get the RunQuery function from the context
    const { runQuery } = ctx.sanity

    // Get the query from the context
    const { getProductsQuery } = ctx.sanity.queries.product

    // Return the query
    return runQuery(getProductsQuery)
  }),
  getProductsFilterByCategory: publicProcedure
    .input(lib.product.getProductByCategoryIdQueryParams)
    .query(async ({ input, ctx }) => {
      // Get the value from the input
      const { id } = input
      // Get the RunQuery function from the context
      const { runQuery } = ctx.sanity
      // Get the query from the context
      const { getProductsFilterByCategoryQuery } = ctx.sanity.queries.product

      // Run the query
      return runQuery(getProductsFilterByCategoryQuery, { id })
    }),

  getProductById: publicProcedure
    .input(lib.product.getProductByIdQueryParams)
    .query(async ({ input, ctx }) => {
      // Get the value from the input
      const { id } = input
      // Get the RunQuery function from the context
      const { runQuery } = ctx.sanity
      // Get the query from the context
      const { getProductByIdQuery } = ctx.sanity.queries.product

      // Run the query
      return runQuery(getProductByIdQuery, { id })
    })
})
