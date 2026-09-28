> [!NOTE]
> This package (`@najemi-software/vitest-dom`) is a fork of
> [vitest-dom](https://github.com/chaance/vitest-dom) by
> [Chance Strickland](https://github.com/chaance), which in turn is a fork of
> [`@testing-library/jest-dom`](https://github.com/testing-library/jest-dom)
> and is no longer maintained. All credit for the original work goes to the
> upstream authors.

<div align="center">
<h1>vitest-dom</h1>

<p>Custom Vitest matchers to test the state of the DOM</p>

</div>

---

<!-- prettier-ignore-start -->
[![version][version-badge]][package]
[![MIT License][license-badge]][license]

[![Watch on GitHub][github-watch-badge]][github-watch]
<!-- prettier-ignore-end -->

This library is a fork of
[`@testing-library/jest-dom`](https://github.com/testing-library/jest-dom). It
shares that library's implementation and API. It is intended to make it easier to include
its matchers without clashes between [Vitest][vitest] and Jest's environment or types.

See the [`README` for the original package](https://github.com/testing-library/jest-dom/blob/main/README.md) for usage details.

## Installation

This module should be installed as one of your project's `devDependencies`:

```shell
# with npm
npm install --save-dev @najemi-software/vitest-dom
# yarn
yarn add --dev @najemi-software/vitest-dom
# pnpm
pnpm add --dev @najemi-software/vitest-dom
```

## Usage

Import `extendExpect` from the entry point matching your installed Vitest major version and call it once,
preferably in your [tests setup file][]:

[tests setup file]: https://vitest.dev/config/#setupfiles

| Vitest version | Entry point                                    |
| -------------- | ---------------------------------------------- |
| 0.31 – 0.x     | `@najemi-software/vitest-dom/extend-expect/v0` |
| 1.x            | `@najemi-software/vitest-dom/extend-expect/v1` |
| 2.x            | `@najemi-software/vitest-dom/extend-expect/v2` |
| 3.x            | `@najemi-software/vitest-dom/extend-expect/v3` |
| 4.x            | `@najemi-software/vitest-dom/extend-expect/v4` |

```typescript
// vitest.setup.ts
import { extendExpect } from "@najemi-software/vitest-dom/extend-expect/v4";

extendExpect();
```

```typescript
// vitest.config.ts
export default defineConfig({
    test: {
        setupFiles: ["vitest.setup.ts"],
    },
});
```

Calling `extendExpect()` without arguments extends `expect` with all matchers. To extend it with only some of
them, pass them explicitly:

```typescript
import { extendExpect, matchers } from "@najemi-software/vitest-dom/extend-expect/v4";

extendExpect({ toBeVisible: matchers.toBeVisible, toHaveClass: matchers.toHaveClass });
```

### With TypeScript

Importing from an `extend-expect/v{n}` entry point also adds the matchers' types to Vitest's `expect`, using the
typing extension point of that Vitest major version. Make sure your setup file has a `.ts` extension and is
included in your TypeScript project.

If you call Vitest's `expect.extend` yourself (with the matchers from `@najemi-software/vitest-dom`), include the
types of your Vitest version's entry point either with a `/// <reference />` directive or in your
`compilerOptions`:

```typescript
import { matchers } from "@najemi-software/vitest-dom";
import { expect } from "vitest";

expect.extend(matchers);
```

1. In your test file via a reference directive:
    ```typescript
    /// <reference types="@najemi-software/vitest-dom/extend-expect/v4" />
    ```
2. In your `tsconfig.json` via the `types` compiler option:
    ```json
    {
        "compilerOptions": {
            "types": ["@najemi-software/vitest-dom/extend-expect/v4"]
        }
    }
    ```

### Migrating to 1.0.0

The side-effect import `import "@najemi-software/vitest-dom/extend-expect";` has been replaced by an explicit
call to `extendExpect()` from the entry point matching your Vitest version (see [Usage](#usage)).

The `@najemi-software/vitest-dom/matchers` entry point has been replaced by the package root
`@najemi-software/vitest-dom`, which also exports a `matchers` object; use
`import { matchers } from "@najemi-software/vitest-dom";` instead of
`import * as matchers from "@najemi-software/vitest-dom/matchers";`.

<!-- prettier-ignore-start -->
[vitest]: https://vitest.dev/
[version-badge]:
 https://img.shields.io/npm/v/@najemi-software/vitest-dom.svg?style=flat-square
[package]: https://www.npmjs.com/package/@najemi-software/vitest-dom
[license-badge]: 
  https://img.shields.io/npm/l/@najemi-software/vitest-dom.svg?style=flat-square
[license]: https://github.com/Najemi-Software/vitest-dom/blob/master/LICENSE
[github-watch-badge]:
  https://img.shields.io/github/watchers/Najemi-Software/vitest-dom.svg?style=social
[github-watch]: https://github.com/Najemi-Software/vitest-dom/watchers
<!-- prettier-ignore-end -->
