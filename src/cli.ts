#!/usr/bin/env node
import { convert } from './convert'
import { formatDuration } from './utils'

export function cli() {
  let timeStart = Date.now()
  let timeEnd
  try {
    convert()
    timeEnd = Date.now()
  } catch (error) {
    if (error instanceof Error) {
      console.error(`${error.message}`)
    }
    return
  }

  const duration = timeEnd - timeStart

  console.log(`✨ Finished in ${formatDuration(duration)}`)
}

cli()
