#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import grdp from 'grdp'
import { mo, po } from 'gettext-parser'

const rootDir = grdp()

function getConfig(): {
  files: {
    input: string
    output: string
  }[]
} {
  const configFilePath = path.join(rootDir, 'po2mo.json')
  return JSON.parse(fs.readFileSync(configFilePath, 'utf-8'))
}

function convert() {
  const config = getConfig()

  config.files.forEach(
    ({ input, output }: { input: string; output: string }) => {
      const entry = path.join(rootDir, input)
      const dirents = fs.readdirSync(entry, { withFileTypes: true })

      const poFilePaths = dirents
        .filter((dirent) => dirent.isFile() && dirent.name.endsWith('.po'))
        .map((poFile) => path.join(entry, poFile.name))

      poFilePaths.forEach((poFilePath) => {
        const poFileContent = fs.readFileSync(poFilePath, 'utf-8')
        const poFileData = po.parse(poFileContent)
        const moFileData = mo.compile(poFileData)
        const moFilePath = poFilePath.replace('.po', '.mo')
        fs.writeFileSync(moFilePath, moFileData)
      })
    }
  )
}

convert()
