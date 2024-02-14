import { stat } from 'fs/promises'

export function exit(err: string | Error) {
  logger.error(err)
  process.exit(1)
}

export const logger = {
  info(message: string) {
    console.log('\x1b[32m%s\x1b[0m', '✓', message)
  },
  warn(message: string) {
    console.warn('\x1b[93m%s\x1b[0m', '⚠', message)
  },
  error(message: string | Error) {
    console.error('\x1b[91m%s\x1b[0m', '𝕏', message)
  },
}

export async function validatePath(path: string) {
  try {
    const stats = await stat(path)
    return { isDirectory: stats.isDirectory(), isFile: stats.isFile() }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      const err = new Error(`no such file or directory, ${path}`)
      err.name = 'MISSING_PO'
      return Promise.reject(err)
    } else {
      throw error
    }
  }
}