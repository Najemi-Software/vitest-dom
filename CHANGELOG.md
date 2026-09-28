# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-09-28

### Changed

- Split the internal matcher utilities into smaller, purpose-grouped modules in `src/matchers/utils/`, with their unit tests split alongside them; no behavior or public API changes

## [1.3.0] - 2026-09-28

### Changed

- Flatten the source layout of the `extend-expect/v{n}` entry points and move the shared public types into a single `src/types.ts` module; the published entry points and exported API are unchanged

## [1.2.0] - 2026-09-28

### Added

- Support for Vitest 5 via the new `@najemi-software/vitest-dom/extend-expect/v5` entry point, which adds the matcher types through Vitest 5's two-parameter `Matchers<R, T>` interface, so the matchers return `void` (or a `Promise` when used with `.resolves`/`.rejects`) like Vitest's own matchers

## [1.1.1] - 2026-09-28

### Fixed

- Stop publishing the unused `esm/vitest-dom.d.ts` file by disabling api-extractor's `.d.ts` rollup, which 1.1.0 enabled but no entry point references

## [1.1.0] - 2026-09-28

### Changed

- Add @microsoft/api-extractor and fix missing exports

## [1.0.1] - 2026-09-28

### Fixed

- Remove the old `IMatcherFn` declaration that should have been replaced in 1.0.0 but was left in place alongside its replacement, which merged the two into a single interface with an unintended extra call signature

## [1.0.0] - 2026-09-28

### Added

- One entry point per Vitest major version, `@najemi-software/vitest-dom/extend-expect/v0` through `@najemi-software/vitest-dom/extend-expect/v4`, each exporting `extendExpect()` and `matchers` and adding the matcher types through the typing extension point of that Vitest version (`Assertion` for Vitest 0.31–2, `Matchers` for Vitest 3–4), so the types check cleanly even with `skipLibCheck` disabled
- `extendExpect()` optionally accepts a subset of the matchers, to extend `expect` with only those
- The package root `@najemi-software/vitest-dom` exports the individual matchers, a `matchers` object and the `TestingLibraryMatchers` type

### Breaking Changes

- Remove the side-effect entry point `@najemi-software/vitest-dom/extend-expect`; import `extendExpect` from the entry point matching your Vitest major version and call it instead (see "Migrating to 1.0.0" in the README)
- Remove the `@najemi-software/vitest-dom/matchers` entry point; import `matchers` from the package root instead
- `TestingLibraryMatchers` takes a single type parameter, the matchers' return type, instead of two (`<E, R>`)

## [0.37.0] - 2026-09-28

### Changed

- Upgrade the Node.js version used for development and CI to 24.12.0 (`.nvmrc` and GitHub workflows); the published package's runtime requirements are unchanged

## [0.36.0] - 2026-09-28

### Changed

- Make the TypeScript configuration stricter (including `noUncheckedIndexedAccess`), with shared compiler options now living in `tsconfig.base.json` and `tsconfig.strict.json`, and adapt the source and tests accordingly without changing behavior
- Compile the published package for ES2022 (previously ES2020) and ship declaration maps alongside the type declarations

## [0.35.1] - 2026-09-27

### Fixed

- Register the `toHaveAccessibleErrorMessage` matcher, which was declared in the matcher types but missing from the exported `matchers`, so calling it through `expect` type-checked but failed at runtime

## [0.35.0] - 2026-09-27

### Changed

- Bump typescript to v7.0.2

## [0.34.0] - 2026-09-27

### Changed

- Split css-parse into smaller modules in src/css-parse/

## [0.33.1] - 2026-09-27

### Fixed

- Allow the exported `toHaveClass` matcher function to accept multiple class names followed by an options object, e.g. `toHaveClass(element, "a", "b", { exact: true })`, which was supported at runtime but rejected by its types

## [0.33.0] - 2026-09-27

### Changed

- Narrow parameter types of internal DOM type guard

## [0.32.0] - 2026-09-27

### Changed

- Remove all usages of any from matcher utils

## [0.31.0] - 2026-09-27

### Changed

- Remove type parameter defaults for MatcherState generics

## [0.30.2] - 2026-09-27

### Fixed

- Exclude the `esm` build output from type-checking by setting `outDir` in `tsconfig.json`, so stale build declarations no longer override the source types

## [0.30.1] - 2026-09-27

### Fixed

- Allow `toHaveClass` to accept multiple class names followed by an options object, e.g. `toHaveClass("a", "b", { exact: true })`, which was supported at runtime but rejected by the types

## [0.30.0] - 2026-09-27

### Changed

- Inline unnecessary variable in parseCSS

## [0.29.0] - 2026-09-27

### Changed

- Fix all eslint/no-prototype-builtins violations

## [0.28.0] - 2026-09-27

### Changed

- Fix all vitest/require-to-throw-message violations

## [0.27.0] - 2026-09-27

### Changed

- Migrate to oxlint and eslint hybrid

## [0.26.0] - 2026-09-27

### Changed

- Bump eslint to 9.39.5
- Migrate ESLint config from `.eslintrc.cjs` and `.eslintignore` to flat config `eslint.config.ts`
- Replace `@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser` with `typescript-eslint` 8.70.1
- Bump eslint-plugin-import to 2.32.0, eslint-import-resolver-typescript to 4.4.5 and eslint-import-resolver-node to 0.4.0
- Add `globals` and `jiti` (required by the flat config and its TypeScript config file)
- Remove unused eslint-disable directives

## [0.25.0] - 2026-09-27

### Changed

- Move matcher docstrings from the TestingLibraryMatchers interface to the matcher functions

## [0.24.0] - 2026-09-27

### Changed

- Extend matchers per test file and collocate unit-tests

## [0.23.0] - 2026-09-27

### Changed

- Bump vitest to 4.1.11

## [0.22.0] - 2026-09-27

### Changed

- Remove devDependency pretty-format and adjust unit-tests

## [0.21.0] - 2026-09-27

### Changed

- Bump pnpm to 12.6.0

## [0.20.0] - 2026-09-27

### Changed

- Bump typescript to 6.0.3

## [0.19.0] - 2026-09-27

### Changed

- Remove dead code

## [0.18.0] - 2026-09-27

### Changed

- Bump pnpm to 11.12.0

## [0.17.0] - 2026-09-26

### Changed

- Reformat CHANGELOG.md and add missing upstream versions
- Add validation of CHANGELOG.md to GH WF and improve other WFs

## [0.16.0] - 2026-09-26

### Changed

- add type-checking to build and fix all type errors

### Breaking Changes

- Exported matcher functions now declare `this: MatcherState`, so calling them directly (outside of `expect`) requires a vitest matcher context

## [0.15.0] - 2026-09-26

### Changed

- Rename dist/ to esm
- Add husky pre-commit hook and add lint-staged

### Fixed

- Un-deprecate toHaveAccessibleDescription matcher

## [0.14.0] - 2026-09-25

### Changed

- Migrate from tsup to tsc and matchers from JS to TS

## [0.13.0] - 2026-09-25

### Changed

- Refactor usages of and remove now-unused dep css.escape

## [0.12.0] - 2026-09-25

### Changed

- Refactor usages of and remove now-unused dep aria-query

## [0.11.0] - 2026-09-25

### Changed

- Migrate unit-tests from JSDom to happy-dom

## [0.10.0] - 2026-09-25

### Changed

- Cleanup usages of JSDom and make standard

## [0.9.0] - 2026-09-25

### Changed

- Unify vitest configuration files

## [0.8.0] - 2026-09-25

### Changed

- Migrate from prettier to oxfmt

## [0.7.0] - 2026-09-25

### Changed

- Move entrypoint shims into src/ and build them to dist/

## [0.6.0] - 2026-09-24

### Changed

- Rename vitest setup file

## [0.5.0] - 2026-09-24

### Changed

- Add proper exports field to package.json

## [0.4.0] - 2026-09-24

### Changed

- migrate unit-tests from JS to TS

## [0.3.0] - 2026-09-24

### Changed

- Bump node to 22 everywhere

## [0.2.0] - 2026-09-24

### Changed

- dummy PR to unblock next PR's merge
- Improve releasing and perform light cleanup

## [0.1.1] - 2023-09-16

> **Note:** development continued in the [Najemi-Software/vitest-dom](https://github.com/Najemi-Software/vitest-dom) fork from this version onward. The fork first published this same version as `@najemi-software/vitest-dom@0.1.1` on 2026-09-24.

### Added

- fork as @najemi-software/vitest-dom ([36c7916](https://github.com/Najemi-Software/vitest-dom/commit/36c7916bd9b7a59e90e5ceed427ff443f96b5933))

### Changed

- Relaxed `peerDependency` on Vitest (#7)
- Updated internal dependencies

## [0.1.0] - 2023-05-15

### Changed

- We now use the `css.escape` package to polyfill `CSS.escape` in `toHaveFormValues` matcher. This will use the built-in `CSS.escape` if it is detected in your runtime.

### Breaking Changes

- Bumped peer dependency on `vitest` to `^0.31.0`, as Vitest has made some breaking changes to its TypeScript API. We have updated our types to consume and extend the new types.
- We no longer augment the global `expect` type, as this is only desired when the user opts in to importing globals from `vitest`. Users will need to explicitly follow the Vitest's guidance to get global types.

## [0.0.6] - 2023-05-15

### Fixed

- Actually call `extend.expect` in `extend-expect` module (whoops!)

## [0.0.5] - 2023-05-15

### Changed

- Loosened the dependency on `vitest` to allow for versions between 0.16 and 0.30

### Fixed

- Added missing type export for `toBeDisabled`

## [0.0.4] - 2022-07-05

### Added

- Add types

### Changed

- Restructure exports
- Replace `lodash` with `lodash-es`
- Tweak dependencies and ESLint config

## [0.0.3] - 2022-07-04

### Changed

- Move global type updates to `extend-expect`

### Fixed

- Move tests out of published directory
- Fix npm `files` array

## [0.0.1] - 2022-07-04

### Changed

- Format README

### Fixed

- Publish missing types file

## [0.0.0] - 2022-07-04

### Added

- Initial release

[1.4.0]: https://github.com/Najemi-Software/vitest-dom/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/Najemi-Software/vitest-dom/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/Najemi-Software/vitest-dom/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/Najemi-Software/vitest-dom/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/Najemi-Software/vitest-dom/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/Najemi-Software/vitest-dom/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.37.0...v1.0.0
[0.37.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.36.0...v0.37.0
[0.36.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.35.1...v0.36.0
[0.35.1]: https://github.com/Najemi-Software/vitest-dom/compare/v0.35.0...v0.35.1
[0.35.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.34.0...v0.35.0
[0.34.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.33.1...v0.34.0
[0.33.1]: https://github.com/Najemi-Software/vitest-dom/compare/v0.33.0...v0.33.1
[0.33.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.32.0...v0.33.0
[0.32.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.31.0...v0.32.0
[0.31.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.30.2...v0.31.0
[0.30.2]: https://github.com/Najemi-Software/vitest-dom/compare/v0.30.1...v0.30.2
[0.30.1]: https://github.com/Najemi-Software/vitest-dom/compare/v0.30.0...v0.30.1
[0.30.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.29.0...v0.30.0
[0.29.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.28.0...v0.29.0
[0.28.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.27.0...v0.28.0
[0.27.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.26.0...v0.27.0
[0.26.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.25.0...v0.26.0
[0.25.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.24.0...v0.25.0
[0.24.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.23.0...v0.24.0
[0.23.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.22.0...v0.23.0
[0.22.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.21.0...v0.22.0
[0.21.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.20.0...v0.21.0
[0.20.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.19.0...v0.20.0
[0.19.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.18.0...v0.19.0
[0.18.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.17.0...v0.18.0
[0.17.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.16.0...v0.17.0
[0.16.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.15.0...v0.16.0
[0.15.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.14.0...v0.15.0
[0.14.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.13.0...v0.14.0
[0.13.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.12.0...v0.13.0
[0.12.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.11.0...v0.12.0
[0.11.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.10.0...v0.11.0
[0.10.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.9.0...v0.10.0
[0.9.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.8.0...v0.9.0
[0.8.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/Najemi-Software/vitest-dom/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/chaance/vitest-dom/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/chaance/vitest-dom/compare/v0.0.6...v0.1.0
[0.0.6]: https://github.com/chaance/vitest-dom/compare/v0.0.5...v0.0.6
[0.0.5]: https://github.com/chaance/vitest-dom/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/chaance/vitest-dom/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/chaance/vitest-dom/compare/v0.0.1...v0.0.3
[0.0.1]: https://github.com/chaance/vitest-dom/compare/c55ed6adc9e6868f796ff0daeeab330d970d261b...v0.0.1
[0.0.0]: https://github.com/chaance/vitest-dom/commits/c55ed6adc9e6868f796ff0daeeab330d970d261b
