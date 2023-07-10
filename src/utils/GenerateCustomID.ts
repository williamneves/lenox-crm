import randomatic from "randomatic"

function getDateLetters() {
  const date = new Date()
  const days = ['D', 'S', 'T', 'Q', 'I', 'X', 'A']
  const months = ['J', 'F', 'R', 'A', 'M', 'J', 'H', 'A', 'S', 'O', 'N', 'D']

  const dayLetter = days[date.getDay()]
  const monthLetter = months[date.getMonth()]

  return `${monthLetter}${dayLetter}`
}

export const randomCustomID = () =>
  `${getDateLetters()}${randomatic('A', 1, { exclude: 'DSTQIXA' })}${randomatic('0', 3)}`
