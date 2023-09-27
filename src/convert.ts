import fs from 'fs'
import path from 'path'
import grdp from 'grdp'
import { mo, po } from 'gettext-parser'

function getConfig(rootDir: string) {
  const configFilePath = path.join(rootDir, 'po2mo.json')
  if (!fs.existsSync(configFilePath)) {
    throw new Error(`po2mo.json file not found on path: ${rootDir}`)
  }
  return JSON.parse(fs.readFileSync(configFilePath, 'utf-8'))
}

function parsePoToMo(input: string, output: string) {
  const poFile = fs.readFileSync(input, 'utf-8')
  const poData = po.parse(poFile)
  const moData = mo.compile(poData)
  fs.writeFileSync(output, moData)
}

export function convert(cwd?: string) {
  const rootDir = cwd ?? grdp()
  const config = getConfig(rootDir)

  config.files.forEach(
    ({ input, output }: { input: string; output: string }) => {
      const entry = path.join(rootDir, input)
      const isFileEntry = input.endsWith('.po') && output.endsWith('.mo')

      if (isFileEntry) {
        parsePoToMo(entry, path.join(rootDir, output))
        return
      }

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
