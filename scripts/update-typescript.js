import { readFile, writeFile } from 'node:fs/promises'
import pkg from '@sanity/tsdoc/package.json' assert {type: 'json'}

const {typescript: version} = pkg.dependencies


const url = new URL(`../typescript.json`, import.meta.url)
const config = JSON.parse(await readFile(url))


config.packageRules[0].allowedVersions = `<=${version}`

await writeFile(url, JSON.stringify(config))
