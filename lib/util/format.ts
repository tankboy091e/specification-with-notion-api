export default function getPascalCase(str: string): string {
  return str[0].toLocaleUpperCase() + str.substr(1)
}
