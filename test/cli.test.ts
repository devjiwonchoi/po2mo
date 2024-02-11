import { spawn } from 'child_process'
import { existsSync } from 'fs'
import { unlink } from 'fs/promises'
import { resolve, join } from 'path'
import { version } from '../package.json'

const fixturesDir = resolve(__dirname, 'fixtures')

async function handleTest(args: string[], moPath: string) {
  const cp = spawn(
    `${require.resolve('tsx/cli')}`,
    [resolve('./src/bin/index.ts'), '--cwd', fixturesDir].concat(args)
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

  // expect(code).toBe(0)
  expect(existsSync(moPath)).toBe(true)

  await unlink(moPath)
}

describe('cli', () => {
  it('should show correct version', async () => {
    const cp = spawn(`${require.resolve('tsx/cli')}`, [
      resolve('./src/bin/index.ts'),
      '--version',
    ])
    const output = await new Promise((resolve) => {
      let output = ''
      cp.stdout.on('data', (data) => {
        output += data
      })
      cp.on('close', () => {
        resolve(output)
      })
    })

    expect(output).toBe(`${version}\n`)
  })

  it('should show help', async () => {
    const cp = spawn(`${require.resolve('tsx/cli')}`, [
      resolve('./src/bin/index.ts'),
      '--help',
    ])
    const output = await new Promise((resolve) => {
      let output = ''
      cp.stdout.on('data', (data) => {
        output += data
      })
      cp.on('close', () => {
        resolve(output)
      })
    })

    expect(output).toMatch(/Usage: po2mo/)
  })

  it('should look for locale dir if no input is provided', async () => {
    const moPath = join(fixturesDir, 'locale', 'locale.mo')
    await handleTest([], moPath)
  })

  it('should convert based on config', async () => {
    const moPath = join(fixturesDir, 'config', 'config.mo')
    await handleTest(['--config', join(fixturesDir, 'config')], moPath)
  })

  it('should convert if input is a file', async () => {
    const moPath = join(fixturesDir, 'input', 'input.mo')
    await handleTest([join(fixturesDir, 'input', 'input.po')], moPath)
  })

  it('should convert if input is a file with output as a file', async () => {
    const moPath = join(fixturesDir, 'input', 'output.mo')
    await handleTest(
      [join(fixturesDir, 'input', 'input.po'), '-o', moPath],
      moPath
    )
  })

  it('should convert if input is a file with output as a directory', async () => {
    const moPath = join(fixturesDir, 'input', 'output', 'input.mo')
    await handleTest(
      [
        join(fixturesDir, 'input', 'input.po'),
        '-o',
        join(fixturesDir, 'input', 'output'),
      ],
      moPath
    )
  })

  it('should convert if input is a directory', async () => {
    const moPath = join(fixturesDir, 'input', 'input.mo')
    await handleTest([join(fixturesDir, 'input')], moPath)
  })

  it('should convert if input is a directory with recursive', async () => {
    const moPath = join(fixturesDir, 'input', 'recursive', 'recursive.mo')
    await handleTest([join(fixturesDir, 'input'), '-r'], moPath)
  })
})
