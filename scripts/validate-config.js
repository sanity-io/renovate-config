#!/usr/bin/env zx

import 'zx/globals'

import validator from 'json-schema-remote'

const [schema, files] = await Promise.all([
  spinner('fetching renovate-schema.json...', async () => {
    const res = await fetch('https://docs.renovatebot.com/renovate-schema.json')
    return res.json()
  }),
  glob(['./*.json', '.github/renovate.json'], {
    ignore: ['package*.json'],
  }),
])

for (const file of files) {
  await spinner(`validating ${file}...`, async () => {
    try {
      const jsonPromise = fs.readJson(file)
      await Promise.all([
        $`renovate-config-validator ${file}`,
        validator.validate(await jsonPromise, schema),
      ])
    } catch (p) {
      throw new Error(
        `Validation failed for ${file}: ${p.stderr || p.stdout || p.message}`,
        {
          cause: p.errors?.[0] || p,
        }
      )
    }
  })
}
