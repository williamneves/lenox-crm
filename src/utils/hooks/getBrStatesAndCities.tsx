import { useMemo } from 'react'
import { getStates, getCities } from '@brazilian-utils/brazilian-utils'
import { type StateCode, type StateName } from '@brazilian-utils/brazilian-utils/dist/common/states'

export const getBrStates = getStates().map(({ code, name }) => ({
  value: code,
  label: name,
  key: code
}))

export const useBrStates = () => {
  const brStates = useMemo(() => {
    return getStates().map(({ code, name }) => ({ value: code, label: `${name} (${code})`, key: code }))
  }, [])

  return brStates
}

export const useBrCities = (state?: StateCode | StateName) => {
  const cities = useMemo(() => {
    return getCities(state).map((city) => ({ value: city, label: city, key: city }))
  }, [state])

  return cities
}
