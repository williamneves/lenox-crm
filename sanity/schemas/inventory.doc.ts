import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'inventory',
  title: 'Estoques',
  type: 'document',
  fields: [
    defineField({
      name: 'inactive',
      title: 'Inativo',
      type: 'boolean',
      description: 'Se o estoque está inativo',
      initialValue: false
    }),
    defineField({
      name: 'name',
      title: 'Nome',
      description: 'Nome do estoque',
      type: 'string',
      validation: Rule => Rule.required(),
      initialValue: 'Estoque Principal'
    }),
    defineField({
      name: 'retailStoresLinked',
      title: 'Lojas Vinculadas',
      description: 'Lojas vinculadas ao estoque',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'retailStore' }]
        }
      ],
    })
  ]
})

export const productInventory = defineType({
  name: 'productInventory',
  title: 'Produtos do Estoque',
  type: 'document',
  preview: {
    select: {
      title: 'product.name',
      subtitle: 'product.sku',
      qtd: 'qtd'
    },
    prepare({ title, subtitle, qtd }) {
      return {
        title,
        subtitle: `${qtd} - ${subtitle}`
      }
    }
  },
  fields: [
    defineField({
      name: 'inactive',
      title: 'Inativo',
      type: 'boolean',
      description: 'Se o estoque de produto está inativo',
      initialValue: false,
    }),
    defineField({
      name: 'product',
      title: 'Produto',
      description: 'Produto do estoque de produto',
      type: 'reference',
      to: [{ type: 'product' }],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'qtd',
      title: 'Quantidade',
      description: 'Quantidade do produto no estoque',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'suggestedPrice',
      title: 'Preço Sugerido',
      description: 'Preço sugerido do produto',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'suggestCost',
      title: 'Custo Sugerido',
      description: 'Custo do produto',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'lastPurchasePrice',
      title: 'Último Preço de Compra',
      description: 'Último custo do produto',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'lastPurchaseDate',
      title: 'Última Data de Compra',
      description: 'Última data de compra do produto',
      type: 'datetime',
    }),
    defineField({
      name: 'inventories',
      title: 'Estoques',
      description: 'Estoqus do produto',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'inventory' }]
        }
      ],
    }),
  ],
})