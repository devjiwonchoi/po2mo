import { execSync } from 'child_process'
import { mkdirSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { runTest } from '../../test-utils'

const fixturesDir = join(__dirname, 'fixtures')
const tempDir = join(tmpdir(), 'base')

beforeAll(() => {
  mkdirSync(tempDir, { recursive: true })
  execSync(`cp -r ${fixturesDir}/* ${tempDir}`)
})

afterAll(() => {
  rmSync(tempDir, { recursive: true, force: true })
})

describe('base', () => {
  it('should convert input as file', async () => {
    await runTest({
      args: ['./input.po'],
      tempDir,
      moPath: join(tempDir, 'input.mo'),
    })
  })

  it('should warn when attempt to convert input as file with recursive', async () => {
    const { stderr } = await runTest({
      args: ['./input.po', '-r'],
      tempDir,
      moPath: join(tempDir, 'input.mo'),
    })

    expect(stderr).toMatch(/Cannot use --recursive with a file input./)
  })

  it('should convert input as file with output as file', async () => {
    await runTest({
      args: ['./input.po', '-o', './output.mo'],
      tempDir,
      moPath: join(tempDir, 'output.mo'),
    })
  })

  it('should convert input as file with output as directory', async () => {
    await runTest({
      args: ['./input.po', '-o', './output'],
      tempDir,
      moPath: join(tempDir, 'output', 'input.mo'),
    })
  })

  it('should convert input as directory', async () => {
    await runTest({
      args: ['.'],
      tempDir,
      moPath: join(tempDir, 'input.mo'),
    })
  })

  it('should convert input as directory with recursive', async () => {
    await runTest({
      args: ['.', '-r'],
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
      args: ['.', '-o', './output.mo'],
      tempDir,
    })

    expect(stderr).toMatch(/Input is a directory, but the output is a file./)
  })

  it('should convert input as directory with output as directory', async () => {
    await runTest({
      args: ['.', '-o', './output'],
      tempDir,
      moPath: join(tempDir, 'output', 'input.mo'),
    })
  })

  it('should convert input as directory with output as directory with recursive', async () => {
    await runTest({
      args: ['.', '-o', './output', '-r'],
      tempDir,
      moPath: [
        join(tempDir, 'output', 'recursive', 'recursive.mo'),
        join(tempDir, 'output', 'input.mo'),
      ],
    })
  })
})
