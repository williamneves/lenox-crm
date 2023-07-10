// Employee Schema
import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'employee',
    title: 'Funcionários',
    type: 'document',
    fields: [
        defineField({
            name: 'user_id',
            title: 'ID do Usuário',
            type: 'string',
            description: 'ID do usuário no Autenticador',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'name',
            title: 'Nome',
            type: 'string',
            description: 'Nome do funcionário',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'email',
            title: 'E-mail',
            type: 'string',
            description: 'E-mail do funcionário',
            validation: Rule => Rule.required(),
        }),
    ],
})