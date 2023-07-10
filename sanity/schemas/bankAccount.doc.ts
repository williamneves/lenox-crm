import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'bankAccount',
  title: 'Conta Bancária',
  type: 'document',
  fields: [
    defineField({
      name: 'inactive',
      title: 'Inativo',
      type: 'boolean',
      description: 'Se a conta bancária está inativa',
      initialValue: false,
    }),
    defineField({
      name: 'name',
      title: 'Nome',
      description: 'Nome da conta bancária',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'bankName',
      title: 'Nome do Banco',
      description: 'Nome do banco da conta bancária',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'retailStoresLinked',
      title: 'Lojas Vinculadas',
      description: 'Lojas vinculadas a conta bancária',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'retailStore' }],
        },
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'bankAccountDetails',
      title: 'Detalhes da Conta Bancária',
      description: 'Detalhes da conta bancária',
      type: 'object',
      fields: [
        defineField({
          name: 'bankNumber',
          title: 'Número do Banco',
          description: 'Número do banco da conta bancária',
          type: 'string',
        }),
        defineField({
          name: 'routingNumber',
          title: 'Número da Agência',
          description: 'Número da agência da conta bancária',
          type: 'string',
        }),
        defineField({
          name: 'accountNumber',
          title: 'Número da Conta',
          description: 'Número da conta bancária',
          type: 'string',
        }),
        defineField({
          name: 'accountType',
          title: 'Tipo da Conta',
          description: 'Tipo da conta bancária',
          type: 'string',
          options: {
            list: [
              { title: 'Conta Corrente', value: 'checking' },
              { title: 'Conta Poupança', value: 'savings' },
              { title: 'Conta Salário', value: 'salary' },
              { title: 'Conta Pagamento', value: 'payment' },
              { title: 'Conta Cartão de Crédito', value: 'creditCard' },
              { title: 'Conta Crediário', value: 'creditPlan' },
            ],
          },
        }),
        defineField({
          name: 'chavePix',
          title: 'Chave Pix',
          description: 'Chave Pix da conta bancária',
          type: 'string',
        }),
      ]
    }),
  ],
})