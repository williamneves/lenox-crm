 import { defineField } from 'sanity'

export default defineField({
  name: 'demographic',
  title: 'Informações Demográficas',
  type: 'object',
  fields: [
    {
      // Date of birth
      name: 'DOB',
      title: 'Data de Nascimento',
      type: 'datetime'
    },
    {
      // Sex
      name: 'sex',
      title: 'Sexo',
      type: 'string',
      options: {
        list: [
          { title: 'Homem', value: 'male' },
          { title: 'Mulher', value: 'female' },
          { title: 'Outro', value: 'other' }
        ]
      }
    },
    {
      // Level of education
      name: 'education',
      title: 'Nível de Educação',
      type: 'string',
      options: {
        list: [
          { title: 'Ensino Fundamental', value: 'elementary' },
          { title: 'Ensino Médio', value: 'highSchool' },
          { title: 'Ensino Superior', value: 'college' },
          { title: 'Pós-Graduação', value: 'postGrad' },
          { title: 'Mestrado', value: 'masters' },
          { title: 'Doutorado', value: 'doctorate' }
        ]
      }
    },
    // Employment status
    {
      name: 'employment',
      title: 'Situação de Emprego',
      type: 'string',
      options: {
        list: [
          { title: 'Empregado', value: 'employed' },
          { title: 'Desempregado', value: 'unemployed' },
          { title: 'Autônomo', value: 'self-employed' },
          { title: 'Aposentado', value: 'retired' },
          { title: 'Estudante', value: 'student' }
        ]
      }
    },
    {
      name: 'occupation',
      title: 'Ocupação',
      type: 'string'
    },
    {
      name: 'familyIncome',
      title: 'Faixa de Renda Familiar',
      type: 'string',
      options: {
        list: [
          { title: 'Até R$ 1.000,00', value: '1000' },
          { title: 'De R$ 1.000,00 a R$ 2.500,00', value: '2500' },
          { title: 'De R$ 1.000,00 a R$ 5.000,00', value: '5000' },
          { title: 'De R$ 5.000,00 a R$ 10.000,00', value: '10000' },
          { title: 'De R$ 10.000,00 a R$ 20.000,00', value: '20000' },
          { title: 'Acima de R$ 20.000,00', value: '20000+' }
        ]
      }
    },
    {
      name: 'maritalStatus',
      title: 'Estado Civil',
      type: 'string',
      options: {
        list: [
          { title: 'Solteiro', value: 'single' },
          { title: 'Amigado', value: 'friendly' },
          { title: 'Casado', value: 'married' },
          { title: 'Divorciado', value: 'divorced' },
          { title: 'Viúvo', value: 'widowed' },
        ]
      }
    },
    {
      name: 'numberOfChildren',
      title: 'Número de Filhos',
      type: 'number',
      initialValue: 0
    }
  ]
})
