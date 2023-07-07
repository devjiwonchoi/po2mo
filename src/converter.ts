import fs from 'fs'
import path from 'path'
import { mo, po } from 'gettext-parser'

interface Config {
  files: ConversionTask[]
}

interface ConversionTask {
  input: string
  output: string
}

function convertPoToMo(poFilePath: string, moFilePath: string): void {
  // Resolve the absolute file paths
  const absolutePoFilePath = path.resolve(poFilePath)
  const absoluteMoFilePath = path.resolve(moFilePath)

  // Read the .po file
  const poFileContent = fs.readFileSync(absolutePoFilePath, 'utf-8')

  // Parse the .po file content
  const poData = po.parse(poFileContent)

  // Convert to .mo format
  const moData = mo.compile(poData)

  // Write the .mo data to the .mo file
  fs.writeFileSync(absoluteMoFilePath, moData)
}

// Read the JSON configuration file
const configFile = './po2mo.json'
const configData = fs.readFileSync(configFile, 'utf-8')
const config: Config = JSON.parse(configData)

// Process each task
config.files.forEach((task) => {
  // Resolve the absolute input and output paths
  const absoluteInputPath = path.resolve(task.input)
  const absoluteOutputPath = path.resolve(task.output)

  // Check if the input is a directory or contains a wildcard pattern
  if (
    fs.statSync(absoluteInputPath).isDirectory() ||
    absoluteInputPath.includes('*')
  ) {
    // Read the directory
    const files = fs.readdirSync(absoluteInputPath)

    // Filter .po files
    const poFiles = files.filter((file) => file.endsWith('.po'))

    // Process each .po file
    poFiles.forEach((poFile) => {
      // Generate the corresponding .mo file path
      const outputFileName = poFile.replace('.po', '.mo')
      const outputFilePath = path.join(absoluteOutputPath, outputFileName)
      convertPoToMo(path.join(absoluteInputPath, poFile), outputFilePath)
    })
  } else {
    // Generate the corresponding .mo file path
    const outputFilePath = absoluteOutputPath
    convertPoToMo(absoluteInputPath, outputFilePath)
  }
})
