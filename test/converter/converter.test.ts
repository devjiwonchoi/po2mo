import { processPoFiles } from '../../src/converter'
import fs from 'fs'
import path from 'path'

describe('PO to MO Conversion', () => {
  const testConfigPath = path.resolve(__dirname, 'po2mo.json')
  const testOutputDir = path.resolve(__dirname, 'Locale')

  beforeAll(() => {
    // Create the test output directory if it doesn't exist
    if (!fs.existsSync(testOutputDir)) {
      fs.mkdirSync(testOutputDir)
    }
  })

  afterEach(() => {
    // Clear the output directory after each test
    fs.readdirSync(testOutputDir).forEach((file) => {
      if (file !== 'test.po') {
        fs.unlinkSync(`${testOutputDir}/${file}`)
      }
    })
  })

  it('should convert PO files to MO format', () => {
    processPoFiles(testConfigPath)

    // Assert the conversion results
    const convertedFiles = fs.readdirSync(testOutputDir)
    expect(convertedFiles).toContain('test.mo')
  })
})
