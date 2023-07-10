import type { ReactElement, ReactNode } from 'react'
import type { NextComponentType, NextPageContext } from 'next/dist/shared/lib/utils'
import type { ACLObj } from 'src/@core/configs/acl'


declare module 'next' {
  export declare type NextPage<P = {}, IP = P> = NextComponentType<NextPageContext, IP, P> & {
    acl?: ACLObj
    authGuard?: boolean
    guestGuard?: boolean
    getLayout?: (page: ReactElement) => ReactNode
  }
}
