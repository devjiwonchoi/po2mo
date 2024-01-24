import { spawn } from 'child_process'
import { existsSync } from 'fs'
import { unlink } from 'fs/promises'
import { resolve, join } from 'path'

const fixturesDir = resolve(__dirname, 'fixtures')

const tests = [
  {
    name: 'basic',
    args: [`${fixturesDir}/basic`],
  },
  {
    name: 'output',
    args: [`${fixturesDir}/output`, '--output', `${fixturesDir}/output`],
  },
  {
    name: 'recursive',
    args: [`${fixturesDir}/recursive`, '--recursive'],
  },
]

describe('cli', () => {
  for (const test of tests) {
    const { name, args } = test

    it(`should handle ${name} args`, async () => {
      const cp = spawn(
        `${require.resolve('tsx/cli')}`,
        [resolve('./src/bin/index.ts')].concat(args)
      )
      const code = await new Promise((resolve) => {
        cp.on('close', resolve)
      })

      expect(code).toBe(0)
      expect(existsSync(join(fixturesDir, name, `${name}.mo`))).toBe(true)

      await unlink(join(fixturesDir, name, `${name}.mo`))
    })
  }
})
