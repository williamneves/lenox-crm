import { q, z } from 'groqd'
import { getStates } from '@brazilian-utils/brazilian-utils'
// *** SANITY DEFAULT FIELDS ***
// * Default fields on Sanity documents
export const metaDataFields = {
  _id: q.string(),
  _type: q.string(),
  _createdAt: q.date(),
  _updatedAt: q.date(),
  _rev: q.string()
}

// * Default fields when field is a reference to another document
export const referenceFields = {
  _type: q.literal('reference'),
  _ref: q.string(),
  _weak: q.boolean().optional()
}

// * Schema for Sanity's image asset
export const ImageAsset = z.object({
  _createdAt: z.string(),
  _id: z.string(),
  _rev: z.string(),
  _type: z.literal('sanity.imageAsset'),
  assetId: z.string(),
  extension: z.string(),
  metadata: z.object({
    dimensions: z.object({
      aspectRatio: z.number(),
      height: z.number(),
      width: z.number()
    }),
    location: z
      .object({
        _type: z.literal('geopoint'),
        lat: z.number(),
        lng: z.number()
      })
      .optional(),
    lqip: z.string(),
    palette: z.record(
      z.object({
        background: z.string(),
        foreground: z.string(),
        population: z.number(),
        title: z.string()
      })
    )
  }),
  mimeType: z.string(),
  originalFilename: z.string(),
  path: z.string(),
  sha1hash: z.string(),
  size: z.number(),
  url: z.string(),
  _updatedAt: z.string()
})

// * Fields when field is an image
export const Image = z.object({
  _type: z.literal('image'),
  asset: z
    .object({
      _type: z.literal('reference'),
      _ref: z.string()
    })
    // .or(ImageAsset)
  ,
  crop: z
    .object({
      top: z.number(),
      bottom: z.number(),
      left: z.number(),
      right: z.number()
    })
    .optional(),
  hotspot: z
    .object({
      x: z.number(),
      y: z.number(),
      height: z.number(),
      width: z.number()
    })
    .optional()
})

export type SanityImage = z.infer<typeof Image>

// * SLUG
export const slugFields = q.object({
  _type: q.literal('slug'),
  current: q.string()
})

// ** INSERT IMAGE ASSET **
export const insertImageAsset = q.object({
  _type: q.literal('image'),
  asset: q.object({
    _type: q.literal('reference'),
    _ref: q.string()
  })
})

// *** MY CUSTOM FIELDS TYPES ***
// * Address fields
export const addressFields = {
  zipCode: q
    .string()
    .optional()
    // Tranform, remove spaces or dashes
    .transform(val => {
      if (val) {
        return val.replace(/[\s-]/g, '')
      }
      return val
    }),
  zipCodeFetched: q.boolean().optional(),
  street: q.string().optional(),
  number: q.string().optional(),
  complement: q.string().optional(),
  neighborhood: q.string().optional(),
  city: q.string().optional(),
  state: q.string().optional()
  // Transform, if the state has more than 2 letters is a name, so I need to get the UF from getStates
  // getStates() return  { code: 'AC', name: 'Acre' },
  // I need to get the code from the name
    .transform(val => {
      if (val && val.length > 2) {
        const state = getStates().find(state => state.name === val)
        if (state) {
          return state.code
        }
      }
      return val
    }
    ),
}

// * Social media fields
export const channelsLabel = {
  whatsapp: 'Whatsapp',
  telegram: 'Telegram',
  instagram: 'Instagram',
  facebook: 'Facebook',
  twitter: 'Twitter',
  linkedin: 'Linkedin',
  youtube: 'Youtube',
  tiktok: 'Tiktok',
  other: 'Outros'
} as const

export type Channel = keyof typeof channelsLabel

/**
 * @description
 * When need to create a select input with all channels options
 * I create this function to auto update the options when the schema change
 * @returns {
 * Array<{
 *    value: Channel,
 *    label: string,
 *    key: Channel
 * }>
 * }
 */
export const channelOptions = Object.entries(channelsLabel).map(([value, label]) => ({
  value,
  label,
  key: value
}))

const channels = Object.keys(channelsLabel) as [Channel, ...Channel[]]

export const socialMediaFields = {
  channel: z.enum(channels),
  username: q.string(),
  profileUrl: q.string().url().optional(),
  moreInfo: q.string().optional()
}

// * Payment methods fields
const paymentTypesLabel = {
  cash: 'Dinheiro',
  creditCard: 'Cartão de crédito',
  debitCard: 'Cartão de débito',
  ted: 'TED',
  pix: 'Pix',
  creditPlan: 'Crediário',
  others: 'Outros'
} as const

export type PaymentType = keyof typeof paymentTypesLabel

/**
 * @description
 * When need to create a select input with all payment types options
 * I create this function to auto update the options when the schema change
 * @returns {
 * Array<{
 *   value: PaymentType,
 *  label: string,
 * key: PaymentType
 * }>
 * }
 */
export const paymentTypeOptions = Object.entries(paymentTypesLabel).map(
  ([value, label]) => ({ value, label, key: value })
)

const paymentTypes = Object.keys(paymentTypesLabel) as [PaymentType, ...PaymentType[]]

// * Payment methods fields
export const paymentMethodFields = {
  name: q.string(),
  type: z.enum(paymentTypes),
  bankAccountLinked: q.object(referenceFields).optional(),
  cashierAccountLinked: q.object(referenceFields).optional()
}

export type SelectOption = {
  value: string
  key: string
  label: string
}

// * Demographic Fields ** //
// SEX OPTIONS
export const sexLabel = {
  male: 'Homem',
  female: 'Mulher',
  other: 'Outro'
} as const

export type SexType = keyof typeof sexLabel

export const sexOptions = Object.entries(sexLabel).map(([value, label]) => ({
  value,
  label,
  key: value
}))

const sexTypes = Object.keys(sexLabel) as [SexType, ...SexType[]]

// EDUCATION STATUS OPTIONS
const educationStatusLabel = {
  elementary: 'Ensino Fundamental',
  highSchool: 'Ensino Médio',
  college: 'Ensino Superior',
  postGrad: 'Pós-Graduação',
  masters: 'Mestrado',
  doctorate: 'Doutorado'
} as const

export type EducationStatusType = keyof typeof educationStatusLabel

export const educationStatusOptions = Object.entries(educationStatusLabel).map(
  ([value, label]) => ({
    value,
    label,
    key: value
  })
)

const educationStatusTypes = Object.keys(educationStatusLabel) as [
  EducationStatusType,
  ...EducationStatusType[]
]

// EMPLOYMENT STATUS OPTIONS
const employmentStatusLabel = {
  employed: 'Empregado',
  unemployed: 'Desempregado',
  selfEmployed: 'Autônomo',
  retired: 'Aposentado',
  student: 'Estudante'
} as const

export type EmploymentStatusType = keyof typeof employmentStatusLabel

export const employmentStatusOptions = Object.entries(employmentStatusLabel).map(
  ([value, label]) => ({
    value,
    label,
    key: value
  })
)

const employmentStatusTypes = Object.keys(employmentStatusLabel) as [
  EmploymentStatusType,
  ...EmploymentStatusType[]
]

// FAMILY INCOME OPTIONS
const familyIncomeLabel = {
  '1000': 'Até R$ 1.000,00',
  '2500': 'De R$ 1.000,00 a R$ 2.500,00',
  '5000': 'De R$ 1.000,00 a R$ 5.000,00',
  '10000': 'De R$ 5.000,00 a R$ 10.000,00',
  '20000': 'De R$ 10.000,00 a R$ 20.000,00',
  '20000+': 'Acima de R$ 20.000,00'
} as const

export type FamilyIncomeType = keyof typeof familyIncomeLabel

export const familyIncomeOptions = Object.entries(familyIncomeLabel).map(
  ([value, label]) => ({
    value,
    label,
    key: value
  })
)

const familyIncomeTypes = Object.keys(familyIncomeLabel) as [
  FamilyIncomeType,
  ...FamilyIncomeType[]
]

// Marital status options
const maritalStatusLabel = {
  single: 'Solteiro',
  friendly: 'Amigado',
  married: 'Casado',
  divorced: 'Divorciado',
  widowed: 'Viúvo'
} as const

export type MaritalStatusType = keyof typeof maritalStatusLabel

export const maritalStatusOptions = Object.entries(maritalStatusLabel).map(
  ([value, label]) => ({
    value,
    label,
    key: value
  })
)

const maritalStatusTypes = Object.keys(maritalStatusLabel) as [
  MaritalStatusType,
  ...MaritalStatusType[]
]

// * Demographic fields
export const demographicFields = {
  DOB: q
    .date()
    .nullish()
    // .transform(value =>
    //   // Change the date format to YYYY-MM-DD
    //   value ? value.toISOString().split('T')[0] : value
    // ),
  ,
  sex: z.enum(sexTypes).optional().or(q.literal('').optional()),
  education: z.enum(educationStatusTypes).optional().or(q.literal('').optional()),
  employment: z.enum(employmentStatusTypes).optional().or(q.literal('').optional()),
  occupation: q.string().optional(),
  familyIncome: z.enum(familyIncomeTypes).optional().or(q.literal('').optional()),
  maritalStatus: z.enum(maritalStatusTypes).optional().or(q.literal('').optional()),
  numberOfChildren: q.number().min(0).optional()
}
