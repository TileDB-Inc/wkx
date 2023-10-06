import { BinaryWriter } from "../src/binarywriter";

describe("BinaryWriter", function () {
  it("writeVarInt - 1", function () {
    let binaryWriter = new BinaryWriter(1);
    let length = binaryWriter.writeVarInt(1);

    let array = new Uint8Array(binaryWriter.buffer.buffer);
    let hex = Array.from(array).map(x => x.toString(16).padStart(2, '0')).join('');
    
    expect(hex).toStrictEqual('01');
    expect(length).toStrictEqual(1);
  });
  it("writeVarInt - 300", function () {
    let binaryWriter = new BinaryWriter(2);
    let length = binaryWriter.writeVarInt(300);

    let array = new Uint8Array(binaryWriter.buffer.buffer);
    let hex = Array.from(array).map(x => x.toString(16).padStart(2, '0')).join('');
    
    expect(hex).toStrictEqual('ac02');
    expect(length).toStrictEqual(2);
  });
  it("writeUInt8 - enough space", function () {
    let binaryWriter = new BinaryWriter(1);
    binaryWriter.writeUInt8(1);

    expect(binaryWriter.buffer.byteLength).toStrictEqual(1);
    expect(binaryWriter.position).toStrictEqual(1);
  });
  it("writeUInt16LE - not enough space", function () {
    let binaryWriter = new BinaryWriter(1);

    expect(() => binaryWriter.writeUInt16(1)).toThrow('index out of range')
  });
  it("writeUInt8 - enough space / allow resize", function () {
    let binaryWriter = new BinaryWriter(1, true);
    binaryWriter.writeUInt8(1);

    expect(binaryWriter.buffer.byteLength).toStrictEqual(1);
    expect(binaryWriter.position).toStrictEqual(1);
  });
  it("writeUInt16LE - not enough space  / allow resize", function () {
    let binaryWriter = new BinaryWriter(1, true);
    binaryWriter.writeUInt16(1);

    expect(binaryWriter.buffer.byteLength).toStrictEqual(2);
    expect(binaryWriter.position).toStrictEqual(2);
  });
});
