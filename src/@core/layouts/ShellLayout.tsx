import { useEffect, useState } from 'react'
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Button,
  Group,
  Paper,
  createStyles,
  Overlay
} from '@mantine/core'
import { useToggle, useWindowScroll } from '@mantine/hooks'

import NavbarComponent from './components/NavbarComponent'
import ThemeToogle from './components/ThemeToogle'
import HeaderShell from './components/HeaderShellProps'

const useStyles = createStyles(theme => ({
  paper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginLeft: theme.spacing.md,
    marginRight: theme.spacing.md,
    borderRadius: `0 0 ${theme.radius.sm} ${theme.radius.sm}`, // apply radius only to bottom corners
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

const ShellLayout = ({ children }: { children: React.ReactNode }) => {
  const theme = useMantineTheme()
  const [opened, toggleOpened] = useToggle()

  const { classes, cx } = useStyles()
  const [breakPoint, setBreakPoint] = useState('md')

  const [{ y }] = useWindowScroll()
  const isScrolled = y > 15

  const navBarWidth = {
    xs: 260,
  }

  useEffect(() => {
    // if opened set body overflow to hidden
    if (opened) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [opened])

  return (
    <>
      <AppShell
        styles={{
          main: {
            background:
              theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[2],
            transition: 'all 0.3s ease',
            minHeight: '100vh',
          }
        }}
        navbarOffsetBreakpoint={breakPoint}
        asideOffsetBreakpoint={breakPoint}
        layout='alt'
        navbar={
          <NavbarComponent
            navBarWidth={navBarWidth}
            opened={opened}
            setOpened={toggleOpened}
            breakPoint={breakPoint}
          />
        }
        header={
          <HeaderShell
            breakPoint={breakPoint}
            isScrolled={isScrolled}
            navBarIsOpened={opened}
            navBarWidth={navBarWidth}
            toogleNavBar={toggleOpened}
          />
        }
      >
        {/* Application content */}
        {children}
      </AppShell>
      {opened && <Overlay fixed zIndex={100} blur={5} onClick={() => toggleOpened()} />}
    </>
  )
}

export default ShellLayout


