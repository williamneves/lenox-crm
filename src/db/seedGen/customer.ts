// CREATE A FAKE CUSTOMER TO SEED THE DATABASE AND TEST THE API AND FRONTEND
// {
//    "_type":"customer", // DEFAULT
//    "inactive":false, // DEFAULT
//    "customerID":"JTB853", // TYPE: String with 6 characters, first 3 are letters and last 3 are numbers
//    "name":"Lorraine Santos", // Full Brazilian name
//    "cpf":"01075182956", // CPF is a Brazilian ID number with 11 digits
//    "email":"lorraine@santos.com",
//    "phone":"11982720192", // Phone is a Brazilian phone number with 11 digits
//    "phoneIsWhatsapp":false, // TYPE: true | false
//    "demographic":{
//       "DOB":"1980-08-10T00:00:00.000Z",
//       "sex":"woman", // TYPE: man | woman | other
//       "education":"highSchool", // TYPE: elementary | highSchool | college | postGrad | masters | doctorate
//       "employment":"employed", // TYPE: employed | unemployed | selfEmployed | retired | student
//       "occupation":"student", // Any string
//       "familyIncome":1000, // String TYPE: '1000' | '2500' | '5000' | '10000' | '20000' | '20000+'
//       "maritalStatus":"single", // TYPE: single | married | divorced | widowed
//       "numberOfChildren":0,
//    },
//    "address":{
//  "zipCode":"01001000", // TYPE: String with 8 digits
//  "street":"Praça da Sé", // Any string
//  "number":"1", // Any string
//  "complement":"Bloco A", // Any string
//  "neighborhood":"Sé", // Any string
//  "city":"São Paulo", // Any string
//  "state":"SP", // TYPE: String with 2 letters
// },
// socialMedia:[{
// channel: 'facebook', // TYPE: facebook | instagram | twitter | linkedin | youtube | tiktok | whatsapp | other
// username: 'lorraine.santos', // Any string
// profileUrl: 'https://www.facebook.com/lorraine.santos', // Any string
// moreInfo: 'https://www.facebook.com/lorraine.santos/about', // Any string
// }]
// following is Default
//    "createdBy":{ // Repeat the same
//      "_type":"reference",
//       "_ref":"ce5e5f91-3a84-44a4-b21e-9b37e62b4a93",
//    },
//    "stores":[ // Repeat the same
//       {
//        "_type":"reference",
//         "_ref":"e465b3f2-0add-41f2-93d0-017b5d99bc54",
//        }
//    ]
// }

import { fakerPT_BR as faker } from '@faker-js/faker'
import { type CustomerFetch , type CreateCustomerParams} from '../queries/customer/customer.lib'
import { generate } from 'node-cpf'
import { getFakePhoneNumbers } from 'src/utils/getFakePhoneNumbers'
import { isValidPhone } from '@brazilian-utils/brazilian-utils'

const whileFake = async () => {
  let phone = ''

  while (!isValidPhone(phone) || !phone) {
    // get 10 random numbers, and check if at least one of them is valid, if is get the first valid number
    // If none of them is valid, get another 10 numbers
    const phones = await getFakePhoneNumbers(10)
    phone = phones.find(phone => isValidPhone(phone)) || ''
  }

  return phone
}


// Function to generate a fake customer
export const generateFakeCustomer = async (arraySize: number) => {
  // Create an array with the size passed as argument
  const fakeCustomers = new Array(arraySize)

  const socialMediaLenght = faker.number.int({
    min: 0,
    max: 5
  })

  const socialMedia = new Array(socialMediaLenght).fill({
    channel: faker.helpers.arrayElement([
      'facebook',
      'instagram',
      'twitter',
      'linkedin',
      'youtube',
      'tiktok',
      'whatsapp',
      'other'
    ]),
    username: faker.internet.userName(),
    profileUrl: faker.internet.url(),
    moreInfo: faker.internet.url()
  })

  // Loop through the array and create a fake customer
  for (let i = 0; i < arraySize; i++) {
    const customerSex = faker.person.sex() as 'Feminino' | 'Masculino'
    const customerName = faker.person.fullName({
      sex: customerSex === 'Feminino' ? 'female' : 'male'
    })

    const fakeCustomer: CreateCustomerParams = {
      _type: 'customer',
      inactive: false,
      customerID: faker.helpers.fromRegExp(/[A-Z]{3}[0-9]{3}/),
      name: customerName,
      cpf: generate(),
      email: faker.internet
        .email({
          firstName: customerName.split(' ')[0],
          lastName: customerName.split(' ')[1],
          allowSpecialCharacters: false
        })
        .toLocaleLowerCase(),
      phone: await whileFake(),
      phoneIsWhatsapp: faker.datatype.boolean(),
      demographic: {
        DOB: faker.date
          .birthdate({
            min: 18,
            max: 80,
            mode: 'age'
          }),
        sex: customerSex === 'Feminino' ? 'female' : 'male',
        education: faker.helpers.arrayElement([
          'elementary',
          'highSchool',
          'college',
          'postGrad',
          'masters',
          'doctorate'
        ]),
        employment: faker.helpers.arrayElement([
          'employed',
          'unemployed',
          'selfEmployed',
          'retired',
          'student'
        ]),
        occupation: faker.person.jobTitle(),
        familyIncome: faker.helpers.arrayElement([
          '1000',
          '2500',
          '5000',
          '10000',
          '20000',
          '20000+'
        ]),
        maritalStatus: faker.helpers.arrayElement([
          'single',
          'married',
          'divorced',
          'widowed'
        ]),
        numberOfChildren: faker.number.int({
          min: 0,
          max: 5
        })
      },
      address: {
        zipCode: faker.location.zipCode(),
        street: faker.location.street(),
        number: faker.location.buildingNumber(),
        complement: faker.location.secondaryAddress(),
        neighborhood: faker.location.county(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true })
      },
      socialMedia: socialMedia,

      createdBy: {
        _type: 'reference',
        _ref: 'ce5e5f91-3a84-44a4-b21e-9b37e62b4a93'
      },
      stores: [
        {
          _type: 'reference',
          _ref: 'e465b3f2-0add-41f2-93d0-017b5d99bc54'
        }
      ]
    }

    fakeCustomers[i] = fakeCustomer
  }

  return fakeCustomers
}
