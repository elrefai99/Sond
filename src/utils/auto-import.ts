import fs from 'fs'
import path from 'path'

export async function autoImportAll(): Promise<void> {
  const projectRoot = process.cwd()
  const foldersToScan = ['middlewares', 'utils'].map(folder =>
    path.join(projectRoot, 'src', folder)
  )
  let global: any
  // 1. Load local files
  for (const folder of foldersToScan) {
    if (!fs.existsSync(folder)) continue

    const files = fs.readdirSync(folder)

    for (const file of files) {
      const ext = path.extname(file)
      if (!['.ts', '.js'].includes(ext)) continue

      const baseName = path.basename(file, ext)
      const fullPath = path.join(folder, file)

      try {
        const mod = require(fullPath)
        const exported = mod.default ?? mod
        global[baseName] = exported
      } catch (err) {
        console.warn(`❌ Failed to import ${file}:`, err)
      }
    }
  }

  // 2. Load from package.json
  const pkgPath = path.join(projectRoot, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

  const dependencies = Object.keys(pkg.dependencies || {})

  for (const dep of dependencies) {
    try {
      const mod = require(dep)
      global[dep] = mod
    } catch (err: any) {
      console.warn(`⚠️ Failed to load package '${dep}':`, err.message)
    }
  }
}
