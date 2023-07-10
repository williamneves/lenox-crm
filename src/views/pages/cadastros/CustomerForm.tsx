// ** REACT NEXTJS IMPORTS ** //
import React, { cache, use, useEffect, useRef, useState } from 'react'

// ** MANTINE IMPORTS ** //
import { useForm, zodResolver } from '@mantine/form'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  Group,
  Radio,
  SimpleGrid,
  InputBase,
  TextInput,
  Tooltip,
  Text,
  Collapse,
  Table,
  Stack,
  Select,
  rem,
  NumberInput,
  Autocomplete,
  LoadingOverlay,
  createStyles,
  FocusTrap,
  Title
} from '@mantine/core'
import {
  IconCalendar,
  IconHash,
  IconAlphabetLatin,
  IconAt,
  IconPhone,
  IconId,
  IconMapPinSearch,
  IconAbc,
  Icon123,
  IconNotes,
  IconSearch,
  IconBrandWhatsapp,
  IconMapSearch,
  IconPlus,
  IconUserPlus,
  IconSchool,
  IconBuildingEstate,
  IconBuildingSkyscraper,
  IconCash,
  IconCirclesRelation,
  IconHorseToy,
  IconEdit,
  IconX,
  IconArrowBackUp,
  IconClearAll
} from '@tabler/icons-react'
import { useToggle, useTimeout, useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'

// ** LIB IMPORTS ** //
import { z } from 'zod'
import moment from 'moment'
import { isValidCEP, isValidMobilePhone } from '@brazilian-utils/brazilian-utils'

// ** OTHER IMPORTS ** //
import { useBrStates, useBrCities } from 'src/utils/hooks/getBrStatesAndCities'
import MaskInput from 'src/views/shared/inputs/MaskInput'
import { api } from 'src/utils/api'
import { useAuthContext } from 'src/context/ClerkContext'
import {
  updateCustomerMutationParams,
  type CreateCustomerParams,
  type UpdateCustomerParams,
  type CustomerFetch
} from 'src/db/queries/customer/customer.lib'
import {
  educationStatusOptions,
  employmentStatusOptions,
  familyIncomeOptions,
  maritalStatusOptions,
  sexOptions
} from 'src/db/queries/commons.lib'
import { DateInput } from '@mantine/dates'
import { getAge } from 'src/utils/getAge'
import { getGenderIcon } from '../../../utils/getGenderIcon'
import {
  type StateCode,
  type StateName
} from '@brazilian-utils/brazilian-utils/dist/common/states'
import { randomCustomID } from 'src/utils/GenerateCustomID'
import { set } from 'nprogress'
import { CEP } from 'cep-promise'
import { fi } from '@faker-js/faker'

export type CustomerFormProps = {
  mode: 'edit' | 'new'
  onClose?: () => void
  customerID?: string
  _id?: string
  partialCustomer?: {
    name: string
    customerID: string
    _id: string
    email: string
  }
  setPartialCustomer?: (
    value: React.SetStateAction<CustomerFormProps['partialCustomer']>
  ) => void
}

type CreateCustomer = Omit<CreateCustomerParams, 'demographic'> & {
  demographic: Omit<Required<CreateCustomerParams>['demographic'], 'sex'> & {
    sex: Required<CreateCustomerParams>['demographic']['sex'] | ''
  }
}

const initialValues: CreateCustomer | Partial<CustomerFetch> = {
  inactive: false,
  name: '',
  email: '',
  phone: '',
  phoneIsWhatsapp: false,
  cpf: '',
  address: {
    zipCode: '',
    zipCodeFetched: false,
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    complement: ''
  },
  demographic: {
    DOB: null,
    sex: '',
    education: '',
    employment: '',
    familyIncome: '',
    maritalStatus: '',
    numberOfChildren: 0,
    occupation: ''
  }
}

const CustomerForm = (props: CustomerFormProps) => {
  const { user } = useAuthContext()

  const { classes } = customerFormStyles()

  const { mode, customerID, _id, partialCustomer, setPartialCustomer } = props

  const { data: customerToEdit } = api.customer.getOneCustomer.useQuery(
    {
      id: _id,
      customerID: customerID
    },
    {
      enabled: mode === 'edit' && (!!_id || !!customerID),
      refetchOnMount: true
    }
  )

  const [customerToEditValues, setCustomerToEditValues] = useState<Partial<CustomerFetch>>({})

  const apiUtils = api.useContext()
  const createCustomerMutation = api.customer.createCustomer.useMutation({
    onSuccess: () => {
      apiUtils.customer.getCustomers.invalidate({}, { type: 'all', exact: false })
    }
  })
  const updateCustomerMutation = api.customer.updateCustomer.useMutation({
    onSuccess: () => {
      apiUtils.customer.getCustomers.invalidate({}, { type: 'all', exact: false })
      apiUtils.customer.getOneCustomer.invalidate(
        { id: _id, customerID },
        { type: 'all' }
      )
    }
  })

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const customerForm = useForm({
    validate: zodResolver(updateCustomerMutationParams),
    initialValues: initialValues,
    clearInputErrorOnChange: true,
    validateInputOnBlur: true
  })

  const {
    getInputProps,
    values,
    onSubmit,
    errors,
    setFieldError,
    setFieldValue,
    setValues,
    resetDirty,
    isDirty
  } = customerForm
  useEffect(() => {
    if (mode === 'edit' && !customerToEdit) {
      // Wait for the customer to be fetched
      setLoading(true)
    } else if (mode === 'edit' && customerToEdit) {
      // prepare the data:
      // Remove unnecessary fields (This is necessary because the API returns a lot of unnecessary fields)
      delete (customerToEdit as Partial<CustomerFetch>).avatar
      delete (customerToEdit as Partial<CustomerFetch>).customerID
      delete (customerToEdit as Partial<CustomerFetch>)._createdAt
      delete (customerToEdit as Partial<CustomerFetch>)._updatedAt
      delete (customerToEdit as Partial<CustomerFetch>)._rev
      delete (customerToEdit as Partial<CustomerFetch>)._type
      delete (customerToEdit as Partial<CustomerFetch>).createdBy
      delete (customerToEdit as Partial<CustomerFetch>).stores

      // Reset the form values
      setValues(customerToEdit as Partial<CustomerFetch>)
      setCustomerToEditValues(customerToEdit as Partial<CustomerFetch>)
      customerForm.resetDirty()
      customerForm.resetTouched()

      // Set loading to false
      setLoading(false)
    } else if (mode === 'new') {
      // If the mode is new, just set the initial values and reset the dirty state
      setValues(initialValues)
      setLoading(false)
    }
  }, [customerToEdit, mode])

  const [pesquisarCep, setPesquisarCep] = useState(false)
  const [manualCep, manualCepToogle] = useToggle()

  const brStates = useBrStates()
  const brCities = useBrCities((values.address?.state as StateName | StateCode) || '')

  // Refs
  const numberInput = useRef<HTMLInputElement>(null)
  const [numberInFocus, numberInFocusToogle] = useToggle()

  // Focus the number input after the cep is fetched
  // Is necessary to use a timeout because the cep is fetched after the form is submitted
  // because if need time to component to re-render
  const { start } = useTimeout(() => numberInput.current?.focus(), 200)

  const { data: cep, refetch: cepRefetch } = api.funcs.getCep.useQuery(
    {
      cep: values.address?.zipCode
    },
    {
      enabled: false,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      cacheTime: Infinity,
      staleTime: Infinity,
      placeholderData: null
    }
  )

  const cepModal = (cep: CEP) => {
    modals.openConfirmModal({
      id: 'cep-found-modal',
      title: 'Endereço encontrado',
      keepMounted: true,
      labels: {
        cancel: 'Cancelar',
        confirm: 'Usar Endereço'
      },
      onConfirm: () => {
        setFieldValue('address.street', cep.street)
        setFieldValue('address.neighborhood', cep.neighborhood)
        setFieldValue('address.city', cep.city)
        setFieldValue('address.state', cep.state)
        setFieldValue('address.zipCode', cep.cep)
        setFieldValue('address.zipCodeFetched', true)
        setFieldValue('address.number', '')
        setFieldValue('address.complement', '')
        console.log('closing modal')
        start()
        modals.closeAll()
      },
      onCancel: () => {
        setFieldValue('address.zipCode', '')
        setFieldValue('address.zipCodeFetched', false)
      },
      children: CapInfoTable(cep)
    })
  }
  const searchCep = async () => {
    if (!isValidCEP(values.address?.zipCode as string)) {
      return setFieldError('address.zipCode', 'CEP inválido')
    }

    try {
      setPesquisarCep(true)
      const { data } = await cepRefetch({ throwOnError: true })

      if (!data) {
        console.log('no data', data)
        return
      }

      if ((data as { error: boolean; message: string }).error) {
        console.log('error', data)
        setFieldError(
          'address.zipCode',
          (data as { error: boolean; message: string }).message
        )
        return
      }

      cepModal(data as CEP)
    } catch (error) {
    } finally {
      setPesquisarCep(false)
    }
  }

  // Reset zipCode field errors if user change the cep field or if the manualCep is true
  useEffect(() => {
    if (errors['address.zipCode']) {
      setFieldError('address.zipCode', '')
    }

    if (manualCep) {
      setPesquisarCep(false)
      setFieldError('address.zipCode', '')
    }
  }, [values.address?.zipCode, manualCep])

  // ** Handlers
  const handleSubmit = async (data: typeof values) => {
    // Set submitting and create an notification type loading
    setSubmitting(true)
    notifications.show({
      id: 'is-submitting',
      color: 'blue',
      title: mode === 'new' ? 'Criando cliente...' : 'Salvando modificações...',
      message:
        mode === 'new'
          ? 'Estamos criando o cliente, aguarde um momento'
          : 'Estamos salvando as modificações, aguarde um momento',
      loading: true,
      autoClose: false,
      withCloseButton: false
    })

    try {
      if (mode === 'new') {
        // Remove avatar field from data
        delete data.avatar
        data.createdBy = {
          _type: 'reference',
          _ref: user?._id as string
        }
        data.stores = [
          {
            _type: 'reference',
            _ref: user?.stores[0]?._id as string
          }
        ]
        data._type = 'customer'

        // Create a random customerID
        data.customerID = randomCustomID()

        // Create the customer
        await createCustomerMutation.mutateAsync(data as CreateCustomer)

        // Show a success notification
        notifications.update({
          id: 'is-submitting',
          color: 'green',
          title: 'Cliente criado com sucesso',
          message: 'O cliente foi criado com sucesso',
          autoClose: 5000,
          withCloseButton: true
        })
      } else if (mode === 'edit') {
        console.log('edit')

        // Update the customer
        await updateCustomerMutation.mutateAsync(data as UpdateCustomerParams)

        // Show a success notification
        notifications.update({
          id: 'is-submitting',
          color: 'green',
          title: 'Cliente atualizado com sucesso',
          message: 'O cliente foi atualizado com sucesso',
          autoClose: 5000,
          withCloseButton: true
        })
      }
      if (mode === 'new') {
        resetDirty(initialValues)
        setValues(initialValues)
      }
    } catch (err) {
      console.log(err)
      notifications.update({
        id: 'is-submitting',
        color: 'red',
        title: 'Erro ao criar cliente',
        message: 'Ocorreu um erro, tente novamente mais tarde',
        autoClose: 5000,
        withCloseButton: true
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleError = (data: typeof errors) => {
    console.log('handleError', mode)
    console.log(data)
    console.log(values)
  }
  
  useEffect(() => {
    console.log('isDirty', isDirty())
  }, [isDirty()])

  return (
    <Box
      component='form'
      onSubmit={onSubmit(handleSubmit, handleError)}
      pos={'relative'}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden'
      }}
    >
      <LoadingOverlay visible={loading} overlayBlur={2} />

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto'
        }}
        px={'lg'}
        pt={'md'}
      >
        <Title
          order={3}
          sx={t => ({
            color: t.colorScheme === 'dark' ? t.colors.gray[3] : t.colors.gray[7]
          })}
        >
          {mode === 'new' ? 'Criar Cliente' : 'Editar Cliente'}
        </Title>
        <Divider my={'sm'} />
        <Alert title='Informações Importantes' color='cyan'>
          Um bom cadastro do cliente é essencial para a continuidade das Informações.
          Preencha todos os campos com atenção.
        </Alert>
        <Divider
          label={
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <IconHash size='1.1rem' color='gray' />
              <Text fz={'md'}>Dados Pessoais</Text>
            </Box>
          }
          my={'lg'}
        />

        <SimpleGrid cols={2}>
          <TextInput
            withAsterisk
            placeholder='Pedro da Silva'
            label='Nome'
            icon={<IconAbc size='1.3rem' stroke={1.5} />}
            {...getInputProps('name')}
          />

          <TextInput
            placeholder='pedro@provedor.com'
            label='Email'
            icon={<IconAt size='1.1rem' stroke={1.5} />}
            {...getInputProps('email')}
          />

          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center'
            }}
          >
            <MaskInput
              patternTemplate='phone'
              placeholder='(11) 99999-9999'
              icon={
                values.phoneIsWhatsapp ? (
                  <IconBrandWhatsapp size='1.1rem' stroke={1.5} />
                ) : (
                  <IconPhone size='1.1rem' stroke={1.5} />
                )
              }
              sx={{ flex: 1 }}
              labelProps={{ sx: { width: '100%' } }}
              label={
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'space-between'
                  }}
                >
                  Telefone
                  <Checkbox
                    size={'xs'}
                    disabled={!values.phone}
                    labelPosition='left'
                    label='WhatsApp?'
                    {...getInputProps('phoneIsWhatsapp', {
                      type: 'checkbox'
                    })}
                  />
                </Box>
              }
              {...getInputProps('phone')}
            />
          </Box>

          <MaskInput
            patternTemplate='cpf'
            placeholder='123.456.789-12'
            label='CPF'
            {...getInputProps('cpf')}
          />

          <DateInput
            locale='pt-br'
            dateParser={str => {
              return moment(str, 'DD/MM/YYYY').toDate()
            }}
            icon={<IconCalendar size='1.1rem' stroke={1.5} />}
            valueFormat='DD/MM/YYYY'
            label={
              'Data de Nascimento' +
              (values?.demographic?.DOB
                ? ` (${getAge({ birthday: values.demographic.DOB })})`
                : '')
            }
            placeholder='DD/MM/AAAA'
            {...getInputProps('demographic.DOB')}
          />

          <Select
            label='Gênero'
            placeholder='Selecione'
            icon={getGenderIcon(values?.demographic?.sex)}
            data={sexOptions}
            {...getInputProps('demographic.sex')}
          />
        </SimpleGrid>
        <Divider
          label={
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <IconHash size='1.1rem' color='gray' />
              <Text fz={'md'}>Endereço</Text>
            </Box>
          }
          my={'lg'}
        />
        <SimpleGrid cols={1}>
          <MaskInput
            patternTemplate='cep'
            placeholder='00000-000'
            labelProps={{
              sx: {
                width: '100%'
              }
            }}
            icon={<IconMapPinSearch size='1.1rem' stroke={1.5} />}
            label={
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  justifyContent: 'space-between'
                }}
              >
                CEP
                <Checkbox
                  size={'xs'}
                  label='Preencher manualmente'
                  checked={manualCep}
                  onChange={() => manualCepToogle()}
                />
              </Box>
            }
            {...getInputProps('address.zipCode')}
          />

          <Collapse in={!manualCep} sx={{ width: '100%' }}>
            <Button
              onClick={searchCep}
              disabled={!isValidCEP(values.address?.zipCode ?? '') || manualCep}
              loading={pesquisarCep}
              variant='light'
              color='blue'
              mb='sm'
              rightIcon={<IconMapSearch stroke={1.5} />}
              sx={{
                width: '100%',
                marginBottom: errors['address.zipCode'] ? '1rem' : '0'
              }}
            >
              {pesquisarCep ? 'Pesquisando CEP...' : 'Pesquisar CEP'}
            </Button>
          </Collapse>
        </SimpleGrid>
        <SimpleGrid cols={2}>
          <TextInput
            placeholder='Rua dos Bobos'
            icon={<IconAbc size='1.1rem' stroke={1.5} />}
            tabIndex={manualCep ? 0 : -1}
            label='Rua'
            {...getInputProps('address.street')}
          />
          <TextInput
            ref={numberInput}
            data-autofocus
            label='Número'
            placeholder='1020'
            icon={<Icon123 size='1.1rem' stroke={1.5} />}
            {...getInputProps('address.number')}
          />
          <Select
            label='Estado'
            placeholder='Selecione'
            tabIndex={manualCep ? 0 : -1}
            searchable
            nothingFound='Nenhum estado encontrado'
            icon={<IconAbc size='1.1rem' stroke={1.5} />}
            data={brStates}
            {...getInputProps('address.state')}
          />
          <Autocomplete
            placeholder='Cidade'
            icon={<IconAbc size='1.1rem' stroke={1.5} />}
            tabIndex={manualCep ? 0 : -1}
            label='Cidade'
            data={brCities}
            {...getInputProps('address.city')}
          />
          <TextInput
            placeholder='Bairro'
            tabIndex={manualCep ? 0 : -1}
            icon={<IconAbc size='1.1rem' stroke={1.5} />}
            label='Bairro'
            {...getInputProps('address.neighborhood')}
          />
          <TextInput
            placeholder='Apto, casa, etc.'
            icon={<IconNotes size='1.1rem' stroke={1.5} />}
            label='Complemento'
            {...getInputProps('address.complement')}
          />
        </SimpleGrid>
        <Divider
          label={
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <IconHash size='1.1rem' color='gray' />
              <Text fz={'md'}>Informações Demográficas</Text>
            </Box>
          }
          my={'lg'}
        />
        <SimpleGrid cols={2}>
          <Select
            label='Escolaridade'
            icon={<IconSchool size='1.1rem' stroke={1.5} />}
            placeholder='Selecione'
            {...getInputProps('demographic.education')}
            data={educationStatusOptions}
          />

          <Select
            label='Situação Profissional'
            icon={<IconBuildingEstate size='1.1rem' stroke={1.5} />}
            placeholder='Selecione'
            {...getInputProps('demographic.employment')}
            data={employmentStatusOptions}
          />

          <Select
            label='Situação Marital'
            icon={<IconCirclesRelation size='1.1rem' stroke={1.5} />}
            placeholder='Selecione'
            {...getInputProps('demographic.maritalStatus')}
            data={maritalStatusOptions}
          />

          <NumberInput
            label='Número de Filhos'
            icon={<IconHorseToy size='1.1rem' stroke={1.5} />}
            placeholder='Número de Filhos'
            {...getInputProps('demographic.numberOfChildren')}
          />
        </SimpleGrid>
        <SimpleGrid cols={1}>
          <TextInput
            label='Ocupação / Profissão'
            icon={<IconBuildingSkyscraper size='1.1rem' stroke={1.5} />}
            placeholder='Ocupação / Profissão'
            {...getInputProps('demographic.occupation')}
          />

          <Select
            label='Faixa de Renda Familiar'
            icon={<IconCash size='1.1rem' stroke={1.5} />}
            placeholder='Selecione'
            {...getInputProps('demographic.familyIncome')}
            data={familyIncomeOptions}
          />
        </SimpleGrid>
      </Box>
      {/* Put a box with fix position at the bottom with the button inside */}
      <Box className={classes.footerBar}>
        <Button disabled={submitting} type='button' variant='light' color='red' onClick={props.onClose}>
          <IconX size='1.3rem' stroke={1.8} />
        </Button>
        <Group grow position='apart' sx={{ flexGrow: 1 }}>
          <Button
            rightIcon={
              mode === 'edit' ? (
                <IconArrowBackUp size='1.3rem' stroke={1.8} />
              ) : (
                <IconClearAll size='1.3rem' stroke={1.8} />
              )
            }
            type='button'
            onClick={() => mode === 'new' ? customerForm.reset() : customerForm.setValues(customerToEditValues)}
            disabled={submitting || !isDirty()}
            variant='outline'
            color='yellow'
          >
            {mode === 'new' ? 'Limpar' : 'Reverter'}
          </Button>
          <Button
            type='submit'
            rightIcon={
              mode === 'edit' ? (
                <IconEdit size='1.3rem' stroke={1.8} />
              ) : (
                <IconUserPlus size='1.3rem' stroke={1.8} />
              )
            }
            disabled={!isDirty()}
            loading={submitting}
          >
            {mode === 'new' ? 'Cadastrar' : 'Atualizar'}
          </Button>
        </Group>
      </Box>
    </Box>
  )
}

export default CustomerForm

const customerFormStyles = createStyles(theme => ({
  footerBar: {
    position: 'sticky',
    bottom: '0',
    width: '100%',
    zIndex: 150,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : 'white',
    borderTop: `1px solid ${theme.colors.gray[6]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: theme.spacing.md,

    '&::before': {
      content: '""',
      position: 'absolute',
      top: -10,
      right: -10,
      bottom: -10,
      left: -10,
      background: 'inherit',
      zIndex: -1,
      filter: 'blur(10px)',
      padding: 10
    }
  }
}))

function CapInfoTable(cep: CEP): React.ReactNode {
  return (
    <Stack>
      <Table striped withBorder>
        <thead>
          <tr>
            <th>Informação</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>CEP</td>
            <td>{cep.cep}</td>
          </tr>
          <tr>
            <td>Rua</td>
            <td>{cep.street}</td>
          </tr>
          <tr>
            <td>Bairro</td>
            <td>{cep.neighborhood}</td>
          </tr>
          <tr>
            <td>Cidade</td>
            <td>{cep.city}</td>
          </tr>
          <tr>
            <td>Estado</td>
            <td>{cep.state}</td>
          </tr>
        </tbody>
      </Table>
      <Divider />
      <Text fz={'sm'} c={'dimmed'}>
        Se o endereço estiver correto, clique em "Usar Endereço". Assim o endereço será
        preenchido automaticamente.
      </Text>
      <Text fz={'sm'} c={'red'}>
        <b>Atenção</b>, ao clicar "User Endereço", os campos de endereço serão
        substituídos.
      </Text>
      <Text fz={'sm'} c={'dimmed'}>
        Se o endereço estiver incorreto, clique em "Cancelar" e preencha manualmente ou
        tente outro CEP.
      </Text>
      <Divider />
    </Stack>
  )
}
