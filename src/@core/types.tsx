import { type TablerIconsProps } from '@tabler/icons-react'


export interface Link {
  icon: React.FC<TablerIconsProps>
  label: string
  initiallyOpened?: boolean
  openNewTab?: boolean
  link?: string
  acl?: {
    action: string
    subject: string
  }
}

export interface LinksGroupProps extends Link { 
  links?: Link[]
}
