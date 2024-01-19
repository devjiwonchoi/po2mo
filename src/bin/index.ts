#!/usr/bin/env node
import path from 'path'
import arg from 'arg'
import { convert } from '../convert'
import { exit, logger, paint } from '../utils'
import { version } from '../../package.json'

type CliArgs = {
  source?: string
  config?: string
  cwd?: string
  output?: string
  help?: boolean
  recursive?: boolean
  version?: boolean
}

const helpMessage = `
Usage: po2mo [options]

Options:
  -v, --version          output the version number
  -h, --help             output usage information
  -o, --output <path>    specify output path
  -r, --recursive        convert po files recursively
  --config <path>        specify config file path
  --cwd <cwd>            specify current working directory
`

function help() {
  logger.log(helpMessage)
}

function parseCliArgs(argv: string[]) {
  const args = arg(
    {
      '--config': String,
      '--cwd': String,
      '--output': String,
      '--help': Boolean,
      '--recursive': Boolean,
      '--version': Boolean,

      '-o': '--output',
      '-r': '--recursive',
      '-v': '--version',
    },
    {
      // When `permissive` set to true, add unknown args to `result._` array
      // instead of throwing an error about an unknown flag.
      permissive: true,
      argv,
    }
  )
  const source: string | undefined = args._[0]
  const parsedArgs: CliArgs = {
    source,
    config: args['--config'],
    cwd: args['--cwd'],
    output: args['--output'],
    help: !!args['--help'],
    recursive: !!args['--recursive'],
    version: !!args['--version'],
  }
  return parsedArgs
}

async function run(args: CliArgs): Promise<void> {
  if (args.version) {
    logger.log(version)
    return
  }
  if (args.help) {
    help()
    return
  }

  const cwd = args.cwd ?? process.cwd()
  const entry = args.source ? path.resolve(cwd, args.source) : null
  let start = Date.now()
  let end: number
  try {
    // await convert(entry)
    end = Date.now()
  } catch (err: any) {
    if (err.name === 'NOT_EXISTED') {
      help()
      exit(err)
      return
    }
    throw err
  }

  logger.log()
  paint('✓', 'green', `po2mo ${version} converted in ${(end - start) / 1000}s`)
}

async function main() {
  let params, error
  try {
    params = parseCliArgs(process.argv.slice(2))
  } catch (err) {
    error = err
  }
  if (error || !params) {
    if (!error) help()
    return exit(error as Error)
  }
  await run(params)
}

main().catch(exit)
