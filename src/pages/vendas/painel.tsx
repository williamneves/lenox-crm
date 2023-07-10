import { NextPage } from 'next'
import React from 'react'
import { Box, Group, Stack } from '@theme-ui'
import { NovaVendaCard } from '../../views/pages/vendas/nova-venda/NovaVendaCard'

const PainelPage: NextPage = () => {
  return (
    <Stack>
      <Group>
        <NovaVendaCard />
      </Group>
    </Stack>
  )
}

export default PainelPage
