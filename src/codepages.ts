/**
 * LFS codepage codes
 *
 * @internal
 */
export const codepages = [
  "L",
  "G",
  "C",
  "E",
  "T",
  "B",
  "J",
  "H",
  "S",
  "K",
  "8",
] as const;

/** @internal */
export type Codepage = (typeof codepages)[number];
