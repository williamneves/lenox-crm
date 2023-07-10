import {
  Navbar,
  Group,
  Code,
  ScrollArea,
  createStyles,
  rem,
  Burger,
  useMantineTheme,
  Divider,
  Box,
  NavLink,
  Text,
  Button
} from '@mantine/core'
import {
  IconNotes,
  IconCalendarStats,
  IconGauge,
  IconPresentationAnalytics,
  IconFileAnalytics,
  IconAdjustments,
  IconLock,
  IconLogout
} from '@tabler/icons-react'
import { UserButton } from './UserButton'
import { LinksGroup } from './NavbarLinksGroup'
import { Icon } from '@iconify/react'
import sidebarNavigation from 'src/@core/navigation/sidebarNavigation'
import { useAuthContext } from 'src/context/ClerkContext'
import RetailStoreSelector from 'src/@core/components/RetailStoreSelector'

const mockdata = [
  { label: 'Dashboard', icon: IconGauge },
  {
    label: 'Market news',
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: 'Overview', link: '/home', icon: IconNotes },
      { label: 'Forecasts', link: '/second-page' },
      { label: 'Outlook', link: '/home/?id=19' },
      { label: 'Real time', link: '/js' }
    ]
  },
  {
    label: 'Releases',
    icon: IconCalendarStats,
    links: [
      { label: 'Upcoming releases', link: '/as' },
      { label: 'Previous releases', link: '/ds' },
      { label: 'Releases schedule', link: '/fd' }
    ]
  },
  { label: 'Analytics', icon: IconPresentationAnalytics, link: '/second-page' },
  { label: 'Contracts', icon: IconFileAnalytics },
  { label: 'Settings', icon: IconAdjustments },
  {
    label: 'Security',
    icon: IconLock,
    links: [
      { label: 'Enable 2FA', link: '/' },
      { label: 'Change password', link: '/' },
      { label: 'Recovery codes', link: '/' }
    ]
  }
]

const useStyles = createStyles(theme => ({
  navbar: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    paddingBottom: 0,
    boxShadow: theme.shadows.xs,
    zIndex: 150
  },

  header: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xs,
    paddingTop: 0,
    marginLeft: `calc(${theme.spacing.xl} * -1)`,
    marginRight: `calc(${theme.spacing.xl} * -1)`,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black
  },

  divider: {
    marginLeft: `calc(${theme.spacing.xl} * -1)`,
    marginRight: `calc(${theme.spacing.xl} * -1)`,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2]
  },

  links: {
    marginLeft: `calc(${theme.spacing.xl} * -1)`,
    marginRight: `calc(${theme.spacing.xl} * -1)`
  },

  linksInner: {
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xl
  },

  footer: {
    marginLeft: `calc(${theme.spacing.xl} * -1)`,
    marginRight: `calc(${theme.spacing.xl} * -1)`
  }
}))

interface NavbarComponentProps {
  opened: boolean
  setOpened: () => void
  breakPoint: string
  navBarWidth: {
    xs: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
}

const NavbarComponent = ({
  opened,
  setOpened,
  breakPoint,
  navBarWidth
}: NavbarComponentProps) => {
  const theme = useMantineTheme()
  const { logout } = useAuthContext()

  const { classes } = useStyles()
  const links = sidebarNavigation.map(item => <LinksGroup {...item} key={item.label} />)

  return (
    <Navbar
      hiddenBreakpoint={breakPoint || 'md'}
      width={navBarWidth}
      maw={navBarWidth.xs}
      pb={0}
      px={'xl'}
      pt={'xs'}
      className={classes.navbar}
      sx={t => ({
        transition: 'all 0.3s ease',
        [t.fn.smallerThan('md')]: {
          left: opened ? 0 : -(navBarWidth.xs + 50)
        }
      })}
    >
      <Navbar.Section className={classes.header}>
        <Group position='apart'>
          <Group spacing={'sm'}>
            <Icon
              icon='fluent:glasses-48-regular'
              fontSize={'2rem'}
              color={
                theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.blue[6]
              }
            />
            <Text
              fw={600}
              fz={'xl'}
              color={
                theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.blue[6]
              }
            >
              VISIONSYS
            </Text>
          </Group>
          <Burger
            hidden={!opened}
            opened={opened}
            onClick={setOpened}
            size='sm'
            color={theme.colors.gray[6]}
          />
        </Group>
      </Navbar.Section>
      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        <div className={classes.linksInner}>{links}</div>
      </Navbar.Section>
      <RetailStoreSelector />
      <Divider className={classes.divider} />
      <Navbar.Section className={classes.footer}>
        <UserButton
          image='https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80'
          name='Ann Nullpointer'
          email='anullpointer@yahoo.com'
        />
      </Navbar.Section>
    </Navbar>
  )
}

export default NavbarComponent
