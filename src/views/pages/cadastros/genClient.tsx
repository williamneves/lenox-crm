import { Button, Card, TextInput } from '@mantine/core'
import React from 'react'
import { api } from 'src/utils/api'
import { generateFakeCustomer } from 'src/db/seedGen/customer'

const GetCustomers = () => {
  const utilsApi = api.useContext()
  const customerMutate = api.customer.createCustomer.useMutation({
    onSuccess: () => {
      // utilsApi.customer.invalidate({})
      utilsApi.customer.getCustomers.invalidate({}, {
        type: 'all'
      })
    }
  })

  const [numberOfClients, setNumberOfClients] = React.useState(1)

  const handleGenerate = async () => {
    const fakeCustomers = await generateFakeCustomer(numberOfClients)

    // Send a pack with 10 customers each second, to avoid server overload
    // Use promise.all to send all customers at once, but with a delay

    Promise.all(
      fakeCustomers.map((customer, i) => {
        return new Promise(resolve => {
          setTimeout(() => {
            customerMutate.mutate(customer)
            resolve(undefined)
          }, i * 250)
        })
      })
    )
  }

  return (
    <Card>
      <h1>getCustomers</h1>
      <TextInput
        label='Número de clientes'
        type='number'
        value={numberOfClients}
        // @ts-ignore
        onChange={event => setNumberOfClients(event.currentTarget.value)}
      />

      <Button onClick={handleGenerate}>Gerar</Button>
    </Card>
  )
}

export default GetCustomers
