import { stat } from 'fs/promises'
import pc from 'picocolors'

export const formatDuration = (duration: number) =>
  duration >= 1000 ? `${duration / 1000}s` : `${duration}ms`

const defaultColorFn = (text: string) => text
const color = (prefixColor: any) =>
  pc.isColorSupported ? (pc as any)[prefixColor] : defaultColorFn

export function paint(prefix: string, prefixColor: any, ...arg: any[]) {
  if (pc.isColorSupported) {
    console.log((pc as any)[prefixColor](prefix), ...arg)
  } else {
    console.log(prefix, ...arg)
  }
}
export const logger = {
  log(...arg: any[]) {
    console.log(...arg)
  },
  warn(...arg: any[]) {
    console.warn(color('yellow')('⚠️'), ...arg)
  },
  error(...arg: any) {
    console.error(color('red')('⨯'), ...arg)
  },
  info(...arg: any) {
    console.log(color('green')('✓'), ...arg)
  },
}

export function exit(err: string | Error) {
  logger.error(err)
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
