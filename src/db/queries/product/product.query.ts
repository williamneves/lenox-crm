import { q, z } from 'groqd'

import { productCategoryFieldsFetch, productFieldsFetch } from './product.lib'

// ** PRODUCT CATEGORY ** //
export const getProductCategoriesQuery = q('*')
  .filterByType('productCategory')
  // Not fetch draft documents
  .filter('!(_id in path("drafts.**"))')
  .grab$(productCategoryFieldsFetch)

export const getProductCategoryByIdQuery = q('*')
  .filterByType('productCategory')
  // Not fetch draft documents
  .filter('!(_id in path("drafts.**"))')
  .filter(`_id == $id`)
  .grab$(productCategoryFieldsFetch)

export const getProductsCategoriesBySlug = q('*')
  .filterByType('productCategory')
  // Not fetch draft documents
  .filter('!(_id in path("drafts.**"))')
  .filter(`slug.current == $slug`)
  .grab$(productCategoryFieldsFetch)

// ** PRODUCT ** //
const grabWithCategories = {
  ...productFieldsFetch,
  categories: q('categories').filter().deref().grab$(productCategoryFieldsFetch)
}

export const getProductsQuery = q('*').filterByType('product').grab$(grabWithCategories)

export const getProductsFilterByCategoryQuery = q('*')
  .filterByType('product')
  // Not fetch draft documents
  .filter('!(_id in path("drafts.**"))')
  .filter(`categories[*]._ref == $id`)
  .grab$(grabWithCategories)

export const getProductByIdQuery = q('*')
  .filterByType('product')
  // Not fetch draft documents
  .filter('!(_id in path("drafts.**"))')
  .filter(`_id == $id`)
  .grab$(grabWithCategories)
