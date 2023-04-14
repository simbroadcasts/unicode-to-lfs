import { cpTables } from "./codepageTables";

const codepages = ["L", "G", "C", "E", "T", "B", "J", "H", "S", "K", "8"];

const specials: Record<string, string> = {
  "|": "^v",
  "*": "^a",
  ":": "^c",
  "\\": "^d",
  "/": "^s",
  "?": "^q",
  '"': "^t",
  "<": "^l",
  ">": "^r",
  "#": "^h",
};

/**
 * Converts a Unicode string to a null-terminated LFS-encoded string.
 *
 * Inspired by the implementation from [InSim.NET]{@link https://github.com/alexmcbride/insimdotnet/blob/ef25f20fb98dcaa3bbddf6726f4290f2377597ff/InSimDotNet/LfsUnicodeEncoding.cs}
 **/
export function unicodeToLfs(
  value: string,
  options: {
    isNullTerminated?: boolean;
    length?: number;
  } = {
    isNullTerminated: false,
  }
): string {
  const { isNullTerminated, length } = options;

  value = value.split(/\^(?![\dLGCJETBHSK])/).join("^^");
  value = value.split(/\^[LGCJETBHSK]/g).join("");

  for (let i in specials) {
    value = value.split(i).join(specials[i]);
  }

  let currentCodepage = "^L";
  let tempBytes = new Uint16Array(2);
  let tempCount;
  let index = 0;

  const nullByteLength = isNullTerminated ? 1 : 0;

  // For each input character, reserve at most 2 control characters + 2 bytes + an optional NULL byte at the end
  const totalLength = length ?? value.length * 4 + nullByteLength;
  const buffer = new Uint16Array(totalLength);

  for (
    let i = 0;
    i < value.length && index < totalLength - nullByteLength;
    i++
  ) {
    if (value.charCodeAt(i) <= 127) {
      // All codepages share ASCII values
      buffer[index++] = value.charCodeAt(i);
      continue;
    }

    tempBytes = tryGetBytes(value[i], currentCodepage);
    tempCount = tempBytes.length;

    if (tempBytes.length > 0) {
      // Character exists in current codepage
      buffer.set(tempBytes.slice(0, tempCount), index);
      index += tempCount;
    } else {
      // Search for new codepage
      let found = false;

      codepages.every((codepage) => {
        if (codepage == currentCodepage) {
          return true;
        }

        tempBytes = tryGetBytes(value[i], codepage);
        tempCount = tempBytes.length;

        if (tempCount > 0) {
          // Switch codepage
          currentCodepage = codepage;

          if (index + 2 >= totalLength - nullByteLength) {
            // Do not copy any more bytes to buffer if it would exceed the max length
            index += tempCount + 2;
            found = true;
            return false;
          }

          // Add control characters
          buffer[index++] = "^".charCodeAt(0);
          buffer[index++] = codepage.charCodeAt(0);

          // Copy to buffer
          buffer.set(tempBytes.slice(0, tempCount), index);
          index += tempCount;
          found = true;

          return false;
        }

        return true;
      });

      // If not found in any codepage then add fallback character
      if (!found) {
        buffer[index++] = "?".charCodeAt(0);
      }
    }
  }

  const bytes = new Uint16Array(buffer).slice(
    0,
    length ?? index + nullByteLength
  );

  return Array.from(bytes)
    .map((byte) => String.fromCharCode(byte))
    .join("");
}

function tryGetBytes(value: string, codepage: string): Uint16Array {
  try {
    return getBytes(value, codepage);
  } catch (e) {
    return new Uint16Array(0);
  }
}

function getBytes(character: string, charset: string): Uint16Array {
  const charCode = character.charCodeAt(0);

  let data: Uint16Array | undefined = undefined;

  Object.entries(cpTables).every(([cp, charMap]) => {
    if (!cp.startsWith(charset)) {
      return true;
    }

    const encodedCharCode = charMap[charCode];

    if (encodedCharCode === undefined) {
      return true;
    }

    const highByte = encodedCharCode >> 8;
    const lowByte = encodedCharCode - (highByte << 8);

    if (highByte === 0 && lowByte === 0) {
      return true;
    }

    if (highByte === 0) {
      data = new Uint16Array([lowByte]);
      return false;
    }

    data = new Uint16Array([highByte, lowByte]);
    return false;
  });

  if (data === undefined) {
    throw new Error(`Failed to encode ${character}`);
  }

  return data;
}
