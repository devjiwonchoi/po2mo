import { runTest } from '../../test-utils'
import { version } from '../../../package.json'

describe('version', () => {
  it('should show correct version', async () => {
    const { stdout } = await runTest({
      args: ['--version'],
    })

    expect(stdout).toBe(`${version}\n`)
  })

  it('should show correct version with alias', async () => {
    const { stdout } = await runTest({
      args: ['-v'],
    })

    expect(stdout).toBe(`${version}\n`)
  })
})
