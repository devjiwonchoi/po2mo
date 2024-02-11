import type { CliArgs, Po2MoConfig } from './types'

import { existsSync } from 'fs'
import { readFile, readdir, writeFile, mkdir } from 'fs/promises'
import { join, resolve } from 'path'
import { po, mo } from 'gettext-parser'
import { isInputDirectory, isInputFile, isValidInput, logger } from './utils'

async function convertPoToMo(input: string, output: string): Promise<void> {
  const poFile = await readFile(input, 'utf-8')
  const poData = po.parse(poFile)
  const moData = mo.compile(poData)
  await writeFile(output, moData)
}

async function getPoEntries(entry: string, recursive: boolean) {
  const poEntries: string[] = []

  const dirents = await readdir(entry, { withFileTypes: true })
  for (const dirent of dirents) {
    const direntPath = join(entry, dirent.name)

    if (dirent.isDirectory()) {
      if (!recursive) continue
      poEntries.push(...(await getPoEntries(direntPath, recursive)))
    }

    if (dirent.isFile() && dirent.name.endsWith('.po')) {
      poEntries.push(direntPath)
    }
  }

  return poEntries
}

function getConvertJobs(cwd: string, input: string, output?: string) {
  const resolvedInput = resolve(cwd, input)
  if (output) {
    if (output.endsWith('.mo')) {
      return convertPoToMo(resolvedInput, resolve(cwd, output))
    }

    const poFilename = input.split('/').pop()!
    const moFilename = poFilename.replace('.po', '.mo')

    const resolvedOutput = resolve(cwd, output, moFilename)
    existsSync(output) || mkdir(output, { recursive: true })
    return convertPoToMo(resolvedInput, resolvedOutput)
  }

  return convertPoToMo(resolvedInput, resolvedInput.replace('.po', '.mo'))
}

async function getConvertPromises({
  config,
  cwd: cwdParam,
  input,
  output,
  recursive,
}: CliArgs): Promise<Promise<void>[]> {
  const cwd = cwdParam ?? process.cwd()

  if (config) {
    const configPath = resolve(
      config,
      !config.endsWith('po2mo.json') ? 'po2mo.json' : ''
    )

    const configValue: Po2MoConfig = await import(configPath)
    const convertJobs: Promise<void>[] = configValue.files.map(
      ({ input, output }) =>
        convertPoToMo(resolve(cwd, input), join(cwd, output))
    )
    return convertJobs
  }

  if (!input) {
    logger.info(
      `No input was provided. Looking for the 'locale' directory in ${cwd}...`
    )

    // Look for `locale` directory in cwd and convert recursively
    const localeDir = join(cwd, 'locale')
    // fs.promises.stat is case-insensitive, therefore 'Locale' will also be accepted
    if (await isInputDirectory(localeDir)) {
      return getConvertPromises({
        input: localeDir,
        output: output ?? localeDir,
        recursive: true,
      })
    }

    throw new Error(`No 'locale' directory found in ${cwd}.`)
  }

  if (!isValidInput(input)) {
    throw new Error(`${input} is not a .po file or directory.`)
  }

  if (await isInputFile(input)) {
    return [getConvertJobs(cwd, input, output)]
  }

  if (await isInputDirectory(input)) {
    const poEntries = await getPoEntries(resolve(cwd, input), recursive)

    if (output?.endsWith('.mo')) {
      throw new Error('Input is a directory, but the output is a file.')
    }

    const convertJobs: Promise<void>[] = poEntries.map((poEntry) =>
      getConvertJobs(cwd, poEntry, output)
    )
    return convertJobs
  }

  return []
}

export async function po2mo({ input, config, ...args }: CliArgs) {
  const convertPromises = await getConvertPromises({ input, config, ...args })

  if (!convertPromises.length) {
    logger.warn(
      `No ${config ? 'config' : '.po file'} found in path: ${config ?? input}`
    )
    return
  }

  Promise.all(convertPromises)
}
