# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
