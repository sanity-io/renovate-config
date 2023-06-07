#!/usr/bin/env zx

import 'zx/globals'

import sortObject from 'sort-object-keys'

const files = await glob(['./*.json', '.github/renovate.json'], {
  ignore: ['package*.json'],
})

for (const file of files) {
  const json = await fs.readJson(file)
  await fs.writeJson(file, json, {
    spaces: 2,
    replacer: (key, value) => {
      // Never sort the "extends" key, as ordering affect the onboarding PR detailed description
      if (key === 'extends') {
        return value
      }
      // Sort other arrays if they contain only strings
      if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
        return [...value].sort()
      }
      // Sort the rest of the object, if we can
      if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        value !== null
      ) {
        const {
          $schema = 'https://docs.renovatebot.com/renovate-schema.json',
          description,
          extends: _extends,
          onboardingConfigFileName,
          lockFileMaintenance,
          packageRules,
          ...rest
        } = value
        return {
          $schema: key === '' ? $schema : undefined,
          description,
          extends: _extends,
          onboardingConfigFileName,
          lockFileMaintenance,
          packageRules,
          ...sortObject(rest),
        }
      }

      return value
    },
  })
}

await $`prettier --ignore-path .gitignore --write *.json`
