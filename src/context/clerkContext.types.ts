import { z } from 'zod'

import { type User } from '~/db/queries/user/user.lib'

export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type UserDataType = {
  id: number
  role: string
  email: string
  fullName: string
  username: string
  password: string
  avatar?: string | null
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
}

// Regex for username validadion
// Rules, only letters, numbers, underscores, dashes, and dots (no spaces and at @)
export const usernameRegex = /^[a-zA-Z0-9_.-]*$/

// Auth Context With Clerk
export type ClerkAuthValuesType = {
  loading: boolean
  setLoading: (value: boolean) => void
  login: (params: ClerkLoginParamsType) => Promise<void>
  logout: () => Promise<void>
  register?: (params: ClerkRegisterParamsType) => Promise<void>
  user: User | null
  setUser: (value: User | null) => void
}

// Clerk Auth Types with Zod
export const clerkLoginParamsSchema = z.object({
  // Schema uses email or password to login
  identifier: z
    .string()
    .min(3, 'Muito curto')
    .refine(value => {
      if (value.includes('@')) {
        return z.string().email().parse(value)
      }

      return usernameRegex.test(value)
    }, 'Email ou username inválido')
    .transform(value => value.trim()),
  password: z.string().min(4, 'Senha muito curta')
})

export type ClerkLoginParamsType = z.infer<typeof clerkLoginParamsSchema>

export const clerkRegisterParamsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
  confirmPassword: z.string().min(4),
  username: z
    .string()
    .min(3)
    .refine(value => usernameRegex.test(value), 'Must be a valid username')
    .transform(value => value.trim()),
  name: z.string().min(3)
})

export const clerkRegisterParamsSchemaRefined = clerkRegisterParamsSchema.superRefine(
  (data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword']
      })

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['password']
      })

      return false
    }

    return true
  }
)

export type ClerkRegisterParamsType = z.infer<typeof clerkRegisterParamsSchema>

export const clerkResetPasswordParamsSchema = z.object({
  email: z.string().email()
})

export type ClerkResetPasswordParamsType = z.infer<typeof clerkResetPasswordParamsSchema>

export const clerkUpdatePasswordParamsSchema = clerkRegisterParamsSchema.pick({
  password: true,
  confirmPassword: true
})

export type ClerkUpdatePasswordParamsType = z.infer<
  typeof clerkUpdatePasswordParamsSchema
>

export const clerkUpdatePasswordParamsSchemaRefined =
  clerkUpdatePasswordParamsSchema.superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword']
      })

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['password']
      })

      return false
    }

    return true
  })
