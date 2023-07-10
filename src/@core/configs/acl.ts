import { AbilityBuilder, Ability } from '@casl/ability'
import { type User } from '~/db/queries/user/user.lib'

export type Subjects = string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'

export type AppAbility = Ability<[Actions, Subjects]> | undefined

export const AppAbility = Ability as any
export type ACLObj = {
  action: Actions
  subject: string
}

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (roles: User['roles'], subject: string) => {
  const { can, rules } = new AbilityBuilder(AppAbility)

  // Loop through all roles and define rules
  roles.forEach(({ profile, permissions }) => {
    if (profile === 'root' || profile === 'admin') {
      can('manage', 'all')
      return
    } else {
      can('read', 'general')
      can(permissions, profile)
    }
  })

  return rules
}

export const buildAbilityFor = (roles: User['roles'], subject: string): AppAbility => {
  return new AppAbility(defineRulesFor(roles, subject), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object.type
  })
}

export const defaultACLObj: ACLObj = {
  action: 'read',
  subject: 'general'
}

export default defineRulesFor
