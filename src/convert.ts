import { existsSync, mkdirSync } from 'fs'
import { readFile, readdir, writeFile } from 'fs/promises'
import { dirname, join, resolve } from 'path'
import { po, mo } from 'gettext-parser'
import { simpleGit } from 'simple-git'
import { validatePath } from './utils'
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

async function getPoEntries({
  entry,
  recursive,
}: {
  entry: string
  recursive: boolean
}) {
  const poEntries: string[] = []
  const dirents = await readdir(entry, { withFileTypes: true })

  for (const dirent of dirents) {
    const direntPath = join(dirent.path, dirent.name)

    if (dirent.isDirectory()) {
      if (!recursive) continue

      const recursiveEntries = await getPoEntries({
        entry: direntPath,
        recursive: true,
      })
      poEntries.push(...recursiveEntries)
    }

    if (dirent.isFile() && dirent.name.endsWith('.po')) {
      poEntries.push(direntPath)
    }
  }

  return poEntries
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
  const resolvedInput = resolve(cwd, input)
  if (output) {
    if (output.endsWith('.mo')) {
      return convertPoToMo({ input: resolvedInput, output })
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

    return convertPoToMo({ input: resolvedInput, output: resolvedOutput })
  }

  return convertPoToMo({
    input: resolvedInput,
    output: resolvedInput.replace('.po', '.mo'),
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
    // TODO: Understand Set better
    const poEntriesFromGit = [
      ...new Set(
        modified
          .concat(not_added, staged)
          .filter((file) => file.endsWith('.po'))
      ),
    ]

    if (!poEntriesFromGit.length) {
      const err = new Error(
        `No created, modified, or staged .po files found in the local Git repository at ${cwd}.`
      )
      err.name = 'NOT_EXISTED'
      return Promise.reject(err)
    }

    return poEntriesFromGit.map((poEntry) =>
      getConvertJobs({ cwd, input: poEntry, output, recursive })
    )
  }

  const { isDirectory, isFile } = await validatePath(input)

  if (isFile) {
    if (recursive) {
      console.warn('Cannot use --recursive with a file input.')
    }
    return [getConvertJobs({ cwd, input, output, recursive })]
  }

  if (isDirectory) {
    const poEntries = await getPoEntries({
      entry: resolve(cwd, input),
      recursive,
    })

    if (output?.endsWith('.mo')) {
      throw new Error('Input is a directory, but the output is a file.')
    }

    const convertJobs: Promise<void>[] = poEntries.map((poEntry) =>
      getConvertJobs({ cwd, input: poEntry, output, recursive })
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
    err.name = 'NOT_EXISTED'
    return Promise.reject(err)
  }

  return Promise.all(convertPromises)
}
