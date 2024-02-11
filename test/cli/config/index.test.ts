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
})
