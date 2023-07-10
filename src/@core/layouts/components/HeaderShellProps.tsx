import {
  Header,
  Text,
  MediaQuery,
  Burger,
  Group,
  Paper,
  createStyles
} from '@mantine/core'
import ThemeToogle from './ThemeToogle'

type HeaderShellProps = {
  navBarWidth: {
    xs: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  isScrolled: boolean
  navBarIsOpened: boolean
  breakPoint: string
  toogleNavBar: () => void
}

function HeaderShell(props: HeaderShellProps) {
  const { navBarWidth, isScrolled, navBarIsOpened, breakPoint, toogleNavBar } = props
  const { classes, cx } = HeaderShellClasses()

  return (
    <Header
      bg={'transparent'}
      height={{ base: 53 }}
      sx={theme => ({
        display: 'flex',
        transition: 'all 0.3s ease',
        border: 0,
        [theme.fn.smallerThan('md')]: {
          left: 0
        },
        [theme.fn.largerThan('md')]: {
          left: navBarWidth.md
        },
        [theme.fn.largerThan('lg')]: {
          left: navBarWidth.lg
        }
      })}
    >
      <Paper className={cx(classes.paper, { [classes.scrolled]: isScrolled })}>
        <Group>
          <MediaQuery largerThan={breakPoint} styles={{ display: 'none' }}>
            <Burger
              opened={navBarIsOpened}
              onClick={() => toogleNavBar()}
              size='sm'
              sx={theme => ({
                color: theme.colors.gray[6],
                marginRight: theme.spacing.xl
              })}
            />
          </MediaQuery>
          {/* <Text>Application header</Text> */}
        </Group>
        <ThemeToogle />
      </Paper>
    </Header>
  )
}

export default HeaderShell


const HeaderShellClasses = createStyles(theme => ({
  paper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginLeft: theme.spacing.md,
    marginRight: theme.spacing.md,
    borderRadius: `0 0 ${theme.radius.sm} ${theme.radius.sm}`,
    backgroundColor: 'transparent',
    transition: 'all 0.3s ease',
    border: '1px solid transparent',
    boxShadow: 'none'
  },

  scrolled: {
    padding: theme.spacing.sm,
    backgroundColor: theme.white,
    boxShadow: theme.shadows.sm,
    border: `1px solid ${theme.colors.gray[2]}`
  }
}))