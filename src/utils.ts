import { stat } from 'fs/promises'

export function exit(err: string | Error) {
  console.error(err)
  process.exit(1)
}

export async function isInputFile(input: string) {
  return (await stat(input)).isFile()
}

export async function isInputDirectory(input: string) {
  return (await stat(input)).isDirectory()
}

export async function isValidInput(input: string) {
  return (
    ((await isInputFile(input)) && input.endsWith('.po')) ||
    (await isInputDirectory(input))
  )
}
