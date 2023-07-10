import { z } from 'zod'
import { getRetailStoreByIdQueryParams } from '~/db/queries/retailStore/retailStore.query'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

export const retailStoreRouter = createTRPCRouter({
  getRetailStores: publicProcedure.query(async ({ input, ctx }) => {
    const { getRetailStoresQuery } = ctx.sanity.queries.retailStore

    return ctx.sanity.runQuery(getRetailStoresQuery)
  }),

  getRetailStoreById: publicProcedure
    .input(getRetailStoreByIdQueryParams)
    .query(async ({ input, ctx }) => {
      const { getRetailStoreByIdQuery } = ctx.sanity.queries.retailStore

      return ctx.sanity.runQuery(getRetailStoreByIdQuery(input))
    })
})
