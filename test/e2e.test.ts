import fs from 'fs'
import path from 'path'
import po2mo from '../dist/index'

const E2EPath = path.resolve(__dirname, 'e2e')

it('locale', () => {
  po2mo(E2EPath)
  const locale = fs.readdirSync(path.join(E2EPath, 'locale'))

  locale.forEach((dir) => {
    const mo = path.join(E2EPath, 'locale', dir, `${dir}.mo`)
    expect(fs.existsSync(mo)).toBe(true)
    fs.unlinkSync(mo)
  })
})

it('locale2', () => {
  po2mo(E2EPath)
  const locale2 = fs.readdirSync(path.join(E2EPath, 'locale2'))

  locale2.forEach((dir) => {
    const mo = path.join(E2EPath, 'locale2', dir, `${dir}.mo`)
    expect(fs.existsSync(mo)).toBe(true)
    fs.unlinkSync(mo)
  })
})
