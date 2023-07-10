import { q } from 'groqd'
import { z } from 'groqd'
import { type SelectOption } from '../commons.lib'
import { lib } from '../lib.index'
import { userFieldsFetch } from '../user/user.lib'
import * as commons from '../commons.lib'
import * as retailStore from '../retailStore/retailStore.lib'
import * as inventory from '../inventory/inventory.lib'

// *** This fields is based on sanilty/schemas/sale.doc.ts

// * SALE ** //

// ** Auxiliars variables and types

// * STATUS ** //
export const SaleStatusLabels = {
  draft: 'Em Lançamento',
  estimate: 'Em Orçamento',
  sentToCashier: 'Enviado ao Caixa',
  dav: 'Pago Parcial (DAV)',
  paid: 'Pago (Completo)',
  paidDav: 'Pago (Completo DAV)',
  delivered: 'Produto Entregue',
  finished: 'Venda Finalizada',
  cancelled: 'Venda Cancelada'
} as const

export type SaleStatus = keyof typeof SaleStatusLabels

export const saleStatusOptions: SelectOption[] = Object.entries(SaleStatusLabels).map(
  ([value, label]) => ({ value, label, key: value })
)

// * CANCEL REASON ** //
export const SaleCancelReasonLabels = {
  paymentNotApproved: 'Pagamento não aprovado',
  clientReasons: 'Cliente desistiu',
  other: 'Outro'
} as const

export type SaleCancelReason = keyof typeof SaleCancelReasonLabels

export const saleCancelReasonOptions: SelectOption[] = Object.entries(
  SaleCancelReasonLabels
).map(([value, label]) => ({ value, label, key: value }))

// * Payment Status ** //
export const PaymentStatusLabels = {
  prePayment: 'Previsão de Pagamento',
  paymentApproved: 'Pagamento Aprovado',
  paymentConfirmed: 'Pagamento Confirmado',
  paymentCancelled: 'Pagamento Cancelado'
} as const

export type PaymentStatus = keyof typeof PaymentStatusLabels

export const paymentStatusOptions: SelectOption[] = Object.entries(
  PaymentStatusLabels
).map(([value, label]) => ({ value, label, key: value }))

// ** Fields ** //
export const saleStatus = q.object({
  status: z.enum(Object.keys(SaleStatusLabels) as [SaleStatus]),
  date: q.date(),
  modifiedBy: q.object(userFieldsFetch).or(q.object(commons.referenceFields)),
  description: q.string().optional(),
  cancelReason: z
    .enum(Object.keys(SaleCancelReasonLabels) as [SaleCancelReason])
    .optional(),
  cancelDescription: q.string().optional()
})

export const paymentFields = z.object({
  paymentMethodId: q.string(),
  paymentMethodName: q.string().optional(),
  paymentAmount: q.number().min(0).default(0),
  installments: q.number().min(1).default(1),
  status: z.enum(Object.keys(PaymentStatusLabels) as [PaymentStatus]),
  date: q.date().optional()
})

export const saleItemFields = q
  .object({
    product: q
      .object(inventory.productInventoryFetch)
      .or(q.object(commons.referenceFields)),
    quantity: q.number(),
    price: q.number(),
    discount: q.number(),
    total: q.number()
  })
  .optional()

export const saleFields = {
  _type: q.literal('sale'),
  saleNumber: q.string(),
  store: q
    .object(commons.referenceFields)
    .or(q.object(retailStore.retailStoreFieldsFetch)),
  openDate: q.date().default(new Date()),
  closeDate: q.date().optional(),
  status: saleStatus,
  customer: q.object(commons.referenceFields).optional(),
  items: q.array(saleItemFields).optional(),
  total: q.number(),
  discount: q.number(),
  totalWithDiscount: q.number(),
  payments: paymentFields.optional(),
  streetVendor: q.object(userFieldsFetch).or(q.object(commons.referenceFields)),
  seller: q.object(userFieldsFetch).or(q.object(commons.referenceFields))
}

export const saleFieldsFetch = {
  ...saleFields,
  ...commons.metaDataFields
}

// ** Query Params ** //
export const getSalesQueryParams = z.object({
  order: z.enum(['asc', 'desc']).default('desc').optional(),
  orderBy: z.enum(['_createdAt', '_updatedAt', 'openDate', 'closeDate']).optional(),
  range: z.enum(['day', 'week', 'month', '3months', 'custom']).optional(),
  startDate: q.date().optional(),
  endDate: q.date().optional(),
  filterByRefId: q.string().optional(),
  saleStatus: z.array(saleStatus.shape.status).optional(),
  references: z.enum(['with', 'without']).optional(),
  pagination: z
    .object({
      page: q.number().default(1),
      limit: q.number().default(10)
    })
    .optional()
})

export const getSaleByIdQueryParams = z.object({
  id: q.string(),
  references: z.enum(['with', 'without']).optional()
})

export const getSaleBySaleNumberQyerParams = z.object({
  saleNumber: q.string(),
  references: z.enum(['with', 'without']).optional()
})

// ** MUTATIONS ** //
export const saleCreate = z.object({
  ...saleFields,
  store: z.object(commons.referenceFields),
  customer: z.object(commons.referenceFields).optional(),
  items: z
    .array(
      z.object({
        ...saleItemFields.optional,
        product: z.object(commons.referenceFields).optional()
      })
    )
    .optional(),
  status: z
    .object({
      ...saleStatus.shape,
      modifiedBy: z.object(commons.referenceFields)
    })
    .optional(),
  seller: z.object(commons.referenceFields).optional(),
  streetVendor: z.object(commons.referenceFields).optional()
})

export const saleUpdate = saleCreate
  .omit({
    _type: true,
    saleNumber: true,
    store: true
  })
  .partial()
