import { spawn } from 'child_process'
import { existsSync } from 'fs'
import { rm, mkdtemp } from 'fs/promises'
import { tmpdir } from 'os'
import { resolve, join } from 'path'

const fixturesDir = resolve(__dirname, 'fixtures')

async function createTempDir(): Promise<string> {
  const tempDir = tmpdir()
  const tempDirPrefix = 'po2mo-test'
  const tempDirPath = join(tempDir, tempDirPrefix)

  return await mkdtemp(tempDirPath)
}

async function removeTempDir(tempDirPath: string) {
  await rm(tempDirPath, { recursive: true, force: true })
}

const tests = [
  {
    name: 'basic',
    args: [`./${fixturesDir}/basic/basic.po`],
  },
]

describe('cli', () => {
  for (const test of tests) {
    const { name, args } = test
    it(`${name} should convert po to mo properly`, async () => {
      const tempDir = await createTempDir()
      const { stdout, stderr } = await spawn(
        require.resolve('tsx/cli'),
        [resolve('../src/bin/index.ts')].concat(args)
      )

      if (stdout) console.log(stdout)
      if (stderr) console.error(stderr)

      expect(existsSync(join(tempDir, `${name}.mo`))).toBe(true)
      await removeTempDir(tempDir)
    })
  }
})
