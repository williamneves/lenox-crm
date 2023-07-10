import { defineType } from 'sanity';

export default defineType({
  name: 'address',
  title: 'Endereço',
  type: 'object',
  description: 'Endereço',
  fields: [
    {
      name: 'zipCode',
      title: 'CEP',
      type: 'string',
      description: 'CEP do endereço',
    },
    {
      name: 'zipCodeFetched',
      title: 'CEP buscado',
      type: 'boolean',
    },
    {
      name: 'street',
      title: 'Rua',
      type: 'string',
      description: 'Rua do endereço',
    },
    {
      name: 'number',
      title: 'Número',
      type: 'string',
      description: 'Número do endereço',
    },
    {
      name: 'complement',
      title: 'Complemento',
      type: 'string',
      description: 'Complemento do endereço',
    },
    {
      name: 'neighborhood',
      title: 'Bairro',
      type: 'string',
      description: 'Bairro do endereço',
    },
    {
      name: 'city',
      title: 'Cidade',
      type: 'string',
      description: 'Cidade do endereço',
    },
    {
      name: 'state',
      title: 'Estado',
      type: 'string',
      description: 'Estado do endereço',
    },
  ],
  preview: {
    select: {
      street: 'street',
      number: 'number',
      city: 'city',
      cep: 'zipCode',
    },
    prepare({ street, number, city, cep }) {
      return {
        title: `${street}, ${number} - ${city}`,
        subtitle: cep,
      }
    }
  },
})