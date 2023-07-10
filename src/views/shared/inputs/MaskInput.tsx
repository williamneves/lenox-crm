import { InputBase, type InputBaseProps, Input, type InputProps } from '@mantine/core'

import { useId } from '@mantine/hooks'

import {
  NumericFormat,
  PatternFormat,
  type NumericFormatProps,
  type PatternFormatProps
} from 'react-number-format'

type PatternTemplates = 'phone' | 'cep' | 'cpf' | 'cnpj'

export type MaskInputProps = InputBaseProps &
  Partial<PatternFormatProps> & {
    value: string
    patternTemplate: PatternTemplates
  }

const getThePattern = (type: PatternTemplates, value: string) => {
  function isMobile(phone: string | undefined) {
    if (!phone) return false
    // Remove non-digit characters
    const digits = phone.replace(/\D/g, '')
    // Check if third character is '9'
    return digits[2] === '9'
  }

  switch (type) {
    case 'cpf':
      return {
        mask: '_',
        format: '###.###.###-##',
        valueIsNumericString: true
      }
    case 'cnpj':
      return {
        mask: '_',
        format: '##.###.###/####-##',
        valueIsNumericString: true
      }
    case 'cep':
      return {
        mask: '_',
        format: '#####-###',
        valueIsNumericString: true
      }
    case 'phone':
      return {
        mask: '_',
        format: isMobile(value) ? '(##) #####-####' : '(##) ####-####'
      }
    default:
      return {
        mask: '_',
        format: '###.###.###-##',
        valueIsNumericString: true
      }
  }
}

/**
 * 
 * @param props MaskInputProps
 * @returns MaskInput component
 * This is a custom component that uses react-number-format to format the input value
 * Actually has 4 templates: phone, cep, cpf and cnpj
 */
export default function MaskInput(props: MaskInputProps) {
  const id = useId(props.id)

  const { onChange, value, patternTemplate, ...rest } = props

  const patternSetup = (value: string) => getThePattern(patternTemplate, value)

  if (!onChange) return

  return (
    <InputBase<any>
      {...rest}
      id={id}
      key={id}
      component={PatternFormat}
      {...patternSetup(value)}
      onValueChange={({ value }: { value: string }) => onChange(value as any)}
      value={value}
    />
  )
}
