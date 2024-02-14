import { exec, spawn } from 'child_process'
import { existsSync } from 'fs'
import { mkdir, rm, unlink } from 'fs/promises'
import { tmpdir } from 'os'
import { resolve, join } from 'path'

export const tempDir = join(tmpdir(), `${Math.random()}`, 'po2mo')

export async function runTest({
  args,
  moPath,
  fixturesDir,
}: {
  args: string[]
  fixturesDir?: string
  moPath?: string | string[]
}) {
  if (fixturesDir) {
    args.push('--cwd', tempDir)

    await mkdir(tempDir, { recursive: true })
    await exec(`cp -r ${fixturesDir}/* ${tempDir}`)
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
    for (const path of moPath) {
      expect(existsSync(path)).toBe(true)
      await unlink(path)
    }
  }

  await rm(tempDir, { recursive: true, force: true })
  return { stderr, stdout, code }
}
