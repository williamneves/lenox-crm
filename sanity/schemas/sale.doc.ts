import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'sale',
  title: 'Vendas',
  type: 'document',
  fields: [
    defineField({
      name: 'saleNumber',
      title: 'Código da Venda',
      type: 'string',
      description: 'Código da venda'
    }),
    defineField({
      name: 'openDate',
      title: 'Data de Abertura',
      type: 'date',
      description: 'Dia em que a venda foi aberta'
    }),
    defineField({
      name: 'closeDate',
      title: 'Data de Fechamento',
      type: 'date',
      description: 'Dia em que a venda foi fechada'
    }),
    defineField({
      name: 'store',
      title: 'Loja',
      type: 'reference',
      description: 'Loja onde a venda foi realizada',
      to: [{ type: 'retailStore' }]
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'object',
      description: 'Status da venda',
      fields: [
        defineField({
          name: 'status',
          title: 'Status',
          type: 'string',
          description: 'Status da venda',
          options: {
            list: [
              { title: 'Em Lançamento', value: 'draft' },
              { title: 'Em Orçamento', value: 'estimate' },
              { title: 'Enviado ao Caixa', value: 'sentToCashier' },
              { title: 'Pago Parcial (DAV)', value: 'dav' },
              { title: 'Pago (Completo)', value: 'paid' },
              { title: 'Pago (Completo DAV)', value: 'paidDav' },
              { title: 'Produto Entregue', value: 'delivered' },
              { title: 'Venda Finalizada', value: 'finished' },
              { title: 'Venda Cancelada', value: 'cancelled' },
            ],
          },
        }),
        defineField({
          name: 'date',
          title: 'Data',
          type: 'datetime',
          description: 'Data do status',
        }),
        defineField({
          name: 'modifiedBy',
          title: 'Usuário',
          type: 'reference',
          description: 'Usuário que alterou o status',
          to: [{ type: 'user' }],
        }),
        defineField({
          name: 'description',
          title: 'Descrição',
          type: 'text',
          description: 'Descrição da alteração do status',
        }),
        defineField({
          name: 'cancelReason',
          title: 'Motivo do Cancelamento',
          type: 'string',
          description: 'Motivo do cancelamento da venda',
          options: {
            list: [
              { title: 'Pagamento não aprovado', value: 'paymentNotApproved' },
              { title: 'Cliente desistiu', value: 'clientReasons' },
              { title: 'Outro', value: 'other' },
            ],
          },
        }),
        defineField({
          name: 'cancelDescription',
          title: 'Descrição do Cancelamento',
          type: 'text',
          description: 'Descrição do cancelamento da venda',
        }),
      ]
    }),
    defineField({
      name: 'customer',
      title: 'Cliente',
      type: 'reference',
      description: 'Cliente da venda',
      to: [{ type: 'customer' }],
    }),
    defineField({
      name: 'items',
      title: 'Itens',
      type: 'array',
      description: 'Itens da venda',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'product',
              title: 'Produto',
              type: 'reference',
              description: 'Produto da venda',
              to: [{ type: 'productInventory' }],
            }),
            defineField({
              name: 'quantity',
              title: 'Quantidade',
              type: 'number',
              description: 'Quantidade do produto na venda',
              initialValue: 1,
              validation: (Rule) => Rule.min(1),
            }),
            defineField({
              name: 'price',
              title: 'Preço',
              type: 'number',
              description: 'Preço do produto na venda',
              initialValue: 0,
              validation: (Rule) => Rule.min(0),
            }),
            defineField({
              name: 'discount',
              title: 'Desconto',
              type: 'number',
              description: 'Desconto do produto na venda',
              initialValue: 0,
              validation: (Rule) => Rule.min(0),
            }),
            defineField({
              name: 'total',
              title: 'Total',
              type: 'number',
              description: 'Total do produto na venda',
              initialValue: 0,
              validation: (Rule) => Rule.min(0),
            }),
          ],
        }
      ]
    }),
    defineField({
      name: 'total',
      title: 'Total',
      type: 'number',
      description: 'Total da venda',
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'discount',
      title: 'Desconto',
      type: 'number',
      description: 'Desconto da venda',
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'totalWithDiscount',
      title: 'Total com Desconto',
      type: 'number',
      description: 'Total da venda com desconto',
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'payments',
      title: 'Pagamentos',
      type: 'array',
      description: 'Pagamentos da venda',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'paymentMethodId',
              title: 'Método de Pagamento',
              type: 'string',
              description: 'Método de pagamento da venda',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'paymentMethodName',
              title: 'Nome do Método de Pagamento',
              type: 'string',
              description: 'Nome do método de pagamento da venda',
            }),
            defineField({
              name: 'paymentAmount',
              title: 'Valor do Pagamento',
              type: 'number',
              description: 'Valor do pagamento da venda',
              initialValue: 0,
              validation: (Rule) => Rule.min(0),
            }),
            defineField({
              name: 'installments',
              title: 'Parcelas',
              type: 'number',
              description: 'Número de parcelas do pagamento',
              initialValue: 1,
              validation: (Rule) => Rule.min(1),
            }),
            defineField({
              name: 'status',
              title: 'Status',
              type: 'string',
              description: 'Status do pagamento',
              options: {
                list: [
                  { title: 'Previsão de Pagamento', value: 'prePayment' },
                  { title: 'Pagamento Aprovado', value: 'paymentApproved' },
                  { title: 'Pagamento Confirmado', value: 'paymentConfirmed' },
                  { title: 'Pagamento Cancelado', value: 'paymentCancelled' },
                ],
              },
            }),
            defineField({
              name: 'date',
              title: 'Data',
              type: 'datetime',
              description: 'Data do pagamento',
              validation: (Rule) => Rule.required(),
              initialValue: new Date().toISOString(),
            }),
          ]
        }
      ],
    }),
    defineField({
      name: 'streetVendor',
      title: 'Street Responsável',
      type: 'reference',
      description: 'Street responsável pela venda',
      to: [{ type: 'user' }],
    }),
    defineField({
      name: 'seller',
      title: 'Vendedor',
      type: 'reference',
      description: 'Vendedor responsável pela venda',
      to: [{ type: 'user' }],
    }),
  ]
})