import { join, resolve } from 'path'
import { runTest } from '../../test-utils'

const fixturesDir = resolve(__dirname, '../fixtures')

// 1. input: file
// 2. input: file, recursive -> warn (deduped1)
// 3. input: file, output: file
// 4. input: file, output: file, recursive -> warn (deduped1)
// 5. input: file, output: directory
// 6. input: file, output: directory, recursive -> warn (deduped1)
// 7. input: directory
// 8. input: directory, recursive
// 9. input: directory, output: file -> throw (deduped2)
// 10. input: directory, output: file, recursive -> throw (deduped2)
// 11. input: directory, output: directory
// 12. input: directory, output: directory, recursive


describe('config', () => {
  it('should convert input as file', async () => {
    await runTest({
      args: ['--config', resolve(__dirname, 'fixtures', 'input-as-file')],
      fixturesDir,
      moPath: join(fixturesDir, 'basic', 'input.mo'),
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

  it('should convert input as directory', async () => {
    await runTest({
      args: ['--config', resolve(__dirname, 'fixtures', 'input-as-dir')],
      fixturesDir,
      moPath: join(fixturesDir, 'basic', 'input.mo'),
    })
  })

  it('should convert input as directory with recursive', async () => {
    await runTest({
      args: [
        '--config',
        resolve(__dirname, 'fixtures', 'input-as-dir', 'recursive'),
      ],
      fixturesDir,
      // TODO: Refactor
      moPath: [
        join(fixturesDir, 'basic', 'recursive', 'recursive.mo'),
        join(fixturesDir, 'basic', 'input.mo'),
      ],
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
      fixturesDir,
      moPath: [
        // TODO: Maybe when running getPoEntries recursive, need to preserve the folder structure.
        join(fixturesDir, 'basic', 'output', 'recursive', 'recursive.mo'),
        join(fixturesDir, 'basic', 'output', 'input.mo'),
      ],
    })
  })
})
