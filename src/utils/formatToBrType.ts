const BrTypes = {
  cpf: '###.###.###-##',
  cnpj: '##.###.###/####-##',
  mobilePhone: '(##) 9####-####',
  phone: '(##) ####-####',
  cep: '#####-###'
} as const

type BrType = keyof typeof BrTypes

const BrTypesSecure = {
  cpf: '###.***.***-*#',
  cnpj: '##.***.***/***#-##',
  mobilePhone: '(##) #####-****',
  phone: '(##) ####-****',
  cep: '#####-***'
}

type BrTypeSecure = keyof typeof BrTypesSecure

/**
 * This function formats a string to a brazilian type
 *
 * @param value string - value to be formatted
 * @param type BrType - type of formatting
 * @param secure boolean - if true, will return a secure format, default is false
 * @returns string - formatted value
 */

export const formatToBrType = (value?: string, type?: BrType, secure = false) => {

  if (!value) return ''
  if (!type) return value

  const mask = secure ? BrTypesSecure[type] : BrTypes[type]
  const unmasked = value.replace(/[^\d]/g, '')

  let maskedValue = ''

  let i = 0
  let j = 0

  while (i < mask.length && j < unmasked.length) {
    if (mask[i] === '#') {
      maskedValue += unmasked[j]
      j++
    } else {
      maskedValue += mask[i]
    }
    i++
  }

  return maskedValue
}
