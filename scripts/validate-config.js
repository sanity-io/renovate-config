#!/usr/bin/env zx

import 'zx/globals'

const files = await glob(['./*.json', '.github/renovate.json'], {
  ignore: ['package*.json'],
})

for (const file of files) {
  await spinner(`validating ${file}...`, async () => {
    try {
      await $`renovate-config-validator ${file}`
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
