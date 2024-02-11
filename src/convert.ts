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
  config,
  cwd: cwdParam,
  input,
  output,
  recursive,
}: CliArgs): Promise<Promise<void>[]> {
  const cwd = cwdParam ?? process.cwd()

  if (config) {
    const configPath = !config.endsWith('po2mo.json')
      ? resolve(config, 'po2mo.json')
      : resolve(config)

    const configValue: Po2MoConfig = await import(configPath)
    const convertJobs: Promise<void>[] = configValue.files.map(
      ({ input, output }) =>
        convertPoToMo(resolve(cwd, input), join(cwd, output))
    )
    return convertJobs
  }

  // Ensure input is provided once config is ruled out
  if (!input) {
    logger.warn(
      `No input was provided. Looking for the 'locale' directory in ${cwd}...`
    )

    // Look for `locale` directory in cwd and convert recursively
    const localeDir = join(cwd, 'locale')
    if (await isInputDirectory(localeDir)) {
      return getConvertJobsFromArgs({
        input: localeDir,
        output: output ?? localeDir,
        recursive: true,
      })
    }

    throw new Error(`No 'locale' directory found in ${cwd}.`)
  }

  if (!isValidInput(input)) {
    throw new Error(`${input} is not a file or directory.`)
  }

  if (await isInputPoFile(input)) {
    const resolvedInput = resolve(cwd, input)

    if (output) {
      const poFilename = input.split('/').pop()!
      const moFilename = poFilename.replace('.po', '.mo')

      const resolvedOutput = output.endsWith('.mo')
        ? output
        : join(output, moFilename)

      return [convertPoToMo(resolvedInput, resolve(cwd, resolvedOutput))]
    }

    return [convertPoToMo(resolvedInput, resolvedInput.replace('.po', '.mo'))]
  }

  if (await isInputDirectory(input)) {
    const poEntries = await getPoEntries(resolve(cwd, input), recursive)

    if (output?.endsWith('.mo')) {
      throw new Error('Output path is not a directory')
    }

    const convertJobs: Promise<void>[] = poEntries.map((poEntry) => {
      if (output) {
        const poFilename = poEntry.split('/').pop()!
        const moFilename = poFilename.replace('.po', '.mo')
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
