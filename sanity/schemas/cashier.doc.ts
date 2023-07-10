import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'cashier',
  title: 'Contas Caixas',
  type: 'document',
  fields: [
    defineField({
      name: 'inactive',
      title: 'Inativo',
      type: 'boolean',
      description: 'Se a conta caixa está inativa',
      initialValue: false,
    }),
    defineField({
      name: 'name',
      title: 'Nome',
      description: 'Nome da conta caixa',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'retailStoreLinked',
      title: 'Loja Associada',
      description: 'Loja associada a conta caixa',
      type: 'reference',
      to: [{ type: 'retailStore' }],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'balance',
      title: 'Saldo',
      description: 'Saldo da conta caixa',
      type: 'number',
      validation: Rule => Rule.required(),
    }),
  ],
})