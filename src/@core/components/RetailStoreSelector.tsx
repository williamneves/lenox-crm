import React, { useEffect } from 'react'
import { useAuthContext } from 'src/context/ClerkContext'
import { useAppContext } from 'src/context/AppContext'
import { storeSelectOptions } from 'src/context/appContext.types'
import {
  Select,
  Button,
  Menu,
  Text,
  IconArrowsLeftRight,
  IconMessageCircle,
  IconPhoto,
  IconSearch,
  IconSettings,
  IconTrash,
  IconBuildingStore,
  IconPinFilled, 
  IconChevronsRight,
  createStyles
} from '@theme-ui'

const RetailStoreSelector = () => {
  const { retailStore } = useAppContext()
  const { selectedStoreId, setSelectedStoreId, stores, selectedStore, storeLoading } = retailStore

  const { classes, cx } = useStyles()
  return (
    <Menu shadow='md' position='top' width={200} withArrow>
      <Menu.Target>
        <Button
          loading={storeLoading}
          leftIcon={<IconBuildingStore />}
          my={'sm'}
          variant='light'
          
        >
          {selectedStore?.name || 'Select a store'}
        </Button>
      </Menu.Target>

      <Menu.Dropdown px={'sm'}>
        <Menu.Label>Loja Ativa</Menu.Label>
        <Menu.Item className={cx(classes.menuItem)} icon={<IconPinFilled size={16} />}>
          {selectedStore?.name}
        </Menu.Item>
        <Menu.Label>Selecione Outra:</Menu.Label>
        <Menu.Item icon={<IconChevronsRight size={16} />}>Settings</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

export default RetailStoreSelector


const useStyles = createStyles(theme => ({
  menuItem: {
    backgroundColor: theme.colors.indigo[1],
    color: theme.colors.indigo[9],
    fontWeight: 600,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: theme.colors.indigo[3],
      color: 'white',
    }
  }
}))