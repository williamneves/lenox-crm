import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { lib } from '~/db/queries/lib.index'
import { type InferType } from 'groqd'

export const saleRouter = createTRPCRouter({
  getSales: publicProcedure
    .input(lib.sale.getSalesQueryParams)
    .query(async ({ input, ctx }) => {
      // Get UseQuery from context
      const { runQuery } = ctx.sanity

      // Get the params from the input
      const {
        saleStatus,
        range,
        endDate,
        startDate,
        filterByRefId,
        order,
        orderBy,
        pagination
      } = input

      // Get the sale query from the context
      const { getSalesQuery } = ctx.sanity.queries.sale

      let query = getSalesQuery

      let filterQuery = ``

      // If there is a range, add it to the filter query
      if (range) {
        filterQuery += getRangeStringFilter(range, startDate, endDate, orderBy)
      }

      query = query.filter(filterQuery)

      // If filterByRefId is true, add the filter to the query
      if (filterByRefId) {
        query = query.filter(`references('${filterByRefId}')`)
      }

      // If order is not undefined, add it to the query
      if (order) {
        if (orderBy) {
          query = query.order(`${orderBy} ${order}`)
        } else {
          query = query.order(`_createdAt ${order}`)
        }
      }

      // Setup the query
      return runQuery(query)
    })
})

type Range = InferType<typeof lib.sale.getSalesQueryParams>['range']
type OrderBy = InferType<typeof lib.sale.getSalesQueryParams>['orderBy']

function getRangeStringFilter(
  range: Range,
  startDate?: Date,
  endDate?: Date,
  OrderBy?: OrderBy
) {
  const filterParam = OrderBy ? OrderBy : '_createdAt'

  if (!range) return ''
  switch (range) {
    case 'day':
      // Create a endDate with today at 23:59:59
      const today = new Date()
      today.setHours(23, 59, 59, 999)
      // Create a start date with 24 hours ago
      const twentyFourHoursAgo = new Date()
      twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1)

      // Now return the range string
      return `(${filterParam} >= "${twentyFourHoursAgo.toDateString()}" && ${filterParam} <= "${today.toISOString()}")`

    case 'week':
      // Create a start date with 7 days ago at 00:00:00
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      sevenDaysAgo.setHours(0, 0, 0, 0)

      // Create a endDate with today at 23:59:59
      const today2 = new Date()
      today2.setHours(23, 59, 59, 999)

      // Now return the range string
      return `(${filterParam} >= "${sevenDaysAgo.toISOString()}" && ${filterParam} <= "${today2.toISOString()}")`

    case 'month':
      // Create a start date with 30 days ago at 00:00:00
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      thirtyDaysAgo.setHours(0, 0, 0, 0)

      // Create a endDate with today at 23:59:59
      const today3 = new Date()
      today3.setHours(23, 59, 59, 999)

      // Now return the range string
      return `(${filterParam} >= "${thirtyDaysAgo.toISOString()}" && ${filterParam} <= "${today3.toISOString()}")`

    case '3months':
      // Create a start date with 90 days ago at 00:00:00
      const ninetyDaysAgo = new Date()
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
      ninetyDaysAgo.setHours(0, 0, 0, 0)

      // Create a endDate with today at 23:59:59
      const today4 = new Date()
      today4.setHours(23, 59, 59, 999)

      // Now return the range string
      return `(${filterParam} >= "${ninetyDaysAgo.toISOString()}" && ${filterParam} <= "${today4.toISOString()}")`

    case 'custom':
    default:
      let rangeString = ''

      if (startDate && endDate) {
        rangeString = `(${filterParam} >= "${startDate.toISOString()}" && ${filterParam} <= "${endDate.toISOString()}")`
      } else if (startDate) {
        rangeString = `(${filterParam} >= "${startDate.toISOString()}")`
      } else if (endDate) {
        // Create a start date with 30 days ago at 00:00:00
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        thirtyDaysAgo.setHours(0, 0, 0, 0)

        // Now return the range string
        rangeString = `(${filterParam} >= "${thirtyDaysAgo.toISOString()}" && ${filterParam} <= "${endDate}")`
      }

      return rangeString
  }
}
