import axios from 'axios';

// curl -X 'GET' \
//   'https://randommer.io/api/Phone/Generate?CountryCode=BR&Quantity=55' \
//   -H 'accept: */*' \
//   -H 'X-Api-Key: d627c1666d10430caa887fead234af9d'

const axiosInstance = axios.create({
  baseURL: 'https://randommer.io/api/Phone/Generate',
  headers: {
    'X-Api-Key': process.env.NEXT_PUBLIC_RANDOMPHONE_API_KEY
  }
})

export const getFakePhoneNumbers = async (quantity = 1, CountryCode = "BR", noCountryCode = true, noSpacesAndSpecialChars = true) => {
  const { data } = await axiosInstance.get('', {
    params: {
      CountryCode,
      Quantity: quantity
    }
  })

  let res = [...data]

  // If is true, remove the country code , the country code is before the first space
  if (noCountryCode) {
    res = res.map((phone: string) => {
      return phone.split(' ').slice(1).join(' ')
    })
  }

  // Remove all spaces and special characters
  if (noSpacesAndSpecialChars) {
    res = res.map((phone: string) => {
      return phone.replace(/[^0-9]/g, '')
    })
  }

  return res;
}


