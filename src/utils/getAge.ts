type AgeOptions = {
  birthday?: Date | string
  dateToAge?: Date
  dateFormat?: 'years' | 'yearsMonths' // 34y or 34y 2m
}

/**
 * This function returns the age of a person
 * Edges cases:
 * - if birthday is after dateToAge, it will return ""
 * - if birthday is today, it will return ""
 * - if the age is less then 2 years, it will return the age in Years and Months
 * - if the age is less then 1 years, it will return the age in month
 * - if the age is less then 1 month, it will return the age in days
 *
 * @param birthday Date | string - birthday of the person
 * @param dateToAge Date - date to calculate the age, default is today
 * @param dateFormat 'years' | 'yearsMonths' - format of the return, default is 'years'
 */

export const getAge = ({
  birthday,
  dateToAge = new Date(),
  dateFormat = 'years'
}: AgeOptions) => {

  if (!birthday) return ''

  if (typeof birthday === 'string') {
    birthday = new Date(birthday)
  }

  const age = dateToAge.getFullYear() - birthday.getFullYear()
  const month = dateToAge.getMonth() - birthday.getMonth()
  const day = dateToAge.getDate() - birthday.getDate()

  if (age < 0) return ""
  if (age === 0) {
    if (month < 0) return ""
    if (month === 0) {
      if (day < 0) return ""
      if (day === 0) return ""
      return `${day}d`
    }
    if (month === 1) return `${month}m`
    return `${month}m ${day}d`
  }
  if (age === 1) return `${age}a`
  if (dateFormat === 'years') return `${age}a`
  if (month === 0) return `${age}a`
  if (month === 1) return `${age}a ${month}m`
  return `${age}a ${month}m`
}

/**
 * Return the date formated to Brazilian format
 * @param date Date - date to be formatted
 * @params options - options to format the date
 * @params options = 'short' - if true, will return the date in short (dd/mm/yy) format, default is false
 * @params options = 'withTime' - if true, will return the date with time 24h, default is false
 * @params options = 'shortWithTime' - if true, will return the date with time 24h, default is false
 * @params options = 'time' - if true, will return just the with time 24h, default is false
 * @returns string - date formatted
 */

export const formatDate = (
  date: Date,
  options?: 'short' | 'withTime' | 'shortWithTime' | 'time'
) => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString().padStart(4, '0')
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  const second = date.getSeconds().toString().padStart(2, '0')

  if (options === 'short') return `${day}/${month}/${year}`
  if (options === 'withTime') return `${day}/${month}/${year} ${hour}:${minute}:${second}`
  if (options === 'shortWithTime') return `${day}/${month}/${year} ${hour}:${minute}`
  if (options === 'time') return `${hour}:${minute}:${second}`
  return `${day}/${month}/${year}`
}
