import { readFile, readdir, writeFile, stat } from 'fs/promises'
import { join, resolve } from 'path'
import { po, mo } from 'gettext-parser'
import { logger } from './utils'
import { CliArgs } from './bin'

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

async function isInputPoFile(input: string) {
  return (await stat(input)).isFile() && input.endsWith('.po')
}

async function isInputDirectory(input: string) {
  return (await stat(input)).isDirectory()
}

async function isValidInput(input: string) {
  return (await isInputPoFile(input)) || (await isInputDirectory(input))
}

async function getConvertJobsFromArgs({
  config: configPath,
  cwd,
  input,
  output,
  recursive,
}: CliArgs): Promise<Promise<void>[]> {
  if (!input) {
    // If no input, attempt to use config at cwd
    configPath ??= join(cwd, 'po2mo.json')
  }

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
    return convertJobs
  }

  // Ensure input is provided once config is ruled out
  if (!input) {
    throw new Error('No input is provided')
  }

  if (!isValidInput(input)) {
    throw new Error(`${input} is not a file or directory`)
  }

  if (await isInputPoFile(input)) {
    if (output) {
      const poFilename = input.split('/').pop()!
      const moFilename = poFilename?.replace('.po', '.mo')
      output = output.endsWith('.mo') ? output : join(output, moFilename)

      return [convertPoToMo(resolve(cwd, input), resolve(cwd, output))]
    }

    return [
      convertPoToMo(
        resolve(cwd, input),
        resolve(cwd, input.replace('.po', '.mo'))
      ),
    ]
  }

  if (await isInputDirectory(input)) {
    const poEntries = await getPoEntries(resolve(cwd, input), recursive)
    const convertJobs: Promise<void>[] = poEntries.map((poEntry) => {
      if (!isInputPoFile(poEntry)) {
        throw new Error(`${poEntry} is not a .po file`)
      }

      if (output) {
        if (output.endsWith('.mo')) {
          throw new Error('Output path is not a directory')
        }

        const poFilename = poEntry.split('/').pop()!
        const moFilename = poFilename?.replace('.po', '.mo')
        return convertPoToMo(poEntry, resolve(cwd, output, moFilename))
      }

      return convertPoToMo(poEntry, poEntry.replace('.po', '.mo'))
    })

    return convertJobs
  }

  return []
}

export async function po2mo({ input, config, ...args }: CliArgs) {
  const convertJobs = await getConvertJobsFromArgs({ input, config, ...args })

  if (!convertJobs.length) {
    logger.warn(
      `No ${config ? 'config' : '.po file'} found in path: ${config ?? input}`
    )
    return
  }

  Promise.all(convertJobs)
}
