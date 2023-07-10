import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ name: z.string(), id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Create a client mudation

      // console.log('input\n\n', input, '\n\n')
      ctx.sanity.client
        .patch(input.id)
        .set({
          name: input.name
        })
        .commit()
        .then(res => {
          // console.log('res\n\n', res, '\n\n')

          return res
        })
        .catch(err => {
          // console.log('err\n\n', err, '\n\n')
        })
    }),

  test: publicProcedure
    .input(z.object({ name: z.string(), id: z.string().nullish() }))
    .query(async ({ input, ctx }) => {
      // Create a client mudation

      // console.log('input\n\n', input, '\n\n')
      try {
        // const res = ctx.sanity.client
        //   .patch(input.id as string)
        //   .set({
        //     name: input.name
        //   })
        //   .commit()
        const res = await ctx.sanity.client.fetch('*[_type == "user"]{...,}')

        // console.log('res\n\n', res, '\n\n')
        return res
      } catch (err) {
        // console.log('err\n\n', err, '\n\n')
        return err
      }
    })
})
