import { defineField, defineType } from 'sanity'
import { generateSKU } from '~/utils/generateSKU'

export default defineType({
  name: 'product',
  title: 'Produtos',
  type: 'document',
  fields: [
    defineField({
      name: 'inactive',
      title: 'Inativo',
      type: 'boolean',
      description: 'Se o produto está inativo',
      initialValue: false
    }),
    defineField({
      name: 'name',
      title: 'Nome',
      description: 'Nome do produto',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      description: 'SKU do produto (código único)',
      type: 'string',
      validation: Rule => Rule.required(),
      initialValue: () => generateSKU()
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      description: 'Descrição do produto',
      type: 'text',
    }),
    defineField({
      name: 'categories',
      title: 'Categorias',
      description: 'Categorias do produto',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'productCategory' }]
        }
      ]
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagem Principal',
      description: 'Imagem principal do produto',
      type: 'image'
    }),
    defineField({
      name: 'images',
      title: 'Imagens',
      description: 'Imagens do produto',
      type: 'array',
      of: [
        {
          type: 'image'
        }
      ]
    })
  ]
})

export const productCategory = defineType({
  name: 'productCategory',
  title: 'Categoria de Produto',
  type: 'document',
  fields: [
    defineField({
      name: 'inactive',
      title: 'Inativo',
      type: 'boolean',
      description: 'Se a categoria está inativa',
      initialValue: false
    }),
    defineField({
      name: 'name',
      title: 'Nome',
      description: 'Nome da categoria',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Slug da categoria',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      }
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      description: 'Descrição da categoria',
      type: 'text'
    })
  ]
})
