import { runTest } from '../../test-utils'

const fixturesDir = __dirname + '/fixtures'
const tempDirTag = 'po2mo-base'

describe('base', () => {
  it('should convert input as file', async () => {
    await runTest({
      args: ['./input.po'],
      fixturesDir,
      tempDirTag,
      moPath: ['input.mo'],
    })
  })

  it('should warn when attempt to convert input as file with recursive', async () => {
    const { stderr } = await runTest({
      args: ['./input.po', '-r'],
      fixturesDir,
      tempDirTag,
      moPath: ['input.mo'],
    })

    expect(stderr).toMatch(/Cannot use --recursive with a file input./)
  })

  it('should convert input as file with output as file', async () => {
    await runTest({
      args: ['./input.po', '-o', './output.mo'],
      fixturesDir,
      tempDirTag,
      moPath: ['output.mo'],
    })
  })

  it('should convert input as file with output as directory', async () => {
    await runTest({
      args: ['./input.po', '-o', './output'],
      fixturesDir,
      tempDirTag,
      moPath: ['output/input.mo'],
    })
  })

  it('should convert input as directory', async () => {
    await runTest({
      args: ['.'],
      fixturesDir,
      tempDirTag,
      moPath: ['input.mo'],
    })
  })

  it('should convert input as directory with recursive', async () => {
    await runTest({
      args: ['.', '-r'],
      fixturesDir,
      tempDirTag,
      moPath: ['recursive/recursive.mo', 'input.mo'],
    })
  })

  it('should throw when attempt to convert input as directory with output as file', async () => {
    const { stderr } = await runTest({
      args: ['.', '-o', './output.mo'],
      fixturesDir,
      tempDirTag,
    })

    expect(stderr).toMatch(/Input is a directory, but the output is a file./)
  })

  it('should convert input as directory with output as directory', async () => {
    await runTest({
      args: ['.', '-o', './output'],
      fixturesDir,
      tempDirTag,
      moPath: ['output/input.mo'],
    })
  })

  it('should convert input as directory with output as directory with recursive', async () => {
    await runTest({
      args: ['.', '-o', './output', '-r'],
      fixturesDir,
      tempDirTag,
      moPath: ['output/recursive/recursive.mo', 'output/input.mo'],
    })
  })
})
