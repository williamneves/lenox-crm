// @ts-nocheck

// ** React Imports
import { type ReactNode, useContext } from 'react'

// ** Component Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Types
import { type NavLink } from 'src/@core/layouts/types'

interface Props {
  navLink?: NavLink
  children: ReactNode
}

const CanViewNavLink = (props: Props) => {
  // ** Props
  const { children, navLink } = props

  // ** Hook
  const ability = useContext(AbilityContext)

  if (navLink && navLink.auth === false) {
    return <>{children}</>
  } else {
    return ability && ability.can(navLink?.action, navLink?.subject) ? (
      <>{children}</>
    ) : null
  }
}

export default CanViewNavLink
