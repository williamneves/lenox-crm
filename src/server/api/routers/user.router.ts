import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { getUserByIdQueryParams } from '~/db/queries/user/user.query'

export const userRouter = createTRPCRouter({
  getUsers: publicProcedure.query(async ({ ctx }) => {
    // Get the RunQuery function from the context
    const { runQuery } = ctx.sanity
    // Get the query from the context
    const { getUsersQuery } = ctx.sanity.queries.user

    // Return the query
    return runQuery(getUsersQuery)
  }),

  getUserByParam: publicProcedure
    .input(getUserByIdQueryParams)
    .query(async ({ input, ctx }) => {
      // Get the value from the input
      const { field, value } = input
      // Get the RunQuery function from the context
      const { runQuery } = ctx.sanity
      // Get the query from the context
      const { getUserByIdQuery } = ctx.sanity.queries.user

      // Run the query
      const users = await runQuery(getUserByIdQuery(field, value))

      // If no user is found, throw an error
      if (users.length === 0) {
        throw new Error('User not found')
      }

      // Return first user
      return users[0]
    })
})
