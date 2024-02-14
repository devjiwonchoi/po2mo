import { stat } from 'fs/promises'

export function exit(err: string | Error) {
  console.error(err)
  process.exit(1)
}

export async function validatePath(path: string) {
  try {
    const stats = await stat(path)
    return { isDirectory: stats.isDirectory(), isFile: stats.isFile() }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      const err = new Error(`${path} is not a .po file or directory.`)
      err.name = 'NOT_EXISTED'
      return Promise.reject(err)
    } else {
      throw error
    }
  }
}