import { readFile, writeFile } from 'node:fs/promises'
import pkg from '@sanity/pkg-utils/package.json' assert {type: 'json'}

const {typescript: version} = pkg.devDependencies


const url = new URL(`../typescript-pkg-utils.json`, import.meta.url)
const config = JSON.parse(await readFile(url))


config.packageRules[0].allowedVersions = `<=${version}`

await writeFile(url, JSON.stringify(config))
