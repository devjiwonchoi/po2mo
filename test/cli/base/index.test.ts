import { join } from 'path'
import { runTest, tempDir } from '../../test-utils'

const fixturesDir = join(__dirname, 'fixtures')

describe('base', () => {
  it('should convert input as file', async () => {
    await runTest({
      args: ['./input.po'],
      fixturesDir,
      moPath: join(tempDir, 'input.mo'),
    })
  })

  it('should warn when attempt to convert input as file with recursive', async () => {
    const { stderr } = await runTest({
      args: ['./input.po', '-r'],
      fixturesDir,
      moPath: join(tempDir, 'input.mo'),
    })

    expect(stderr).toMatch(/Cannot use --recursive with a file input./)
  })

  it('should convert input as file with output as file', async () => {
    await runTest({
      args: ['./input.po', '-o', './output.mo'],
      fixturesDir,
      moPath: join(tempDir, 'output.mo'),
    })
  })

  it('should convert input as file with output as directory', async () => {
    await runTest({
      args: ['./input.po', '-o', './output'],
      fixturesDir,
      moPath: join(tempDir, 'output', 'input.mo'),
    })
  })

  it('should convert input as directory', async () => {
    await runTest({
      args: ['.'],
      fixturesDir,
      moPath: join(tempDir, 'input.mo'),
    })
  })

  it('should convert input as directory with recursive', async () => {
    await runTest({
      args: ['.', '-r'],
      fixturesDir,
      moPath: [
        join(tempDir, 'recursive', 'recursive.mo'),
        join(tempDir, 'input.mo'),
      ],
    })
  })

  it('should throw when attempt to convert input as directory with output as file', async () => {
    const { stderr } = await runTest({
      args: ['.', '-o', './output.mo'],
      fixturesDir,
    })

    expect(stderr).toMatch(/Input is a directory, but the output is a file./)
  })

  it('should convert input as directory with output as directory', async () => {
    await runTest({
      args: ['.', '-o', './output'],
      fixturesDir,
      moPath: join(tempDir, 'output', 'input.mo'),
    })
  })

  it('should convert input as directory with output as directory with recursive', async () => {
    await runTest({
      args: ['.', '-o', './output', '-r'],
      fixturesDir,
      moPath: [
        join(tempDir, 'output', 'recursive', 'recursive.mo'),
        join(tempDir, 'output', 'input.mo'),
      ],
    })
  })
})
