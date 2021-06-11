export default function convertISODate(ISO: string) {
  const date = new Date(ISO)
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
  }
}

export function convertISOtoDatetime(ISO: string) {
  return ISO.split('T')[0]
}
