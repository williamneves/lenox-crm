import { defineField, defineType, validation } from 'sanity';

export default defineType({
  name: 'user',
  title: 'Usuários do Sistema',
  type: 'document',
  groups: [
    {
      title: 'Informações do Usuário',
      name: 'info'
    },
    {
      title: 'Perfis de Acesso',
      name: 'roles'
    },
    {
      title: 'Pefil do Usuário',
      name: 'profile'
    }
  ],
  fields: [
    defineField({
      name: 'inactive',
      title: 'Inativo',
      type: 'boolean',
      description: 'Usuário inativo?',
      group: 'info',
      initialValue: false
    }),
    defineField({
      name: 'userId',
      title: 'ID do Autenticador',
      type: 'string',
      description: 'ID do usuário no Autenticador',
      group: 'info',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'name',
      title: 'Nome',
      type: 'string',
      group: 'info',
      description: 'Nome do usuário'
    }),
    defineField({
      name: 'email',
      title: 'E-mail',
      type: 'string',
      group: 'info',
      description: 'E-mail do usuário'
    }),
    defineField({
      name: 'username',
      title: 'Username',
      type: 'string',
      group: 'info',
      description: 'Username do usuário'
    }),

    defineField({
      name: 'roles',
      title: 'Perfis de Acesso',
      type: 'array',
      group: 'roles',
      description: 'Perfis de Acesso do usuário dentro do sistema',
      of: [
        {
          type: 'object',
          options: {
            columns: 2,
            collapsible: true
          },
          preview: {
            select: {
              title: 'profile',
              subtitle: 'permissions'
            },
            prepare({ title, subtitle }) {
              return {
                title,
                subtitle: subtitle.join(', ')
              }
            }
          },
          fields: [
            {
              name: 'profile',
              title: 'Perfil',
              type: 'string',
              options: {
                list: [
                  { title: 'Root User', value: 'root' },
                  { title: 'Admin', value: 'admin' },
                  { title: 'Manager', value: 'manager' },
                  { title: 'Vendedor', value: 'seller' },
                  { title: 'Street', value: 'outdoor' },
                  { title: 'Financeiro', value: 'financial' },
                  { title: 'Estoque', value: 'stock' },
                  { title: 'Entregador', value: 'delivery' },
                  { title: 'Contador', value: 'accountant' },
                  { title: 'Cliente', value: 'customer' }
                ]
              }
            },
            {
              name: 'permissions',
              title: 'Permissões',
              type: 'array',
              of: [{ type: 'string' }],
              options: {
                list: [
                  { title: 'All', value: 'manage' },
                  { title: 'Criar', value: 'create' },
                  { title: 'Ler', value: 'read' },
                  { title: 'Atualizar', value: 'update' },
                  { title: 'Deletar', value: 'delete' }
                ]
              }
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'address',
      title: 'Endereço',
      type: 'address',
      group: 'profile',
      description: 'Endereço do usuário'
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
			type: 'image',
			options: {
				hotspot: true
			},
      group: 'profile',
      description: 'Avatar do usuário'
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Telefone',
      type: 'string',
      group: 'profile',
      description: 'Telefone do usuário'
    })
  ]
})