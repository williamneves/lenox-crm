/**
 *  Set Home URL based on User Roles
 */

import { type User } from '~/db/queries/user/user.lib'

const getHomeRoute = (roles: User['roles']) => {
  if (roles.find(r => r.profile === 'admin' || r.profile === 'root')) return '/home'
  else if (roles.find(r => r.profile === 'manager')) return '/home'
  else if (roles.find(r => r.profile === 'customer')) return '/home'
  else return '/'
}

export default getHomeRoute
