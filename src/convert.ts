import { readFile, readdir, writeFile, stat } from 'fs/promises'
import { join, resolve } from 'path'
import { po, mo } from 'gettext-parser'
import { logger } from './utils'

type Po2MoConfig = {
  files: {
    input: string
    output: string
  }[]
}

async function convertPoToMo(input: string, output: string): Promise<void> {
  const poFile = await readFile(input, 'utf-8')
  const poData = po.parse(poFile)
  const moData = mo.compile(poData)
  await writeFile(output, moData)
}

async function getPoEntries(entry: string, recursive: boolean) {
  const dirents = await readdir(entry, { withFileTypes: true })
  const poEntries: string[] = []
  dirents.forEach((dirent) => {
    const direntPath = join(entry, dirent.name)
    if (dirent.isDirectory()) {
      if (!recursive) return
      getPoEntries(direntPath, recursive)
    }
    if (dirent.isFile() && dirent.name.endsWith('.po')) {
      poEntries.push(direntPath)
    }
  })
  return poEntries
}

export async function po2mo({
  config: configPath,
  cwd: cwdParam,
  input,
  output,
  recursive = false,
}: {
  config?: string
  cwd?: string
  input?: string | null
  output?: string
  recursive?: boolean
}) {
  const cwd = cwdParam ?? process.cwd()

  if (configPath) {
    if (input || output || recursive) {
      logger.warn('Cannot use --config with other options')
    }

    configPath = configPath.endsWith('po2mo.json')
      ? resolve(configPath)
      : join(configPath, 'po2mo.json')

    const config: Po2MoConfig = (await import(configPath)).default
    const convertJobs: Promise<void>[] = config.files.map(({ input, output }) =>
      convertPoToMo(join(cwd, input), join(cwd, output))
    )

    await Promise.all(convertJobs)
    return
  }

  if (input) {
    if (input.endsWith('.po')) {
      if (output) {
        if (output.endsWith('.mo')) {
          await convertPoToMo(join(cwd, input), join(cwd, output))
          return
        }
        if ((await stat(output)).isDirectory()) {
          const filename = input.split('/').pop()?.replace('.po', '.mo')
          await convertPoToMo(join(cwd, input), join(cwd, output, filename!))
          return
        }
      }
      await convertPoToMo(
        join(cwd, input),
        join(cwd, input.replace('.po', '.mo'))
      )
      return
    }

    const poEntries = await getPoEntries(join(cwd, input), recursive)
    const convertJobs: Promise<void>[] = poEntries.map((poEntry) => {
      if (output) {
        if (output.endsWith('.mo')) {
          throw new Error('Output path is not a directory')
        }
        return convertPoToMo(poEntry, join(cwd, output))
      }
      return convertPoToMo(poEntry, poEntry.replace('.po', '.mo'))
    })

    await Promise.all(convertJobs)
    return
  }
}
