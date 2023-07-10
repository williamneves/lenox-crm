import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  createStyles,
  rem,
  Box
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'

// ** CLERK IMPORTS **
import { useAuth, useSignIn } from '@clerk/nextjs'
import { clerkLoginParamsSchema, type ClerkLoginParamsType } from 'src/types/auth'
import { TypeOf } from 'zod'
import { type NextPage } from 'next'
import BlankLayout from 'src/@core/layouts/BlankLayout'

const LoginPage: NextPage = () => {
  // ** AUTH FORM
  const authForm = useForm<ClerkLoginParamsType>({
    validate: zodResolver(clerkLoginParamsSchema),
    initialValues: {
      identifier: '',
      password: ''
    }
  })

  // ** CLERK AUTH
  const { signIn, setActive } = useSignIn()

  // ** Components
  const useStyles = createStyles(theme => ({
    wrapper: {
      minHeight: '100vh',
      backgroundSize: 'cover',
      backgroundImage:
        'url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)'
    },

    form: {
      borderLeft: `${rem(1)} solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
      }`,
      minHeight: '100vh',
      maxWidth: rem(450),
      minWidth: rem(400),
      boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.04), 0 8px 16px rgba(0, 0, 0, 0.12)',
      float: 'right',

      [theme.fn.smallerThan('sm')]: {
        maxWidth: rem(450),
        minWidth: '100%'
      }
    },

    title: {
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      fontFamily: `Greycliff CF, ${theme.fontFamily}`
    }
  }))

  const login = async ({ identifier, password }: ClerkLoginParamsType) => {
    if (!signIn) {
      throw {
        code: 'login_error',
        message: 'Autenticação não disponível no momento'
      }
    }

    try {
      const loginByIdentifier = await signIn.create({
        identifier,
        password
      })

      if (loginByIdentifier.status === 'complete') {
        console.log('loginByIdentifier', JSON.stringify(loginByIdentifier, null, 2))
        await setActive({ session: loginByIdentifier.createdSessionId })
      }
    } catch (err: any) {
      if (
        err.errors[0].code === 'form_identifier_not_found' ||
        err.errors[0].code === 'form_password_incorrect'
      ) {
        throw {
          code: 'params_invalid',
          message: 'Identificador ou senha incorretos'
        }
      } else {
        console.error('error', JSON.stringify(err, null, 2))
        throw {
          code: 'login_error',
          message: 'Erro ao fazer login'
        }
      }
    }
  }

  // ** SUBMIT
  const handleSubmit = async (data: typeof authForm.values) => {
    console.log('data', JSON.stringify(data, null, 2))
    try {
      await login(data )
    } catch (err: any) {
      console.error('error', JSON.stringify(err, null, 2))
      authForm.setFieldError('identifier', err.message)
    }
  }

  const handleError = (errors: typeof authForm.errors) => {
    console.error('error', JSON.stringify(errors, null, 2))
  }

  const { classes } = useStyles()
  return (
    <div className={classes.wrapper}>
      <Paper
        component='form'
        onSubmit={authForm.onSubmit(data => handleSubmit(data), handleError)}
        className={classes.form}
        radius={0}
        p={30}
      >
        <Box w='100%' mt={'50%'}>
          <Title order={2} className={classes.title} ta='center' mt='md' mb={50}>
            VISIONSYS ADMIN
          </Title>

          <TextInput
            label='Email'
            placeholder='you@mantine.dev'
            {...authForm.getInputProps('identifier')}
          />
          <PasswordInput
            label='Senha'
            placeholder='Your password'
            {...authForm.getInputProps('password')}
            mt='md'
          />
          <Button fullWidth mt='xl' type='submit'>
            Entrar
          </Button>
        </Box>
      </Paper>
    </div>
  )
}

LoginPage.guestGuard = true

LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default LoginPage
