import { useState, useContext } from 'react'
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  Text,
  UnstyledButton,
  createStyles,
  rem
} from '@mantine/core'
import {
  IconCalendarStats,
  IconChevronLeft,
  IconChevronRight} from '@tabler/icons-react'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { AbilityContext } from 'src/@core/acl/Can'
import { type LinksGroupProps } from 'src/@core/types'

const useStyles = createStyles(theme => ({
  control: {
    fontWeight: 500,
    display: 'block',
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black
    }
  },

  controlActive: {
    fontWeight: 700,
    display: 'block',
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.blue[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black
    }
  },
  link: {
    fontWeight: 500,
    display: 'block',
    textDecoration: 'none',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    paddingLeft: rem(31),
    marginLeft: rem(30),
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    borderLeft: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black
    }
  },
  linkActive: {
    fontWeight: 500,
    display: 'block',
    textDecoration: 'none',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    paddingLeft: rem(31),
    marginLeft: rem(30),
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.blue[4] : theme.colors.blue[0],
    borderLeft: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.blue[2] : theme.colors.blue[1],
      borderLeft: `${rem(1)} solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4]
      }`
    }
  },

  chevron: {
    transition: 'transform 200ms ease'
  }
}))

export function LinksGroup({
  icon: Icon,
  label,
  initiallyOpened,
  link,
  openNewTab,
  links,
  acl
}: LinksGroupProps) {
  const { classes, theme } = useStyles()

  const router = useRouter()
  const ability = useContext(AbilityContext)

  const mainIsActive =
    (link && new RegExp(link).test(router.pathname)) ||
    (links ?? []).some(item => item.link && new RegExp(item.link).test(router.pathname))

  const hasLinks = Array.isArray(links)
  const [opened, setOpened] = useState(initiallyOpened || false)
  const ChevronIcon = IconChevronRight
  const items = (hasLinks ? links : []).map((link, i) => {
    const isActive = link.link && new RegExp(link.link).test(router.pathname)

    return (
      <Text
        component={Link}
        target={link.openNewTab ? '_blank' : '_self'}
        className={isActive ? classes.linkActive : classes.link}
        href={link.link ?? '#'}
        key={link.label + i}
      >
        <Group spacing='xs'>
          {link.icon && <link.icon size={'1rem'} />}
          {link.label}
        </Group>
      </Text>
    )
  })

  if (ability && !ability.can(acl?.action, acl?.subject)) {
    return null
  }

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened(o => !o)}
        className={mainIsActive ? classes.controlActive : classes.control}
      >
        {link ? (
          <Box
            component={Link}
            target={openNewTab ? '_blank' : '_self'}
            href={link}
            sx={{
              textDecoration: 'none',
              color: theme.colorScheme === 'dark' ? theme.white : theme.black
            }}
          >
            <Group position='apart' spacing={0}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ThemeIcon variant={mainIsActive ? 'filled' : 'light'} size={30}>
                  <Icon size='1.1rem' />
                </ThemeIcon>
                <Box ml='md'>{label}</Box>
              </Box>
              {hasLinks && (
                <ChevronIcon
                  className={classes.chevron}
                  size='1rem'
                  stroke={1.5}
                  style={{
                    transform: opened
                      ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)`
                      : 'none'
                  }}
                />
              )}
            </Group>
          </Box>
        ) : (
          <Group position='apart' spacing={0}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ThemeIcon variant={mainIsActive ? 'filled' : 'light'} size={30}>
                <Icon size='1.1rem' />
              </ThemeIcon>
              <Box ml='md'>{label}</Box>
            </Box>
            {hasLinks && (
              <ChevronIcon
                className={classes.chevron}
                size='1rem'
                stroke={1.5}
                style={{
                  transform: opened
                    ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)`
                    : 'none'
                }}
              />
            )}
          </Group>
        )}
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  )
}
