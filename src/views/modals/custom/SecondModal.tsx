import { Modal, Card, Text, Divider, Box } from '@mantine/core'
import { useEffect } from 'react'
import { type ModalData, type ModalId } from 'src/context/ModalsContext'

export type SecondModalProps = {
  hello: string
}

export default function SecondModal({
  isOpen,
  onClose,
  keepMounted,
  modalProps
}: ModalData<ModalId.SecondModal>) {
  return (
    <Modal
      {...modalProps?.mantineProps}
      opened={isOpen}
      onClose={onClose}
      centered
      sx={{
        '& .mantine-Modal-body': {
          padding: 0
        }
      }}
    >
      <Card padding={'md'}>
        <Text>This is a second modal header</Text>
        <Card.Section>
          <Divider my={'sm'} />
        </Card.Section>

        <Box
          sx={{
            flex: 1
          }}
        >
          <Text>
            This is a second modal body, This is a second modal bodyThis is a second modal
            body This is a second modal body This is a second modal body
          </Text>
        </Box>

        <Card.Section>
          <Text>This is a second modal footer</Text>
        </Card.Section>
      </Card>
    </Modal>
  )
}
