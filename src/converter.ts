#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { mo, po } from 'gettext-parser'

interface Config {
  defaultOutputFilename: string
  files: ConversionTask[]
}

interface ConversionTask {
  input: string
  output: string
}

export function processPoFiles(configFilePath: string): void {
  const configFile =
    configFilePath ||
    path.resolve(path.dirname(require.main!.filename), 'po2mo.json')
  // Read the JSON configuration file
  const configData = fs.readFileSync(configFile, 'utf-8')
  const config: Config = JSON.parse(configData)

  const rootPath = path.dirname(configFile)

  // Process each task
  config.files.forEach((task) => {
    // Resolve the absolute input and output paths
    const absoluteInputPath = path.resolve(rootPath, task.input)
    const absoluteOutputPath = path.resolve(rootPath, task.output)

    // Check if the input is a directory
    if (
      fs.existsSync(absoluteInputPath) &&
      fs.statSync(absoluteInputPath).isDirectory()
    ) {
      // Read the directory
      const files = fs.readdirSync(absoluteInputPath)

      // Filter .po files
      const poFiles = files.filter((file) => file.endsWith('.po'))

      // Process each .po file
      poFiles.forEach((poFile) => {
        // Generate the corresponding .mo file path
        const moFilePath = path.join(
          absoluteOutputPath,
          poFile.replace('.po', '.mo')
        )
        convertPoToMo(path.join(absoluteInputPath, poFile), moFilePath)
      })
    } else {
      // Check if the input file exists
      if (fs.existsSync(absoluteInputPath)) {
        // Generate the corresponding .mo file path
        const moFilePath = path.resolve(absoluteOutputPath)
        convertPoToMo(absoluteInputPath, moFilePath)
      } else {
        console.log(`Input file not found: ${task.input}`)
      }
    }
  })
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

if (require.main === module) {
  const configFile = path.join(process.cwd(), 'po2mo.json')
  processPoFiles(configFile)
}
