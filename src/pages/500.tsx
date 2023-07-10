import { type NextPage } from 'next'
import React from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'

const Error500page: NextPage = () => {
  return (
    <div>Error500page</div>
  )
}

Error500page.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default Error500page