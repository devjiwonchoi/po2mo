import { spawn } from 'child_process'
import { existsSync } from 'fs'
import { unlink } from 'fs/promises'
import { resolve } from 'path'

export async function runTest({
  args,
  fixturesDir,
  moPath,
}: {
  args: string[]
  fixturesDir?: string
  moPath?: string
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
  if (stdout) console.log(stdout)
  if (stderr) console.error(stderr)

  if (moPath) {
    expect(existsSync(moPath)).toBe(true)
    await unlink(moPath)
  }

  expect(code).toBe(0)
  return { stderr, stdout, code }
}
