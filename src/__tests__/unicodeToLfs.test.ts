import { unicodeToLfs } from "../unicodeToLfs";

describe("unicodeToLfs", () => {
  it(`should keep ASCII characters`, () => {
    expect(unicodeToLfs("abcd 1234", { isNullTerminated: true })).toEqual(
      "abcd 1234\0"
    );
    expect(unicodeToLfs("abcd 1234", { isNullTerminated: false })).toEqual(
      "abcd 1234"
    );
  });

  it(`should convert unicode to LFS`, () => {
    expect(
      unicodeToLfs("ěš шю ýþ ώλ ış ūņ", { isNullTerminated: true })
    ).toEqual("^Eì\x9A ^Cøþ ^Lýþ ^Gþë ^Týþ ^Bûò\0");
    expect(
      unicodeToLfs("ěš шю ýþ ώλ ış ūņ", { isNullTerminated: false })
    ).toEqual("^Eì\x9A ^Cøþ ^Lýþ ^Gþë ^Týþ ^Bûò");
  });

  it(`should convert Japanese characters`, () => {
    expect(unicodeToLfs("ﾏ美", { isNullTerminated: true })).toEqual(
      "^J\xCF\x94\xFC\0"
    );
    expect(unicodeToLfs("ﾏ美", { isNullTerminated: false })).toEqual(
      "^J\xCF\x94\xFC"
    );
  });

  it(`should convert CP950 (Traditional Chinese)`, () => {
    expect(unicodeToLfs("墔", { isNullTerminated: true })).toEqual(
      "^H\xE1\x67\0"
    );
    expect(unicodeToLfs("墔", { isNullTerminated: false })).toEqual(
      "^H\xE1\x67"
    );
  });

  it(`should convert CP936 (Simplified Chinese)`, () => {
    expect(unicodeToLfs("尘", { isNullTerminated: true })).toEqual(
      "^S\xB3\xBE\0"
    );
    expect(unicodeToLfs("尘", { isNullTerminated: false })).toEqual(
      "^S\xB3\xBE"
    );
  });

  it(`should convert CP949 (Korean)`, () => {
    expect(unicodeToLfs("어", { isNullTerminated: true })).toEqual(
      "^K\xBE\xEE\0"
    );
    expect(unicodeToLfs("어", { isNullTerminated: false })).toEqual(
      "^K\xBE\xEE"
    );
  });

  it(`should strip any existing language tags`, () => {
    expect(unicodeToLfs("^Eabc ^Cefg", { isNullTerminated: true })).toEqual(
      "abc efg\0"
    );
    expect(unicodeToLfs("^Eabc ^Cefg", { isNullTerminated: false })).toEqual(
      "abc efg"
    );
  });

  it(`should keep colour tags`, () => {
    expect(unicodeToLfs("^1abc ^2efg", { isNullTerminated: true })).toEqual(
      "^1abc ^2efg\0"
    );
    expect(unicodeToLfs("^1abc ^2efg", { isNullTerminated: false })).toEqual(
      "^1abc ^2efg"
    );
  });

  it(`should trim the output string to the provided length including the null terminator`, () => {
    expect(unicodeToLfs("abc", { isNullTerminated: true, length: 6 })).toEqual(
      "abc\0\0\0"
    );
    expect(
      unicodeToLfs("abcěšшю", { isNullTerminated: true, length: 3 })
    ).toEqual("ab\0");
    expect(
      unicodeToLfs("abcěšшю", { isNullTerminated: true, length: 4 })
    ).toEqual("abc\0");
    expect(
      unicodeToLfs("abcěšшю", { isNullTerminated: true, length: 5 })
    ).toEqual("abc\0\0");
    expect(
      unicodeToLfs("abcěšшю", { isNullTerminated: true, length: 6 })
    ).toEqual("abc\0\0\0");
    expect(
      unicodeToLfs("abcěšшю", { isNullTerminated: true, length: 7 })
    ).toEqual("abc^Eì\0");
    expect(
      unicodeToLfs("abcěšшю", { isNullTerminated: true, length: 8 })
    ).toEqual("abc^Eì\x9A\0");
    expect(
      unicodeToLfs("abcěšшю", { isNullTerminated: true, length: 9 })
    ).toEqual("abc^Eì\x9A\0\0");
  });

  it(`should trim the output string to the provided length`, () => {
    expect(unicodeToLfs("abc", { isNullTerminated: false, length: 6 })).toEqual(
      "abc\0\0\0"
    );
    expect(
      unicodeToLfs("abcěšшю", { isNullTerminated: false, length: 3 })
    ).toEqual("abc");
    expect(
      unicodeToLfs("abcěšшю", { isNullTerminated: false, length: 4 })
    ).toEqual("abc\0");
    expect(
      unicodeToLfs("abcěšшю", { isNullTerminated: false, length: 5 })
    ).toEqual("abc\0\0");
    expect(
      unicodeToLfs("abcěšшю", { isNullTerminated: false, length: 6 })
    ).toEqual("abc^Eì");
    expect(
      unicodeToLfs("abcěšшю", { isNullTerminated: false, length: 7 })
    ).toEqual("abc^Eì\x9A");
    expect(
      unicodeToLfs("abcěšшю", { isNullTerminated: false, length: 8 })
    ).toEqual("abc^Eì\x9A\0");
    expect(
      unicodeToLfs("abcěšшю", { isNullTerminated: false, length: 9 })
    ).toEqual("abc^Eì\x9A\0\0");
  });
});
