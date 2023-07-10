import { type NextPage } from 'next'
import React from 'react'

const HomePage: NextPage = () => {
  return <div>Second page</div>
}

HomePage.acl = {
  subject: 'second-page',
  action: 'read',
}

export default HomePage
