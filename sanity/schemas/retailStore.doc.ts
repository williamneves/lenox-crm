import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'retailStore',
  title: 'Lojas',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome',
      type: 'string',
      description: 'Nome da loja',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'taxId',
      title: 'CNPJ',
      type: 'string',
      description: 'CNPJ da loja',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Telefone',
      type: 'string',
      description: 'Telefone da loja'
    }),
    defineField({
      name: 'email',
      title: 'E-mail',
      type: 'string',
      description: 'E-mail da loja'
    }),
    defineField({
      name: 'socialMedias',
      title: 'Redes Sociais',
      type: 'socialMedia',
      description: 'Redes sociais da loja',
    }),
    defineField({
      name: 'paymentMethodsAccepted',
      title: 'Métodos de Pagamento Aceitos',
      type: 'array',
      description: 'Métodos de pagamento aceitos pela loja',
      of: [
        {
          type: 'paymentMethod',
          preview: {
            select: {
              title: 'name',
              subtitle: 'type',
            },
            prepare({ title, subtitle }) {
              return {
                title,
                subtitle
              }
            }
          }
        }
      ]
    }),
    defineField({
      name: 'systemUsers',
      title: 'Usuários do Sistema',
      type: 'array',
      description: 'Usuário habilitados a acessar o sistema',
      of: [
        {
          type: 'reference',
          to: [{ type: 'user' }],
          preview: {
            select: {
              title: 'name',
              subtitle: 'email'
            },
            prepare({ title, subtitle }) {
              return {
                title,
                subtitle
              }
            }
          }
        }
      ]
    }),
    defineField({
      name: 'address',
      title: 'Endereço',
      type: 'address',
      description: 'Endereço da loja'
    })
  ]
})
