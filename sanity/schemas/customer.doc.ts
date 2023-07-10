import { defineType } from 'sanity'
import { client } from '@sanity/lib/client'

import { randomCustomID } from 'src/utils/GenerateCustomID'

export default defineType({
  name: 'customer',
  title: 'Clientes',
  type: 'document',
  groups: [
    {
      title: 'Informações',
      name: 'info'
    },
    {
      title: 'Endereço',
      name: 'address'
    },
    {
      title: 'Dados Demográficos',
      name: 'demographic'
    }
  ],
  fields: [
    {
      name: 'inactive',
      title: 'Inativo',
      type: 'boolean',
      initialValue: false,
      group: 'info'
    },
    {
      name: 'customerID',
      title: 'ID do Cliente',
      type: 'string',
      group: 'info',
      description: 'ID do cliente no sistema de vendas, numero de fácil identificação',
      readOnly: true,
      initialValue: () => {
        const randomID = async () => {
          // Create a random ID and then fetch on Sanity to check if it exists
          let id = randomCustomID()
          let isValid = false

          while (!isValid) {
            const query = `count(*[_type == "customer" && customerID == "${id}"])`

            const result = await client.fetch(query)

            if (result > 0) {
              id = randomCustomID()
            } else {
              isValid = true
            }
          }

          return id
        }

        return randomID()
      }
    },
    {
      name: 'name',
      group: 'info',
      title: 'Nome',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'cpf',
      group: 'info',
      title: 'CPF',
      type: 'string'
    },
    {
      name: 'avatar',
      group: 'info',
      title: 'Avatar',
      type: 'image'
    },
    {
      name: 'email',
      group: 'info',
      title: 'E-mail',
      type: 'string'
    },
    {
      name: 'phone',
      group: 'info',
      title: 'Telefone',
      type: 'string'
    },
    {
      name: 'phoneIsWhatsapp',
      group: 'info',
      title: 'Telefone é Whatsapp',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => !parent?.phone
    },
    {
      name: 'socialMedia',
      title: 'Redes Sociais',
      type: 'socialMedia',
      group: 'info'
    },
    {
      name: 'createdBy',
      group: 'info',
      title: 'Criado por',
      type: 'reference',
      to: [{ type: 'user' }]
    },
    {
      name: 'stores',
      group: 'info',
      title: 'Lojas',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'retailStore' }] }]
    },
    {
      name: 'demographic',
      title: 'Informações Demográficas',
      type: 'demographic',
      group: 'demographic'
    },
    {
      name: 'address',
      title: 'Endereço',
      type: 'address',
      group: 'address'
    }
  ]
})
