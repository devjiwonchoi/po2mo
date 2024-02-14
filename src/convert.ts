import { existsSync, mkdirSync } from 'fs'
import { readFile, readdir, writeFile } from 'fs/promises'
import { dirname, join, resolve } from 'path'
import { po, mo } from 'gettext-parser'
import { simpleGit } from 'simple-git'
import { logger, validatePath } from './utils'
import type { CliArgs, Po2MoConfig, ResolvedArgs } from './types'

async function convertPoToMo({
  input,
  output,
}: {
  input: string
  output: string
}): Promise<void> {
  const poFile = await readFile(input, 'utf-8')
  const poData = po.parse(poFile)
  const moData = mo.compile(poData)
  await writeFile(output, moData)
}

async function getPoFiles({
  input,
  recursive,
}: {
  input: string
  recursive: boolean
}) {
  const poFiles: string[] = []
  const dirents = await readdir(input, { withFileTypes: true })

  for (const dirent of dirents) {
    const direntPath = join(dirent.path, dirent.name)

    if (dirent.isDirectory()) {
      if (!recursive) continue

      const recursiveFiles = await getPoFiles({
        input: direntPath,
        recursive: true,
      })
      poFiles.push(...recursiveFiles)
    }

    if (dirent.isFile() && dirent.name.endsWith('.po')) {
      poFiles.push(direntPath)
    }
  }

  return poFiles
}

function getConvertJobs({
  cwd,
  input,
  output,
  recursive,
}: {
  cwd: string
  input: string
  output: string | null
  recursive: boolean
}) {
  if (output) {
    if (output.endsWith('.mo')) {
      return convertPoToMo({ input, output })
    }

    const poFilename = input.split('/').pop()!
    const moFilename = poFilename.replace('.po', '.mo')

    const resolvedOutput = join(
      output,
      // Preserve input directory structure if recursive
      recursive ? dirname(input.replace(cwd, '')) : '',
      moFilename
    )

    const resolvedOutputDir = dirname(resolvedOutput)
    if (!existsSync(resolvedOutputDir)) {
      mkdirSync(resolvedOutputDir, { recursive: true })
    }

    return convertPoToMo({ input, output: resolvedOutput })
  }

  return convertPoToMo({
    input,
    output: input.replace('.po', '.mo'),
  })
}

async function getConvertPromises({
  cwd,
  input,
  output,
  recursive,
}: ResolvedArgs): Promise<Promise<void>[]> {
  if (!input) {
    // TODO: Find a way to test this
    const { modified, not_added, staged } = await simpleGit(cwd).status()

    const poFilesFromGit = Array.from(
      new Set(
        modified
          .concat(not_added, staged)
          .filter((file) => file.endsWith('.po'))
      )
    )

    if (!poFilesFromGit.length) {
      const err = new Error(
        `No created, modified, or staged .po files found in the local Git repository at (${cwd}).`
      )
      err.name = 'MISSING_PO'
      return Promise.reject(err)
    }

    return poFilesFromGit.map((poFile) =>
      getConvertJobs({ cwd, input: poFile, output, recursive })
    )
  }

  const { isDirectory, isFile } = await validatePath(input)

  if (isFile) {
    if (recursive) {
      logger.warn('Cannot use --recursive with a file input.')
    }
    return [getConvertJobs({ cwd, input, output, recursive })]
  }

  if (isDirectory) {
    const poFiles = await getPoFiles({
      input,
      recursive,
    })

    if (output?.endsWith('.mo')) {
      throw new Error('Input is a directory, but the output is a file.')
    }

    const convertJobs: Promise<void>[] = poFiles.map((poFile) =>
      getConvertJobs({ cwd, input: poFile, output, recursive })
    )
    return convertJobs
  }

  return []
}

function resolveArgs(args: CliArgs): ResolvedArgs {
  const cwd = args.cwd ? resolve(args.cwd) : process.cwd()
  const input = args.input ? resolve(cwd, args.input) : null
  const output = args.output ? resolve(cwd, args.output) : null
  const recursive = Boolean(args.recursive)

  return { cwd, input, output, recursive }
}

export async function po2mo({ config, ...args }: CliArgs) {
  const convertPromises: Promise<Promise<void>[]>[] = []

  if (config) {
    const configPath = resolve(
      config,
      !config.endsWith('po2mo.json') ? 'po2mo.json' : ''
    )

    const { tasks }: Po2MoConfig = await import(configPath)

    const convertPromisesArray = tasks.map((task) => {
      const resolvedArgs = resolveArgs({
        cwd: args.cwd,
        ...task,
      })

      return getConvertPromises(resolvedArgs)
    })

    convertPromises.push(...convertPromisesArray)
  } else {
    const resolvedArgs = resolveArgs(args)
    convertPromises.push(getConvertPromises(resolvedArgs))
  }

  if (!convertPromises.length) {
    const err = new Error('Could not find any tasks.')
    err.name = 'MISSING_PO'
    return Promise.reject(err)
  }

  return Promise.all(convertPromises)
}
