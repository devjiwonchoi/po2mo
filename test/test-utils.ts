import { spawn } from 'child_process'
import { existsSync } from 'fs'
import { unlink } from 'fs/promises'
import { resolve } from 'path'

export async function runTest({
  args,
  fixturesDir,
}: {
  args: string[]
  fixturesDir?: string
}) {
  if (fixturesDir) {
    args.push('--cwd', fixturesDir)
  }

  const cp = spawn(
    `${require.resolve('tsx/cli')}`,
    [resolve('./src/bin/index.ts')].concat(args)
  )

  let stderr = ''
  let stdout = ''
  const code = await new Promise((resolve) => {
    cp.stdout.on('data', (chunk) => (stdout += chunk.toString()))
    cp.stderr.on('data', (chunk) => (stderr += chunk.toString()))
    cp.on('close', resolve)
  })

  return { stderr, stdout, code }
}
