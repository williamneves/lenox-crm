/**
 * Generates a unique, progressive ID based on the date and time.
 *
 * @param {Date} date - The date and time for which to generate the ID. Defaults to the current date and time.
 * @param {number} hourMultiplier - The multiplier for the hours part of the time calculation. Must be at least 380. Defaults to 380.
 * @param {number} minuteMultiplier - The multiplier for the minutes part of the time calculation. Must be at least 61. Defaults to 61.
 * @returns {string} The generated ID.
 * @throws {Error} If hourMultiplier is less than 380 or minuteMultiplier is less than 61.
 */
export function generateProgressiveId(
  date: Date = new Date(),
  hourMultiplier = 380,
  minuteMultiplier = 61
): string {
  // Check the multipliers
  if (hourMultiplier < 380) {
    throw new Error('hourMultiplier must be at least 380.')
  }
  if (minuteMultiplier < 61) {
    throw new Error('minuteMultiplier must be at least 61.')
  }

  // Maximum possible time value and its length
  const maxTimeValue = (23 * hourMultiplier + 59 * minuteMultiplier + 59).toString()
  const maxTimeLength = maxTimeValue.length

  // Last two digits of the year
  const year = (date.getFullYear() % 100).toString()

  // Letter for the month
  const months = 'ABCDEFGHIJKL'
  const month = months[date.getMonth()]

  // Two letters for the day
  const tens = 'ABC'
  const ones = 'ABCDEFGHIJ'
  const day = tens[Math.floor(date.getDate() / 10)]! + ones[date.getDate() % 10]!

  // Number for the time, padded to the maximum time length
  const time = (
    date.getHours() * hourMultiplier +
    date.getMinutes() * minuteMultiplier +
    date.getSeconds()
  )
    .toString()
    .padStart(maxTimeLength, '0')
  const milliseconds = date.getMilliseconds().toString().padStart(1, '0')

  const id = year + month ?? '' + day + time + milliseconds

  return id
}
