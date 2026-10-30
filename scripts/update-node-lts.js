import {readFile, writeFile} from 'node:fs/promises'

const releasesResponse = await fetch('https://nodejs.org/dist/index.json')

if (!releasesResponse.ok) {
  throw new Error(`Failed to fetch Node.js releases: ${releasesResponse.status}`)
}

const releases = await releasesResponse.json()
const latestLts = releases.find((release) => release.lts)

if (!latestLts) {
  throw new Error('No Node.js LTS release found')
}

const url = new URL(`../node-lts.json`, import.meta.url)
const config = JSON.parse(await readFile(url))

const [major] = latestLts.version.slice(1).split('.')

config.packageRules[0].allowedVersions = `<=${major}`

await writeFile(url, JSON.stringify(config))
