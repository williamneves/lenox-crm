import { useRouter } from 'next/router'
import { NavLink, type NavLinkProps } from '@mantine/core'
import Link from 'next/link'
import { type ReactNode } from 'react'

interface NextNavLinkProps extends NavLinkProps {
  href: string
  children?: ReactNode
}

const NextNavLink = ({ href, children, ...props }: NextNavLinkProps) => {
  const { asPath } = useRouter()
  const isActive = new RegExp(`^${href}`).test(asPath)

  return (
    <NavLink component={Link} href={href} active={isActive} {...props}>
      {children}
    </NavLink>
  )
}

export default NextNavLink
