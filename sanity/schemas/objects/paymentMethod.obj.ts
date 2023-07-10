import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'paymentMethod',
  title: 'Formas de Pagamento',
  type: 'object',
  fields: [
    defineField({
      name: 'inactive',
      title: 'Inativo',
      description: 'Pagamento inativo',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'id',
      title: 'ID',
      description: 'ID da forma de pagamento',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Nome',
      description: 'Nome da forma de pagamento',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Tipo',
      description: 'Tipo da forma de pagamento',
      type: 'string',
      options: {
        list: [
          { title: 'Dinheiro', value: 'cash' },
          { title: 'Cartão de Crédito', value: 'creditCard' },
          { title: 'Cartão de Débito', value: 'debitCard' },
          { title: 'TED', value: 'ted' },
          { title: 'Pix', value: 'pix' },
          { title: 'Crediário', value: 'creditPlan' },
          { title: 'Outros', value: 'others' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'bankAccountLinked',
      title: 'Conta Bancária Associada',
      description: 'Conta bancária associada a forma de pagamento',
      type: 'reference',
      to: [{ type: 'bankAccount' }],
    }),
    defineField({
      name: 'cashierLinked',
      title: 'Conta Caixa Associada',
      description: 'Conta caixa associada a forma de pagamento',
      type: 'reference',
      to: [{ type: 'cashier' }],
    }),
  ]
})