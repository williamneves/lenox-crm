import { Modal, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useEffect } from 'react'
import { type ModalData, type ModalId } from 'src/context/ModalsContext'
import CustomerForm, { type CustomerFormProps } from 'src/views/pages/cadastros/CustomerForm'

export type TestModalProps = CustomerFormProps

export default function TestModal({
  isOpen,
  onClose,
  keepMounted,
  modalProps
}: ModalData<ModalId.TestModal>) {
  const theme = useMantineTheme()
  const isMobile = useMediaQuery('(max-width: 48em)')

  const { mode } = modalProps?.specificProps ?? {}

  return (
    <Modal
      {...modalProps?.mantineProps}
      opened={isOpen}
      onClose={onClose}
      keepMounted={keepMounted}
      size={'xl'}
      fullScreen={isMobile}
      overlayProps={{
        color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[1],
        opacity: 0.45,
        blur: 5
      }}
    >
      <CustomerForm mode={mode ?? 'new'} />
    </Modal>
  )
}
