import { q, z } from 'groqd'
import {
  metaDataFields,
  referenceFields,
  slugFields,
  Image,
  ImageAsset,
  insertImageAsset
} from '../commons.lib'

// ** PRODUCT CATEGORY ** //
export const getProductsQueryParams = z.object({
  id: q.string().optional(),
  slug: q.string().optional()
})

export const productCategoryFields = {
  _type: q.literal('productCategory'),
  inactive: q.boolean().optional(),
  name: q.string(),
  description: q.string().optional(),
  slug: slugFields
}

export const productCategoryFieldsMutationInsert = z.object({
  ...productCategoryFields,
  slug: slugFields
})

export const productCategoryFieldsMutationUpdate = productCategoryFieldsMutationInsert
  .omit({
    _type: true
  })
  .partial()

export const productCategoryFieldsFetch = {
  ...metaDataFields,
  ...productCategoryFields
}

// ** PRODUCT ** //
export const getProductByIdQueryParams = z.object({
  id: q.string()
})

export const getProductByCategoryIdQueryParams = z.object({
  id: q.string()
})

export const productFields = {
  _type: q.literal('product'),
  inactive: q.boolean().optional(),
  name: q.string(),
  sku: q.string(),
  description: q.string().optional(),
  categories: q
    .array(q.object(productCategoryFields))
    .optional()
    .or(q.array(q.object(referenceFields)).optional()),
  mainImage: Image.optional(),
  images: q.array(Image).optional()
}

export const productFieldsMutationInsert = z
  .object({
    ...productFields,
    categories: q.array(q.object(referenceFields)).optional(),
    mainImage: insertImageAsset.optional(),
    images: q.array(insertImageAsset).optional()
  })
  .omit({ sku: true })

export const productFieldsMutationUpdate = productFieldsMutationInsert
  .omit({
    _type: true
  })
  .partial()

export const productFieldsFetch = {
  ...metaDataFields,
  ...productFields
}
