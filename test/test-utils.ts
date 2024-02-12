import { spawn } from 'child_process'
import { existsSync } from 'fs'
import { unlink } from 'fs/promises'
import { resolve } from 'path'

export async function runTest({
  args,
  tempDir,
  moPath,
}: {
  args: string[]
  tempDir?: string
  moPath?: string | string[]
}) {
  if (tempDir) {
    args.push('--cwd', tempDir)
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

  // TODO: Refactor
  if (moPath) {
    if (Array.isArray(moPath)) {
      for (const path of moPath) {
        expect(existsSync(path)).toBe(true)
        await unlink(path)
      }
    } else {
      expect(existsSync(moPath)).toBe(true)
      await unlink(moPath)
    }
  }

  return { stderr, stdout, code }
}
