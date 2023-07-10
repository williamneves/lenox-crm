import { type NextPage } from 'next'
import React from 'react'
import { useRouter } from 'next/router'

import { createStyles, Title, Text, Button, Container, Group, rem } from '@mantine/core'
import BlankLayout from 'src/@core/layouts/BlankLayout'

const useStyles = createStyles(theme => ({
  root: {
    paddingTop: rem(80),
    paddingBottom: rem(80)
  },

  label: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: rem(220),
    lineHeight: 1,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(120)
    }
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: 'center',
    fontWeight: 900,
    fontSize: rem(38),

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(32)
    }
  },

  description: {
    maxWidth: rem(500),
    margin: 'auto',
    marginTop: theme.spacing.xl,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`
  }
}))

const Error401Page:NextPage = () => {
  const { classes } = useStyles()
  const router = useRouter()

  return (
    <Container className={classes.root}>
      <div className={classes.label}>401</div>
      <Title className={classes.title}>You are not authorired to see this page.</Title>
      <Text color='dimmed' size='lg' align='center' className={classes.description}>
        You don't have the permission to access the requested resource. It is either read-protected or not readable by the server.
      </Text>
      <Group position='center'>
        <Button
          onClick={() => router.push('/')}
          variant='subtle' size='md'>
          Take me back to home page
        </Button>
      </Group>
    </Container>
  )
}

Error401Page.getLayout = page => <BlankLayout>{page}</BlankLayout>


export default Error401Page