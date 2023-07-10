import { isValidPhone } from '@brazilian-utils/brazilian-utils'
import { serverClient } from '@sanity/lib/client'
import { type NextApiRequest, type NextApiResponse } from 'next/types'
import { getFakePhoneNumbers } from 'src/utils/getFakePhoneNumbers'

const getPhoneNumbers = async (size: number) => {
  return getFakePhoneNumbers(size)
}

const modifyCustomerPhone = async (_id: string, phone: string) => {
  while (!isValidPhone(phone)) {
    phone = (await getPhoneNumbers(1))[0]
  }

  try {
    await serverClient.patch(_id).set({ phone }).commit()
  } catch (err) {
    console.log(err)
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Modifying phone numbers...')

    console.log('Fetching customers...')
    const customers = await serverClient.fetch<{ _id: string }[]>(
      `*[_type == "customer"]{_id}`
    )

    // Get phone numbers
    console.log('Getting phone numbers...')
    const phoneNumbers = await getPhoneNumbers(customers.length)

    // For each customer, modify phone number, promisse all, but maximum 10 at per second

    console.log('Modifying phone numbers...')
    await Promise.all(
      customers.map(({ _id }, index) => {
        return new Promise((resolve, reject) => {
          setTimeout(async () => {
            try {
              console.log(`Modifying index ${index} from ${customers.length}`)
              await modifyCustomerPhone(_id, phoneNumbers[index])
              resolve(undefined)
            } catch (err) {
              reject(err)
            }
          }, index * 100)
        })
      })
    )
    
    console.log('Done!')
    res.send(200)
  } catch (err) {
    console.log(err)
    res.send(err)
  }
}
