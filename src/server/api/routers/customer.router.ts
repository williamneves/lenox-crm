import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { lib } from '~/db/queries/lib.index'
import { q, z } from 'groqd'

// ** CUSTOMER ROUTER ** //
export const customerRouter = createTRPCRouter({
  getCustomers: publicProcedure
    .input(lib.customer.getCustomersQueryParams)
    .query(async ({ input, ctx }) => {
      // Get the RunQuery function from the context
      const { runQuery } = ctx.sanity
      // Get the query from the context
      const { getCustomersQuery } = ctx.sanity.queries.customer

      // Get the value from the input
      const { referenceId } = input

      let query = getCustomersQuery

      // If referenceId is provided, filter by referenceId
      if (referenceId) {
        query = query.filter(`references("${referenceId}")`)
      }

      return runQuery(query)
    }),

  getOneCustomer: publicProcedure
    .input(lib.customer.getOneCustomerQueryParams)
    .query(async ({ input, ctx }) => {
      // Get the RunQuery function from the context
      const { runQuery } = ctx.sanity
      // Get the query from the context
      const { grabWithReferences } = ctx.sanity.queries.customer

      // Get the value from the input
      const { id, customerID, cpf } = input

      let filterString = `!(_id in path("drafts.**")) && inactive != true`

      // If id is provided, filter by id, else if customerID is provided, filter by customerID, else if cpf is provided, filter by cpf
      if (id) {
        filterString += ` && _id == "${id}"`
      } else if (customerID) {
        filterString += ` && customerID == "${customerID}"`
      } else if (cpf) {
        filterString += ` && cpf == "${cpf}"`
      }

      const query = q('*')
        .filterByType('customer')
        .filter(filterString)
        .grab$(grabWithReferences)
        .slice(0)

      return runQuery(query)
    }),
  // ** Mutations ** //
  createCustomer: publicProcedure
    .input(lib.customer.createCustomerMutationParams)
    .mutation(async ({ input, ctx }) => {
      // Get the sanity client from the context
      const { client, runQuery } = ctx.sanity

      // Get the query from the context
      const { grabWithReferences } = ctx.sanity.queries.customer

      try {
        // Create the new customer
        const { _id } = await client.create(input, { autoGenerateArrayKeys: true })

        // Create the query to get the new customer
        const query = q('*')
          .filterByType('customer')
          .filter(`_id == "${_id}"`)
          .grab$(grabWithReferences)
          .slice(0)

        // Get the new customer
        return runQuery(query)
      } catch (error) {
        console.log(error)

        throw new Error('Error creating customer')
      }
    }),

  updateCustomer: publicProcedure
    .input(lib.customer.updateCustomerMutationParams)
    .mutation(async ({ input, ctx }) => {
      // Get the sanity client from the context
      const { client } = ctx.sanity

      if (!input._id) throw new Error('No customer id provided')

      try {
        // Update the customer
        return client.patch(input._id).set(input).commit({ autoGenerateArrayKeys: true })
      } catch (error) {
        console.log(error)

        throw new Error('Error updating customer')
      }
    }),

  inactiveCustomer: publicProcedure
    .input(
      z.object({
        _id: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Get the sanity client from the context
      const { client } = ctx.sanity

      try {
        // Delete the customer
        return client.patch(input._id).set({ inactive: true }).commit()
      } catch (error) {
        console.log(error)

        throw new Error('Error deleting customer')
      }
    }),

  activeCustomer: publicProcedure
    .input(
      z.object({
        _id: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Get the sanity client from the context
      const { client } = ctx.sanity

      try {
        // Delete the customer
        return client.patch(input._id).set({ inactive: false }).commit()
      } catch (error) {
        console.log(error)

        throw new Error('Error deleting customer')
      }
    })
})
