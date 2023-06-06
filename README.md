# [Sharable Config Presets](https://docs.renovatebot.com/config-presets/) for [Renovate] curated by [Sanity](https://www.sanity.io)

[![Test](https://github.com/sanity-io/renovate-config/actions/workflows/test.yml/badge.svg)](https://github.com/sanity-io/renovate-config/actions/workflows/test.yml)

If keeping dependencies up to date is part of your job, then you have two options:

## Option A

1. Check if any of the dependencies are outdated.
2. For each outdated dependency find out what changed, lookup its release notes, changelog, git diff.
3. Create PRs, with the context for the team to review.
4. Some PRs should be grouped together to reduce noise, so you don't have to review 100s of PRs.
5. If you have lockfiles (`yarn.lock`, `package-lock.json`, etc) you'll likely have merge conflicts for every dependency PR you created.
6. If on a monorepo dedupe lockfiles after merging all the PRs, to avoid nasty bugs as some libraries, like `react`, breaks if multiple instances of it exists within the same render.
7. Rince and repeat.

## Option B

1. Have [Renovatebot] do all the steps in [Option A](#option-a).
2. Ship.

# Usage

1. Install the [Renovate](https://www.mend.io/renovate/), the easiest method is the [GitHub App](https://github.com/marketplace/renovate). Other alternatives are the [Docker Image](https://hub.docker.com/r/renovate/renovate) or [Self-Hosting](https://www.mend.io/free-developer-tools/renovate/on-premises/)
2. Make sure it has access to your repository, if it does you should see it open a PR with the title `Configure Renovate` on your repository.
3. Create a `renovate.json` file in your repository root, on the default branch:
   ```json
   {
     "$schema": "https://docs.renovatebot.com/renovate-schema.json",
     "extends": ["github>sanity-io/renovate-config"]
   }
   ```
4. If you see Renovatebot opening an issue on your repo titled ["Dependency Dashboard"](https://github.com/sanity-io/renovate-config/issues/3) then you're good to go. If you're using the official GitHub app it should only take a few minutes. But if it's self hosted it might take a bit longer.

The default preset, `github>sanity-io/renovate-config`, is a composition of the following presets:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "github>sanity-io/renovate-config:base",
    "github>sanity-io/renovate-config:branding",
    "github>sanity-io/renovate-config:security",
    "github>sanity-io/renovate-config:strategy",
    "github>sanity-io/renovate-config:labels",
    "github>sanity-io/renovate-config:node-lts",
    "github>sanity-io/renovate-config:schedule",
    "github>sanity-io/renovate-config:group-recommended",
    "github>sanity-io/renovate-config:group-non-major",
    "github>sanity-io/renovate-config:workarounds-esm",
    "github>sanity-io/renovate-config:dedupe"
  ]
}
```

If you're overall happy with the default behavior, but there's one or two presets you disagree with, you can use `ignorePresets` to disable them:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["github>sanity-io/renovate-config"],
  "ignorePresets": [
    "github>sanity-io/renovate-config:branding",
    "github>sanity-io/renovate-config:labels"
  ]
}
```

There's also a collection of presets you can choose to opt-in to:

```json
[
  "github>sanity-io/renovate-config:automerge",
  "github>sanity-io/renovate-config:studio-v2",
  "github>sanity-io/renovate-config:studio-v3"
]
```

`automerge` should only be used if the repository is setup to require PR review approvals and passing tests before merging.

While `studio-v2` and `studio-v3` use presets that are handy if you're building a [Sanity Studio](https://www.sanity.io/docs/studio) in your project.

## Scaling PR noise, gentler onboarding for large projects

Depending on the project, the default behavior might result in too much noise. Especially if it's a large monorepo, with many outdated dependencies, and many developers sending in PRs on a general basis.
For such projects it's better to tweak the preset to use a more manual and granular mode:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "github>sanity-io/renovate-config",
    ":dependencyDashboardApproval"
  ],
  "ignorePresets": ["github>sanity-io/renovate-config:group-non-major"]
}
```

With this setup Renovatebot will only create PRs when a developer checks off a specific dependency update in the "Dependency Dashboard" issue. And by turning off `group-non-major` it'll show a more granular list over dependencies instead of creating a very large PR that groups every `patch` and `minor` update together.
If you don't want any grouping but prefer each dependency to have its own PR you can add `github>sanity-io/renovate-config:group-recommended` to the `ignorePresets` array.

## Scaling up momentum, when a project only cares about major updates

If a project have a small backlog of outdated dependencies, and have a good CI infra setup, you can reduce noise by grouping as many dependency updates in the same PR as possible:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["github>sanity-io/renovate-config"],
  "ignorePresets": ["github>sanity-io/renovate-config:group-recommended"],
  "packageRules": [
    {
      "automerge": true,
      "matchDepTypes": ["devDependencies"],
      "updateTypes": ["minor", "patch"]
    }
  ]
}
```

With this setup only major dependencies get their own PRs. And dev dependencies that aren't major are automerged.

[renovatebot]: https://github.com/renovatebot/renovate
[Renovate]: https://www.mend.io/renovate/
