import { readFile, readdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { mo, po } from 'gettext-parser'

type Po2MoConfig = {
  files: {
    input: string
    output: string
  }[]
}

async function getConfig(cwd: string) {
  try {
    const configFilePath = join(cwd, 'po2mo.json')
    const config: Po2MoConfig = JSON.parse(
      await readFile(configFilePath, 'utf-8')
    )
    return config
  } catch (error) {
    throw error
  }
}

async function parsePoToMo(input: string, output: string) {
  const poFile = await readFile(input, 'utf-8')
  const poData = po.parse(poFile)
  const moData = mo.compile(poData)
  await writeFile(output, moData)
}

async function getPoEntries(entry: string) {
  const dirents = await readdir(entry, { withFileTypes: true })
  const poEntries: string[] = []
  dirents.forEach((dirent) => {
    const direntPath = join(entry, dirent.name)
    if (dirent.isDirectory()) {
      getPoEntries(direntPath)
    }
    if (dirent.isFile() && dirent.name.endsWith('.po')) {
      poEntries.push(direntPath)
    }
  })
  return poEntries
}

export async function convert(cwd: string) {
  const config = await getConfig(cwd)

  const compileJobs = config.files.map(async ({ input, output }) => {
    const isWildcardEntry = input.endsWith('/*')
    if (isWildcardEntry) {
      // /**/* or /*
      const wildcardEntry = input.replace(/\/\*\*\/\*$|\/\*$/, '')
      const poEntries = await getPoEntries(wildcardEntry)
      return poEntries.map((poEntry) =>
        parsePoToMo(poEntry, poEntry.replace('.po', '.mo'))
      )
    }

    return parsePoToMo(input, output)
  })

  await Promise.all(compileJobs)
}
