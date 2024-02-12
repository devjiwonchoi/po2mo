import type { CliArgs, Po2MoConfig } from './types'

import { existsSync } from 'fs'
import { readFile, readdir, writeFile, mkdir } from 'fs/promises'
import { dirname, join, resolve } from 'path'
import { po, mo } from 'gettext-parser'
import git from 'simple-git'
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
    const direntPath = join(dirent.path, dirent.name)
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

function getConvertJobs(
  cwd: string,
  input: string,
  output?: string,
  recursive?: boolean,
  inputParam?: string
) {
  const resolvedInput = resolve(cwd, input)
  if (output) {
    if (output.endsWith('.mo')) {
      return convertPoToMo(resolvedInput, resolve(cwd, output))
    }

    const poFilename = input.split('/').pop()!
    const moFilename = poFilename.replace('.po', '.mo')

    // TODO: Refactor
    const resolvedOutput =
      recursive && inputParam
        ? join(
            output,
            input.replace(resolve(cwd, inputParam), '').replace(poFilename, ''),
            moFilename
          )
        : resolve(cwd, output, moFilename)

    const resolvedOutputDir = dirname(resolvedOutput)
    existsSync(resolvedOutputDir) ||
      mkdir(resolvedOutputDir, { recursive: true })

    return convertPoToMo(resolvedInput, resolvedOutput)
  }

  return convertPoToMo(resolvedInput, resolvedInput.replace('.po', '.mo'))
}

async function getConvertPromises({
  cwd: cwdParam,
  input,
  output,
  recursive,
}: CliArgs): Promise<Promise<void>[]> {
  const cwd = cwdParam ?? process.cwd()
  const inputParam = input
  input &&= resolve(cwd, input)
  output &&= resolve(cwd, output)

  if (!input) {
    logger.info(
      `No input was provided. Converting .po files based on git status.`
    )

    // TODO: Find a way to test this
    const { modified, not_added, staged } = await git(cwd).status()
    // TODO: Understand Set better
    const poFilesFromGit = [
      ...new Set(
        modified
          .concat(not_added, staged)
          .filter((file) => file.endsWith('.po'))
      ),
    ]

    if (!poFilesFromGit.length) {
      logger.warn('No .po files found in git status.')
      return []
    }

    return poFilesFromGit.map((poFile) => getConvertJobs(cwd, poFile))
  }

  if (!isValidInput(input)) {
    throw new Error(`${input} is not a .po file or directory.`)
  }

  if (await isInputFile(input)) {
    if (recursive) {
      logger.warn('Cannot use --recursive with a file input.')
    }
    return [getConvertJobs(cwd, input, output)]
  }

  if (await isInputDirectory(input)) {
    const poEntries = await getPoEntries(resolve(cwd, input), recursive)

    if (output?.endsWith('.mo')) {
      throw new Error('Input is a directory, but the output is a file.')
    }

    const convertJobs: Promise<void>[] = poEntries.map((poEntry) =>
      getConvertJobs(cwd, poEntry, output, recursive, inputParam)
    )
    return convertJobs
  }

  return []
}

export async function po2mo({ input, config, cwd, ...args }: CliArgs) {
  const convertPromises: Promise<void>[] = []

  if (config) {
    const configPath = resolve(
      config,
      !config.endsWith('po2mo.json') ? 'po2mo.json' : ''
    )

    const { tasks }: Po2MoConfig = await import(configPath)
    // TODO: Refactor
    convertPromises.push(
      ...(
        await Promise.all(
          tasks.map((task) =>
            getConvertPromises({
              input: task.input,
              output: task.output,
              recursive: task.recursive ?? false,
              cwd,
            })
          )
        )
      ).flat()
    )
  } else {
    convertPromises.push(...(await getConvertPromises({ input, cwd, ...args })))
  }

  if (!convertPromises.length) {
    logger.warn(
      `No ${config ? 'config' : '.po file'} found in path: ${config ?? input}`
    )
    return
  }

  Promise.all(convertPromises)
}
