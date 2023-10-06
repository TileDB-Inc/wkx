import { BinaryReader } from '../src/binaryreader';

describe('BinaryReader', function () {
  it('readVarInt', function () {
    let hex = '01';
    let array = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) { return parseInt(h, 16) }));
    expect(new BinaryReader(new DataView(array.buffer)).readVarInt()).toStrictEqual(1);

    hex = 'ac02';
    array = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) { return parseInt(h, 16) }));
    expect(new BinaryReader(new DataView(array.buffer)).readVarInt()).toStrictEqual(300);
  });
});

