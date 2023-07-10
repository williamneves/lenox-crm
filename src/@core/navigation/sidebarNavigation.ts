import { type LinksGroupProps } from '../types'
import { IconDatabase, IconHome, IconShoppingBag } from '@tabler/icons-react'
export default [
  {
    label: 'Home',
    link: '/home',
    icon: IconHome,
    acl: {
      action: 'read',
      subject: 'general'
    }
  },
  {
    label: 'Cadastros',
    icon: IconHome,
    acl: {
      action: 'read',
      subject: 'general'
    },
    links: [
      {
        label: 'Clientes',
        link: '/cadastros/clientes/',
        acl: {
          action: 'read',
          subject: 'general'
        }
      },
      {
        label: 'Testes',
        link: '/cadastros/teste/',
        acl: {
          action: 'read',
          subject: 'general'
        }
      }
    ]
  },
  {
    label: 'Vendas',
    icon: IconShoppingBag,
    acl: {
      action: 'read',
      subject: 'general'
    },
    links: [
      {
        label: 'Painel',
        link: '/vendas/painel/',
        acl: {
          action: 'read',
          subject: 'general'
        }
      },
      {
        label: 'Nova Venda',
        link: '/vendas/nova-venda/',
        acl: {
          action: 'read',
          subject: 'general'
        }
      }
    ]
  },
  {
    label: 'Studio',
    icon: IconDatabase,
    link: '/studio',
    openNewTab: true,
    acl: {
      action: 'write',
      subject: 'admin'
    }
  }
] as LinksGroupProps[]
