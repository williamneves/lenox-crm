import { type NextPage } from 'next'
import { api } from 'src/utils/api'
import React, { useState, useMemo, useEffect } from 'react'
import { type CustomerFetch } from 'src/db/queries/customer/customer.lib'
import {
  Box,
  Button,
  Card,
  Divider,
  Paper,
  Text,
  useMantineTheme,
  Drawer,
  ActionIcon,
  Group
} from '@mantine/core'
import { useDisclosure, useToggle } from '@mantine/hooks'
import { formatToBrType } from 'src/utils/formatToBrType'
import { sexLabel } from 'src/db/queries/commons.lib'
import { getAge } from 'src/utils/getAge'
import {
  MantineReactTable,
  type MRT_ColumnDef,
  useMantineReactTable
} from 'mantine-react-table'
//Import Mantine React Table Translations
import { MRT_Localization_PT_BR } from 'mantine-react-table/locales/pt-BR'

import {
  IconBrandWhatsapp,
  IconEyeEdit,
  IconPhoneOutgoing,
  IconShoppingBag,
  IconUserPlus
} from '@tabler/icons-react'

import GenClient from 'src/views/pages/cadastros/genClient'
import CustomerForm from 'src/views/pages/cadastros/CustomerForm'
import TooltipIcon from 'src/@core/theme/components/TooltipIcon'

const CadastroClientesPage: NextPage = () => {
  const theme = useMantineTheme()

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  // ** Drawer Controls
  const [drawerOpened, setDrawerOpened] = useDisclosure(false)
  const [mode, toogleMode] = useToggle<'new' | 'edit'>(['new', 'edit'])
  const [customerID, setCustomerID] = useState<string | undefined>(undefined)

  const handleEditCustomer = (customerID: string) => {
    setCustomerID(customerID)
    toogleMode('edit')
    setDrawerOpened.open()
  }

  const handleNewCustomer = () => {
    setCustomerID(undefined)
    toogleMode('new')
    setDrawerOpened.open()
  }

  const onCloseDrawer = () => {
    setDrawerOpened.close()
    setCustomerID(undefined)
  }

  // ** Client List
  const customersQuery = api.customer.getCustomers.useQuery(
    {},
    {
      // 8 hours
      cacheTime: 1000 * 60 * 60 * 12,
      // Stale time is 1h
      staleTime: 1000 * 60 * 60,
      placeholderData: []
    }
  )

  const customersListLoading = customersQuery.isPlaceholderData && customersQuery.fetchStatus !== 'idle'


  const { data: customersList } = customersQuery

  const clientListColumnsMemo = useMemo<MRT_ColumnDef<CustomerFetch>[]>(
    () => [
      {
        accessorKey: 'customerID',
        header: 'ID',
        enableClickToCopy: true,
        enableSorting: false,
        maxSize: 100
      },
      {
        accessorKey: 'name',
        header: 'Nome',
        enableClickToCopy: true
      },
      {
        accessorKey: 'demographic.sex',
        header: 'Sexo',
        enableHiding: false,
        Cell: ({ row }) =>
          row.original.demographic?.sex
            ? `${sexLabel[row.original.demographic?.sex]}`
            : ''
      },
      {
        accessorKey: 'email',
        header: 'E-mail',
        enableClickToCopy: true
      },
      {
        accessorKey: 'phone',
        header: 'Telefone',
        maxSize: 150,
        Cell: ({ row }) => formatToBrType(row.original?.phone, 'mobilePhone', true)
      },
      {
        accessorKey: 'cpf',
        header: 'CPF',
        Cell: ({ row }) => formatToBrType(row.original?.cpf, 'cpf', true)
      },
      {
        accessorKey: 'demographic.DOB',
        header: 'Idade',
        maxSize: 100,
        Cell: ({ row }) => getAge({ birthday: row.original.demographic?.DOB || '' })
      },
      {
        id: 'actions',
        header: 'Ações',
        columnDefType: 'display',
        enableColumnActions: false,
        mantineTableHeadCellProps: {
          align: 'center'
        },
        Cell: ({ row }) => (
          <Group w={'100%'} spacing={'md'} position='center'>
            <TooltipIcon
              color='blue'
              variant='light'
              label={'Ver / Editar'}
              onClick={() => handleEditCustomer(row.original._id as string)}
              tooltipProps={{
                arrowSize: 8,
                color: 'blue'
              }}
            >
              <IconEyeEdit />
            </TooltipIcon>
            <TooltipIcon
              color='yellow'
              variant='light'
              label={'Nova Venda'}
              tooltipProps={{
                arrowSize: 8,
                color: 'yellow'
              }}
            >
              <IconShoppingBag />
            </TooltipIcon>
            {row.original.phoneIsWhatsapp && (
              <TooltipIcon
                color='green'
                variant='light'
                label={'Falar no Whatsapp'}
                tooltipProps={{
                  arrowSize: 8,
                  color: 'green'
                }}
              >
                <IconBrandWhatsapp />
              </TooltipIcon>
            )}
            {!!row.original.phone && (
              <TooltipIcon
                color='grape'
                variant='light'
                label={'Ligar'}
                tooltipProps={{
                  arrowSize: 8,
                  color: 'grape'
                }}
              >
                <IconPhoneOutgoing />
              </TooltipIcon>
            )}
          </Group>
        )
      }
    ],
    []
  )

  const customerTable = useMantineReactTable({
    mantinePaperProps: {
      pt: 'md',
      radius: 'md',
      sx: {
        boxShadow: 'none'
      }
    },
    mantineTableProps: {
      sx: {
        '& thead tr th': {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          borderTop: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
          }`
        }
      }
    },
    localization: MRT_Localization_PT_BR,
    columns: clientListColumnsMemo,
    data: customersList as CustomerFetch[],
    
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    onPaginationChange: setPagination,
    state: {
      pagination,
      isLoading: customersListLoading
    },
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          alignSelf: 'center'
        }}
        ml={'sm'}
      >
        <Button rightIcon={<IconUserPlus size={18} />} onClick={handleNewCustomer}>
          <Text size={'sm'}>Criar Novo Cliente</Text>
        </Button>
      </Box>
    ),
    enableColumnResizing: true,
    enableColumnDragging: false,
    // enableHiding: false,
    initialState: {
      showGlobalFilter: true,
      sorting: [{ id: 'name', desc: false }],
      columnVisibility: { 'demographic.sex': false, cpf: false }
    }
  })

  return (
    <>
      <MantineReactTable table={customerTable} />
      {/* Customer Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={onCloseDrawer}
        position='right'
        size={'lg'}
        withCloseButton={false}
        padding={0}
      >
        <CustomerForm mode={mode} _id={customerID} onClose={onCloseDrawer}/>
      </Drawer>
    </>
  )
}

export default CadastroClientesPage
