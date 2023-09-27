import fs from 'fs'
import path from 'path'
import { convert } from '../src/convert'

const fixturePath = path.resolve(__dirname, 'fixtures')

it('entry as directory', () => {
  const dirName = fixturePath + '/entry-as-directory'
  const localeDirs = ['ko', 'jp', 'fr']
  convert(dirName)

  localeDirs.forEach((dir) => {
    const dirPath = path.join(dirName, 'locale', dir)
    const dirents = fs.readdirSync(dirPath)
    expect(dirents).toContain(`${dir}.mo`)
    fs.unlinkSync(path.join(dirPath, `${dir}.mo`))
  })
})

it('entry as file', () => {
  const dirName = fixturePath + '/entry-as-file'
  const localeDirs = ['ko', 'jp', 'fr']
  convert(dirName)

  localeDirs.forEach((dir) => {
    const dirPath = path.join(dirName, 'locale', dir)
    const dirents = fs.readdirSync(dirPath)
    expect(dirents).toContain(`${dir}.mo`)
    fs.unlinkSync(path.join(dirPath, `${dir}.mo`))
  })
})
