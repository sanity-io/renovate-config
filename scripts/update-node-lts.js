import {readFile, writeFile} from 'node:fs/promises'
import {version} from 'node:process'

const url = new URL(`../node-lts.json`, import.meta.url)
const config = JSON.parse(await readFile(url))

const [major] = version.slice(1).split('.')

config.packageRules[0].allowedVersions = `<=${major}`

await writeFile(url, JSON.stringify(config))
