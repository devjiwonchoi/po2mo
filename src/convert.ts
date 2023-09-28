import fs from 'fs'
import path from 'path'
import { mo, po } from 'gettext-parser'

function getConfig(cwd: string) {
  const configFilePath = path.join(cwd, 'po2mo.json')
  if (!fs.existsSync(configFilePath)) {
    throw new Error(`po2mo.json file not found on path: ${cwd}`)
  }
  return JSON.parse(fs.readFileSync(configFilePath, 'utf-8'))
}

function parsePoToMo(input: string, output: string) {
  const poFile = fs.readFileSync(input, 'utf-8')
  const poData = po.parse(poFile)
  const moData = mo.compile(poData)
  fs.writeFileSync(output, moData)
}

export function convert(cwd: string) {
  const config = getConfig(cwd)

  config.files.forEach(
    ({ input, output }: { input: string; output: string }) => {
      const entry = path.join(cwd, input)
      const isRecursiveWildcardEntry = entry.endsWith('/**/*')
      const isWildcardEntry = entry.endsWith('/*') && !isRecursiveWildcardEntry

      if (!entry.includes('*')) {
        parsePoToMo(entry, path.join(cwd, output))
        return
      }

      if (isWildcardEntry) {
        const entryPath = entry.replace('/*', '')
        const dirents = fs.readdirSync(entryPath, { withFileTypes: true })

        const poFilePaths = dirents
          .filter((dirent) => dirent.isFile() && dirent.name.endsWith('.po'))
          .map((poFile) => path.join(entryPath, poFile.name))

        poFilePaths.forEach((poFilePath) => {
          const moFilePath = poFilePath.replace('.po', '.mo')
          parsePoToMo(poFilePath, moFilePath)
        })
      }

      if (isRecursiveWildcardEntry) {
        const entryPath = entry.replace('/**/*', '')
        const poFilePaths: string[] = []

        const recursiveReadDir = (dir: string) => {
          const dirents = fs.readdirSync(dir, { withFileTypes: true })

          dirents.forEach((dirent) => {
            const direntPath = path.join(dir, dirent.name)
            if (dirent.isFile() && dirent.name.endsWith('.po')) {
              poFilePaths.push(direntPath)
            } else if (dirent.isDirectory()) {
              recursiveReadDir(direntPath)
            }
          })
        }

        recursiveReadDir(entryPath)

        poFilePaths.forEach((poFilePath) => {
          const moFilePath = poFilePath.replace('.po', '.mo')
          parsePoToMo(poFilePath, moFilePath)
        })
      }
    }
  )
}
