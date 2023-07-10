import { useMantineColorScheme, ActionIcon, Group } from '@mantine/core'
import { IconSun, IconMoonStars } from '@tabler/icons-react'

export default function ThemeToogle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

  const isDark = colorScheme === 'dark'

  return (
    <Group position='center' my='xl'>
      <ActionIcon
        onClick={() => toggleColorScheme()}
        size='lg'
        variant='transparent'
        sx={({ colors }) => ({
          color: isDark ? colors.yellow[4] : colors.blue[8]
        })}
      >
        {isDark ? <IconSun size='1.4rem' /> : <IconMoonStars size='1.4rem' />}
      </ActionIcon>
    </Group>
  )
}
