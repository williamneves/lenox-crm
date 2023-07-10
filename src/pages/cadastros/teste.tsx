import GetCustomers from 'src/views/pages/cadastros/genClient'

import { useModals } from 'src/context/ModalsContext'

import { ModalId } from 'src/context/ModalsContext'

import { Button, Group, Modal } from '@mantine/core'

import { useState } from 'react'
import axios from 'axios'


const TestPage = () => {
  const { openModal } = useModals()

  const [loading, setLoading] = useState(false)

  const modifyCustomersPhone = async () => {
    try {
      setLoading(true)
      // Fetch all customers
      await axios.get('/api/modPhone')
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Group spacing={'lg'}>
      <GetCustomers />
      <Button
        onClick={() =>
          openModal(
            ModalId['TestModal'],
            {
              mantineProps: {
                opened: true,
                onClose: () => null,
                withCloseButton: false
              },
              specificProps: {
                mode: 'new'
              }
            },
            undefined,
            true
          )
        }
      >
        Open Modal
      </Button>
      <Button
        onClick={() =>
          openModal(
            ModalId['SecondModal'],
            {
              mantineProps: {
                opened: true,
                onClose: () => null,
                withCloseButton: false
              },
              specificProps: {
                hello: 'world'
              }
            },
            undefined,
            true
          )
        }
      >
        Open Modal
      </Button>

      <Button onClick={modifyCustomersPhone} loading={loading}>
        Modify Customers Phone
      </Button>
    </Group>
  )
}

export default TestPage
