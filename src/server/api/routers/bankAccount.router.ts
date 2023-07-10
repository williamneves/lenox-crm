import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import {
  getBankAccountsQueryParams,
  getBankAccountByIdQueryParams
} from '~/db/queries/bankAccount/bankAccount.query'

export const bankAccountRouter = createTRPCRouter({
  getBankAccounts: publicProcedure
    .input(getBankAccountsQueryParams)
    .query(async ({ input, ctx }) => {
      // Get the RunQuery function from the context
      const { runQuery } = ctx.sanity
      // Get the query from the context
      const { getBankAccountsQuery, getBankAccountsWithRefQuery } =
        ctx.sanity.queries.bankAccount

      // Get the references value from the input
      const { references } = input

      // If references is not defined, return the query without references
      if (!references || references === 'without') {
        return runQuery(getBankAccountsQuery)
      }

      // If references is defined, return the query with references
      return runQuery(getBankAccountsWithRefQuery)
    }),

  getBankAccountById: publicProcedure
    .input(getBankAccountByIdQueryParams)
    .query(async ({ input, ctx }) => {
      // Get the RunQuery function from the context
      const { runQuery } = ctx.sanity
      // Get the query from the context
      const { getBankAccountByIdQuery, getBankAccountByIdWithRefQuery } =
        ctx.sanity.queries.bankAccount

      // Get the value from the input
      const { references, id } = input

      // If references is not defined, return the query without references
      if (!references || references === 'without') {
        return runQuery(getBankAccountByIdQuery, { id })
      }

      // If references is defined, return the query with references
      return runQuery(getBankAccountByIdWithRefQuery, { id })
    })
})
