import { runTest } from '../../test-utils'

describe('help', () => {
  it('should show helper', async () => {
    const { stdout } = await runTest({
      args: ['--help'],
    })

    expect(stdout).toMatch(/Usage: po2mo/)
  })

  it('should show helper with alias', async () => {
    const { stdout } = await runTest({
      args: ['-h'],
    })

    expect(stdout).toMatch(/Usage: po2mo/)
  })
})
