import { encode, decode } from "../src/zigzag";

describe("ZigZag", function () {
  it("encode", function () {
    expect(encode(-1)).toStrictEqual(1);
    expect(encode(1)).toStrictEqual(2);
    expect(encode(-2)).toStrictEqual(3);
    expect(encode(2)).toStrictEqual(4);
  });
  it("decode", function () {
    expect(decode(1)).toStrictEqual(-1);
    expect(decode(2)).toStrictEqual(1);
    expect(decode(3)).toStrictEqual(-2);
    expect(decode(4)).toStrictEqual(2);
  });
});
