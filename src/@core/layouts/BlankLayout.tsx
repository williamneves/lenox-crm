import React from 'react'

type Props = {
  children: React.ReactNode
}

const BlankLayout = ({children}: Props) => {
  return (
    <>{children}</>
  )
}

export default BlankLayout