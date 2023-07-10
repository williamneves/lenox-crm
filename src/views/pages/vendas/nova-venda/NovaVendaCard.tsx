import React from 'react'
import { useRouter } from 'next/router'
import {
  Card,
  Text,
  createStyles,
  IconShoppingCartPlus,
  rem,
  useMantineTheme,
  Title,
} from '@theme-ui'

type Props = {}
/**
 * NovaVendaCard Component
 */
export const NovaVendaCard = (props: Props) => {
  const theme = useMantineTheme()
  const router = useRouter()

  const { classes, cx } = NovaVendaCardStyles()

  const handleClick = () => {
    router.push('/vendas/nova-venda')
  }

  return (
    <Card
      onClick={handleClick}
      className={cx(classes.root)}
    >
      <IconShoppingCartPlus className={cx(classes.icon)} size={35} />
      <Title order={3} className={cx(classes.title)}>
        Nova Venda
      </Title>
      <Text className={cx(classes.subTitle)} span>
        INICIE UMA NOVA VENDA
      </Text>
    </Card>
  )
}

const NovaVendaCardStyles = createStyles(t => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: rem(20),
    backgroundColor: t.colorScheme === 'dark' ? t.colors.indigo[4] : t.colors.blue[6],
    boxShadow: t.colorScheme === 'dark' ? 'none' : t.shadows.sm,
    cursor: 'pointer',
    transition: 'all 200ms ease-in-out',
    // Hover
    '&:hover': {
      backgroundColor: t.colorScheme === 'dark' ? t.colors.indigo[5] : t.colors.blue[7]
    },
    '&:hover > *': {
      color: t.colorScheme === 'dark' ? t.colors.dark[0] : "white"
    },
    // Active
    '&:active': {
      backgroundColor: t.colorScheme === 'dark' ? t.colors.indigo[6] : t.colors.blue[8],
      // Fast transition
      transition: 'all 50ms ease-in-out',
      // Higher shadow
      boxShadow: t.colorScheme === 'dark' ? 'none' : t.shadows.md
    }
  },
  icon: {
    color: t.colorScheme === 'dark' ? t.colors.dark[0] : t.colors.gray[1],
    transition: 'all 200ms ease-in-out'
  },
  title: {
    fontSize: '1.5rem',
    color: t.colorScheme === 'dark' ? t.colors.dark[0] : t.colors.gray[1],
    transition: 'all 200ms ease-in-out',

  },
  subTitle: {
    fontSize: rem(12),
    color: t.colorScheme === 'dark' ? t.colors.dark[0] : t.colors.blue[1],
    transition: 'all 200ms ease-in-out',

  }
}))
