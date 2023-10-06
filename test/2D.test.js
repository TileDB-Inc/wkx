import { Parser } from '../src/parser';
import { Point } from '../src/point';

describe("2D test", function () {
    it("Empty Point", function () {
      expect(Parser.parse("POINT EMPTY")).toEqual(new Point());

      let hex = "0101000000000000000000f87f000000000000f87f";
      let array = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) { return parseInt(h, 16) }));
      expect(Parser.parse(new DataView(array.buffer))).toEqual(new Point(NaN, NaN));

      hex = "00000000017ff80000000000007ff8000000000000";
      array = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) { return parseInt(h, 16) }));
      expect(Parser.parse(new DataView(array.buffer))).toEqual(new Point(NaN, NaN));

      hex = "00000000017ff80000000000007ff8000000000000";
      array = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) { return parseInt(h, 16) }));
      expect(Parser.parse(new DataView(array.buffer))).toEqual(new Point(NaN, NaN));
    });
  });