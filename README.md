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

Import the matchers from `@najemi-software/vitest-dom/matchers` once (perferably in your [tests
setup file][]), then pass them to Vitest's `expect.extend` method:

[tests setup file]: https://vitest.dev/config/#setupfiles

```javascript
// vitest-setup.js
import * as matchers from "@najemi-software/vitest-dom/matchers";
import { expect } from "vitest";
expect.extend(matchers);

// or:
import "@najemi-software/vitest-dom/extend-expect";

// In vitest.config.js, add the following
export default defineConfig({
  test: {
    setupFiles: ["vitest-setup.js"],
  },
});
```

### With TypeScript

If you're using TypeScript, make sure your setup file has a `.ts` extension to
include the necessary types.

If you import from `@najemi-software/vitest-dom/extend-expect` to run `expect.extend` for you,
you will get TypeScript support automatically.

```typescript
// vitest-setup.ts
import "@najemi-software/vitest-dom/extend-expect";
```

If you want to run `extend.expect` yourself, you will need to include the type defintions either with a `/// <reference />` directive or including the type in your `compilerOptions`:

1. In your test file via a reference directive:
   ```typescript
   /// <reference types="@najemi-software/vitest-dom/extend-expect" />
   ```
2. In your `tsconfig.json` via the `types` compiler option:
   ```json
   {
     "compilerOptions": {
       "types": ["@najemi-software/vitest-dom/extend-expect"]
     }
   }
   ```

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
