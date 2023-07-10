import randomatic from 'randomatic'

import { client } from '@sanity/lib/client'

export const generateSKU = async (initial: 'A' | 'L' | 'T' = 'T', length = 5) => {
  // Generate a random SKU, and after fetch on Sanity to check if it exists, if it does, generate another one
  // Make a while to keep generating until it doesn't exist

  // SKU
  const generatedSKU = `${initial.toUpperCase()}${randomatic('0')}${randomatic(
    'A0',
    length,
    {
      exclude: 'OELI'
    }
  )}`

  const query = `count(*[_type == "product" && sku == "${generatedSKU}"]) == 0`

  let runner = true

  while (runner) {
    try {
      const isUnique = await client.fetch(query)

      if (isUnique) {
        runner = false
      }
    } catch (error) {
      console.error(error)
    }
  }

  return generatedSKU
}
