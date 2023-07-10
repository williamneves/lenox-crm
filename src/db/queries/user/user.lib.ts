import { q } from 'groqd'
import { z } from 'groqd'
import {
  Image,
  ImageAsset,
  addressFields,
  referenceFields,
  socialMediaFields,
  type SelectOption,
  metaDataFields
} from '../commons.lib'
import { type InferType } from 'groqd'
import { type getUsersQuery } from './user.query'
import { retailStoreFields } from '../retailStore/retailStore.lib'
import { isValidCEP, isValidPhone, isValidCPF } from '@brazilian-utils/brazilian-utils'

// import { User } from '@clerk/nextjs/dist/types/server'

export const Role = z.enum([
  'root',
  'admin',
  'manager',
  'seller',
  'outdoor',
  'financial',
  'stock',
  'delivery',
  'accountant',
  'customer'
])
export const Permission = z.enum(['manager', 'create', 'read', 'update', 'delete'])

export const roleTitles: Record<string, string> = {
  root: 'Root User',
  admin: 'Admin',
  manager: 'Manager',
  seller: 'Vendedor',
  outdoor: 'Street',
  financial: 'Financeiro',
  stock: 'Estoque',
  delivery: 'Entregador',
  accountant: 'Contador',
  customer: 'Cliente'
}

export const permissionTitles: Record<string, string> = {
  manage: 'All',
  create: 'Criar',
  read: 'Ler',
  update: 'Atualizar',
  delete: 'Deletar'
}

export const roleSelectOptions: Record<string, SelectOption> = Object.fromEntries(
  Role.options.map(role => [
    role,
    {
      value: role,
      key: role,
      label: roleTitles[role] || 'No title provided'
    }
  ])
)

export const permissionSelectOptions: Record<string, SelectOption> = Object.fromEntries(
  Permission.options.map(permission => [
    permission,
    {
      value: permission,
      key: permission,
      label: permissionTitles[permission] || 'No title provided'
    }
  ])
)

export const userFields = {
  _type: q.literal('user'),
  inactive: q.boolean().default(false),
  userId: q.string(),
  name: q.string(),
  email: q.string().email(),
  username: q.string(),
  roles: q.array(
    q.object({
      profile: Role,
      permissions: q.array(Permission)
    })
  ),
  phoneNumber: q.string().optional().refine(value => !value ? true : isValidPhone(value), "Número de telefone inválido"),
  avatar: Image.optional(),
  address: q.object(addressFields).deepPartial().optional()
}

// User Type
export type User = InferType<typeof getUsersQuery>[number]

// ** Auxiliars variables and types

/**
 * @description
 * User fields is a merge with the metadata fields and the user fields
 */
export const userFieldsFetch = {
  ...metaDataFields,
  ...userFields
}
