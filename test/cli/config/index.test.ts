import { join, resolve } from 'path'
import { runTest } from '../../test-utils'

const fixturesDir = resolve(__dirname, '../fixtures')

describe('config', () => {
  it('should convert input as file', async () => {
    await runTest({
      args: ['--config', resolve(__dirname, 'fixtures', 'input-as-file')],
      fixturesDir,
      moPath: join(fixturesDir, 'basic', 'input.mo'),
    })
  })

  it('should convert input as file with output as file', async () => {
    await runTest({
      args: [
        '--config',
        resolve(__dirname, 'fixtures', 'input-as-file', 'output-as-file'),
      ],
      fixturesDir,
      moPath: join(fixturesDir, 'basic', 'output.mo'),
    })
  })

  it('should convert input as file with output as directory', async () => {
    await runTest({
      args: [
        '--config',
        resolve(__dirname, 'fixtures', 'input-as-file', 'output-as-dir'),
      ],
      fixturesDir,
      moPath: join(fixturesDir, 'basic', 'output', 'input.mo'),
    })
  })

  it('should warn when attempt to convert input as file with recursive', async () => {
    const { stderr } = await runTest({
      args: [
        '--config',
        resolve(__dirname, 'fixtures', 'input-as-file', 'recursive'),
      ],
      fixturesDir,
    })

    expect(stderr).toMatch(/Cannot use --recursive with a file input./)
  })

  it('should convert input as directory', async () => {
    await runTest({
      args: ['--config', resolve(__dirname, 'fixtures', 'input-as-dir')],
      fixturesDir,
      moPath: join(fixturesDir, 'basic', 'input.mo'),
    })
  })

  it('should throw when attempt to convert input as directory with output as file', async () => {
    const { stderr } = await runTest({
      args: [
        '--config',
        resolve(__dirname, 'fixtures', 'input-as-dir', 'output-as-file'),
      ],
      fixturesDir,
    })

    expect(stderr).toMatch(/Input is a directory, but the output is a file./)
  })

  it('should convert input as directory with output as directory', async () => {
    await runTest({
      args: [
        '--config',
        resolve(__dirname, 'fixtures', 'input-as-dir', 'output-as-dir'),
      ],
      fixturesDir,
      moPath: join(fixturesDir, 'basic', 'output', 'input.mo'),
    })
  })

  it('should convert input as directory with recursive', async () => {
    await runTest({
      args: [
        '--config',
        resolve(__dirname, 'fixtures', 'input-as-dir', 'recursive'),
      ],
      fixturesDir,
      moPath: join(fixturesDir, 'basic', 'input.mo'),
    })
  })
})
