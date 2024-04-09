import { exec, spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, rm, unlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve, join } from 'node:path'

export async function runTest({
  args,
  moPath,
  fixturesDir,
  tempDirTag,
}: {
  args: string[]
  tempDirTag?: string
  fixturesDir?: string
  moPath?: string | string[]
}) {
  let tempDir = ''

  if (fixturesDir && tempDirTag) {
    tempDir = join(tmpdir(), tempDirTag)
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
      const resolvedPath = join(tempDir, path)
      expect(existsSync(resolvedPath)).toBe(true)
      await unlink(resolvedPath)
    }
  }

  if (tempDir.length) {
    await rm(tempDir, { recursive: true, force: true })
  }

  return { stderr, stdout, code }
}
