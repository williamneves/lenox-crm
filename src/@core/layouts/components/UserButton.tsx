import {
  UnstyledButton,
  type UnstyledButtonProps,
  Group,
  Avatar,
  Text,
  createStyles,
  Menu,
  rem
} from '@mantine/core'
import { urlForImage } from '@sanity/lib/image'
import {
  IconArrowsLeftRight,
  IconChevronRight,
  IconLogout,
  IconMessageCircle,
  IconPhoto,
  IconSearch,
  IconSettings,
  IconTrash
} from '@tabler/icons-react'
import { useAuthContext } from 'src/context/ClerkContext'

const useStyles = createStyles(theme => ({
  user: {
    display: 'block',
    width: '100%',
    padding: theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
    }
  }
}))

interface UserButtonProps extends UnstyledButtonProps {
  image: string
  name: string
  email: string
  icon?: React.ReactNode
}

export function UserButton({ image, name, email, icon, ...others }: UserButtonProps) {
  const { classes } = useStyles()
  const { logout, user } = useAuthContext()

  return (
    <Group position='center'>
      <Menu withArrow arrowSize={10} offset={10}>
        <Menu.Target>
          <UnstyledButton className={classes.user} {...others}>
            <Group>
              <Avatar
                src={user?.avatar ? urlForImage(user.avatar).url() : null}
                radius='xl'
              />
              <div style={{ flex: 1 }}>
                <Text size='sm' weight={500}>
                  {user?.name}
                </Text>
                <Text color='dimmed' size='xs'>
                  {user?.email}
                </Text>
              </div>
              {icon || <IconChevronRight size='0.9rem' stroke={1.5} />}
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown sx={{ minWidth: rem(200) }}>
          <Menu.Label>Opções</Menu.Label>
          <Menu.Divider />

          <Menu.Item onClick={logout} icon={<IconLogout size={14} />}>
            Sair da conta
          </Menu.Item>
          {/* <Menu.Item icon={<IconMessageCircle size={14} />}>Messages</Menu.Item>
          <Menu.Item icon={<IconPhoto size={14} />}>Gallery</Menu.Item>
          <Menu.Item
            icon={<IconSearch size={14} />}
            rightSection={
              <Text size='xs' color='dimmed'>
                ⌘K
              </Text>
            }
          >
            Search
          </Menu.Item>

          <Menu.Divider />

          <Menu.Label>Danger zone</Menu.Label>
          <Menu.Item icon={<IconArrowsLeftRight size={14} />}>Transfer my data</Menu.Item>
          <Menu.Item color='red' icon={<IconTrash size={14} />}>
            Delete my account
          </Menu.Item> */}
        </Menu.Dropdown>
      </Menu>
    </Group>
  )
}
