export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function cn(...args : (string | boolean)[]) {
  const clean = args.filter((value) => value)
  return clean.join(' ').trim()
}
