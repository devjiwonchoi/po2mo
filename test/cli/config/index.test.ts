import { execSync } from 'child_process'
import { mkdirSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join, resolve } from 'path'
import { runTest } from '../../test-utils'

const fixturesDir = resolve(__dirname, '../base/fixtures')
const tempDir = join(tmpdir(), 'config')

beforeAll(() => {
  mkdirSync(tempDir, { recursive: true })
  execSync(`cp -r ${fixturesDir}/* ${tempDir}`)
})

afterAll(() => {
  rmSync(tempDir, { recursive: true, force: true })
})

describe('config', () => {
  it('should convert input as file', async () => {
    await runTest({
      args: ['--config', resolve(__dirname, 'fixtures', 'input-as-file')],
      tempDir,
      moPath: join(tempDir, 'input.mo'),
    })
  })

  it('should warn when attempt to convert input as file with recursive', async () => {
    const { stderr } = await runTest({
      args: [
        '--config',
        resolve(__dirname, 'fixtures', 'input-as-file', 'recursive'),
      ],
      tempDir,
      moPath: join(tempDir, 'input.mo'),
    })

    expect(stderr).toMatch(/Cannot use --recursive with a file input./)
  })

  it('should convert input as file with output as file', async () => {
    await runTest({
      args: [
        '--config',
        resolve(__dirname, 'fixtures', 'input-as-file', 'output-as-file'),
      ],
      tempDir,
      moPath: join(tempDir, 'output.mo'),
    })
  })

  it('should convert input as file with output as directory', async () => {
    await runTest({
      args: [
        '--config',
        resolve(__dirname, 'fixtures', 'input-as-file', 'output-as-dir'),
      ],
      tempDir,
      moPath: join(tempDir, 'output', 'input.mo'),
    })
  })

  it('should convert input as directory', async () => {
    await runTest({
      args: ['--config', resolve(__dirname, 'fixtures', 'input-as-dir')],
      tempDir,
      moPath: join(tempDir, 'input.mo'),
    })
  })

  it('should convert input as directory with recursive', async () => {
    await runTest({
      args: [
        '--config',
        resolve(__dirname, 'fixtures', 'input-as-dir', 'recursive'),
      ],
      tempDir,
      // TODO: Refactor
      moPath: [
        join(tempDir, 'recursive', 'recursive.mo'),
        join(tempDir, 'input.mo'),
      ],
    })
  })

  it('should throw when attempt to convert input as directory with output as file', async () => {
    const { stderr } = await runTest({
      args: [
        '--config',
        resolve(__dirname, 'fixtures', 'input-as-dir', 'output-as-file'),
      ],
      tempDir,
    })

    expect(stderr).toMatch(/Input is a directory, but the output is a file./)
  })

  it('should convert input as directory with output as directory', async () => {
    await runTest({
      args: [
        '--config',
        resolve(__dirname, 'fixtures', 'input-as-dir', 'output-as-dir'),
      ],
      tempDir,
      moPath: join(tempDir, 'output', 'input.mo'),
    })
  })

  it('should convert input as directory with output as directory with recursive', async () => {
    await runTest({
      args: [
        '--config',
        resolve(
          __dirname,
          'fixtures',
          'input-as-dir',
          'output-as-dir',
          'recursive'
        ),
      ],
      tempDir,
      moPath: [
        join(tempDir, 'output', 'recursive', 'recursive.mo'),
        join(tempDir, 'output', 'input.mo'),
      ],
    })
  })
})
