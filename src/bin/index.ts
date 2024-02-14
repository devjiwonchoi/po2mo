#!/usr/bin/env node
import arg from 'arg'
import { po2mo } from '../convert'
import { exit } from '../utils'
import { version } from '../../package.json'
import type { CliArgs } from '../types'

const helpMessage = `
Usage: po2mo [options]

Options:
  <input>                specify input path
  -v, --version          output the version number
  -h, --help             output usage information
  -o, --output <path>    specify output path
  -r, --recursive        convert po files recursively
  --config <path>        specify config file path
  --cwd <cwd>            specify current working directory

* If no input is provided, po2mo converts .po files found in the current working directory's git status (created, modified, staged).
`

function help() {
  console.log(helpMessage)
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

      '-v': '--version',
      '-h': '--help',
      '-o': '--output',
      '-r': '--recursive',
    },
    {
      // When `permissive` set to true, add unknown args to `result._` array
      // instead of throwing an error about an unknown flag.
      permissive: true,
      argv,
    }
  )
  const input: string | undefined = args._[0]
  const parsedArgs: CliArgs = {
    input,
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
  if (args.help) return help()
  if (args.version) return console.log(version)

  let start = Date.now()
  let end: number
  try {
    await po2mo(args)
    end = Date.now()
  } catch (err: any) {
    if (err.name === 'NOT_EXISTED') {
      return help(), exit(err)
    }
    throw err
  }

  console.log(`po2mo v${version} converted in ${(end - start) / 1000}s`)
}

async function main() {
  try {
    await run(parseCliArgs(process.argv.slice(2)))
  } catch (err) {
    return exit(err as Error)
  }
}

main().catch(exit)
