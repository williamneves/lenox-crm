import { useState } from 'react'

import { type ContextModalProps, ModalsProvider } from '@mantine/modals'
import CustomerForm, { type CustomerFormProps } from '../../pages/cadastros/CustomerForm'

export const CustomerFormModal = ({
  context,
  id,
  innerProps
}: ContextModalProps<{
  customerFormProps: CustomerFormProps
}>) => {

  const [partialCustomer, setPartialCustomer] = useState<CustomerFormProps['partialCustomer']>()
  
  return <CustomerForm {...innerProps.customerFormProps} partialCustomer={partialCustomer} setPartialCustomer={setPartialCustomer} />
}
