import Head from 'next/head'
import { NextStudio } from 'next-sanity/studio'
import { metadata } from 'next-sanity/studio/metadata'
import config from '../../../sanity.config'
import { type ReactNode } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { type NextPage } from 'next'

const StudioPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Studio | VISIOSYS</title>
        {Object.entries(metadata).map(([key, value]) => (
          <meta key={key} name={key} content={value} />
        ))}
      </Head>
      <NextStudio config={config} />
    </>
  )
}

StudioPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

StudioPage.authGuard = false

export default StudioPage
