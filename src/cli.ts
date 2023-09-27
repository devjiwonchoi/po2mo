#!/usr/bin/env node
import { convert } from './convert'
import { formatDuration } from './utils'

export function cli() {
  const cwd = process.cwd()
  let start = Date.now()
  let end: number
  try {
    convert(cwd)
    end = Date.now()
  } catch (error) {
    if (error instanceof Error) {
      console.error(`${error.message}`)
    }
    return
  }

  const duration = end - start

  console.log(`✨ Finished in ${formatDuration(duration)}`)
}

cli()
