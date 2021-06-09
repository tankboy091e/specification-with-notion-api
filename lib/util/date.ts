export default function convertISODate(ISO: string) {
  const [dateArray, timeArray] = ISO.split('T')
  const [year, month, date] = dateArray.split('-').map((value) => parseInt(value, 10))
  const [hour, minute, second] = timeArray.replace('Z', '').split(':').map((value) => parseInt(value, 10))
  return {
    year,
    month,
    date,
    hour,
    minute,
    second,
  }
}

export function convertISOtoDatetime(ISO: string) {
  return ISO.split('T')[0]
}
