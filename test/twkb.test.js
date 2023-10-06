import { Parser } from '../src/parser';
import { Point } from '../src/point';


describe('parseTwkb', function () {
  it('includes size', function () {
    let hex = '0102020204';
    let array = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) { return parseInt(h, 16) }));

    expect(Parser.parseTwkb(new DataView(array.buffer))).toEqual(new Point(1, 2));
  });
  it('includes bounding box', function () {
    let hex = '0101020004000204';
    let array = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) { return parseInt(h, 16) }));

    expect(Parser.parseTwkb(new DataView(array.buffer))).toEqual(new Point(1, 2));
  });
  it('includes extended precision', function () {
    let hex = '01080302040608';
    let array = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) { return parseInt(h, 16) }));

    expect(Parser.parseTwkb(new DataView(array.buffer))).toEqual(new Point(1, 2, 3, 4));
  });
  it('includes extended precision and bounding box', function () {
    let hex = '010903020004000600080002040608';
    let array = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) { return parseInt(h, 16) }));

    expect(Parser.parseTwkb(new DataView(array.buffer))).toEqual(new Point(1, 2, 3, 4));
  });
});

describe('toTwkb', function () {
  it('Point small', function () {
    let array = new Uint8Array(new Point(1, 2).toTwkb());
    let hex = Array.from(array).map(x => x.toString(16).padStart(2, '0')).join('');

    expect(hex).toEqual('a100c09a0c80b518');
  });
  it('Point large', function () {
    let array = new Uint8Array(new Point(10000, 20000).toTwkb());
    let hex = Array.from(array).map(x => x.toString(16).padStart(2, '0')).join('');

    expect(hex).toEqual('a10080a8d6b90780d0acf30e');
  });
});
