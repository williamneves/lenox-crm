import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from 'src/server/api/trpc'
import promieseCep from 'cep-promise'

import { getStates, getCities } from '@brazilian-utils/brazilian-utils'
import {
  StateCode,
  STATES_DATA,
  StateName
} from '@brazilian-utils/brazilian-utils/dist/common/states'

export const funcsRouter = createTRPCRouter({
  getCep: publicProcedure
    .input(
      z.object({
        cep: z
          .string()
          .regex(/^[0-9]{5}-?[\d]{3}$/, 'CEP inválido')
          .optional()
      })
    )
    .query(async ({ input }) => {
      if (!input.cep) return null
      const cep = input.cep.replace('-', '')
      try {
        const address = await promieseCep(cep)
        return address
      } catch (error) {
        return {
          error: true,
          message: 'CEP não encontrado'
        }
      }
    })
})
