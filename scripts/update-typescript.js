import { readFile, writeFile } from 'node:fs/promises'
import pkg from '@sanity/tsdoc/package.json' with { type: 'json' }

const { typescript: version } = pkg.devDependencies

const url = new URL(`../typescript.json`, import.meta.url)
const config = JSON.parse(await readFile(url))

const [major, minor] = version.split('.')
config.packageRules[0].allowedVersions = `<=${major}.${minor}.x`

await writeFile(url, JSON.stringify(config))
