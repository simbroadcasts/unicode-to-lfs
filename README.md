# Unicode to LFS

[![NPM Version](https://img.shields.io/npm/v/unicode-to-lfs?style=flat-square)](https://www.npmjs.com/package/unicode-to-lfs) ![Node.js CI](https://github.com/simbroadcasts/unicode-to-lfs/actions/workflows/.github/workflows/node.js.yml/badge.svg)

Convert a Unicode string to [Live for Speed](https://lfs.net)

This module is designed to be used with NodeJS on the server with an InSim library or as middleware for other LFS InSim applications. This module will parse a Unicode string, converting each character to its respective encoding supported by LFS. This module leaves message colour encodings intact for processing later.

## Install

```bash
# Install with Yarn
yarn add unicode-to-lfs

# Install with NPM
npm i unicode-to-lfs
```

## Usage Example

```ts
import unicodeToLfs from "unicode-to-lfs";

const encodedString1 = unicodeToLfs("ě ш");
const encodedString2 = unicodeToLfs("ﾏ");

console.log(encodedString1);
// Output: ^Eì ^Cø

console.log(encodedString2);
// Output: ^JÏ
```

### Options

#### `length`

To specify the maximum output byte length, use the `length` option. If the output string would be trimmed
in the middle of an encoded character, that character will not be included and the string will be padded
with NULL bytes up to the specified `length`.

```ts
import unicodeToLfs from "unicode-to-lfs";

const encodedString1 = unicodeToLfs("ě ш", { length: 4 });
const encodedString2 = unicodeToLfs("ě ш", { length: 7 });

console.log(encodedString1);
// Output: ^Eì\0

console.log(encodedString2);
// Output: ^Eì ^Cø
```

#### `isNullTerminated`

If set to `true`, the output string will always end with a NULL byte.

The default value is `false`.

```ts
import unicodeToLfs from "unicode-to-lfs";

const encodedString1 = unicodeToLfs("ě ш", { isNullTerminated: true });
const encodedString2 = unicodeToLfs("ě ш", {
  isNullTerminated: true,
  length: 7,
});

console.log(encodedString1);
// Output: ^Eì ^Cø\0

console.log(encodedString2);
// Output: ^Eì \0\0\0
```
