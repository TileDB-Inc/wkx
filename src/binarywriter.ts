export class BinaryWriter {
  public buffer: DataView;
  public position: number;
  private allowResize: boolean;

  constructor(size: number, allowResize: boolean = false) {
    this.buffer = new DataView(new ArrayBuffer(size));
    this.position = 0;
    this.allowResize = allowResize;
  }

  public writeUInt8(value: number) {
    this.ensureSize(1);
    this.buffer.setUint8(this.position, value);

    this.position += 1;
  }

  public writeUInt16(value: number, littleEndian: boolean = true) {
    this.ensureSize(2);
    this.buffer.setUint16(this.position, value, littleEndian);

    this.position += 2;
  }

  public writeUInt32(value: number, littleEndian: boolean = true) {
    this.ensureSize(4);
    this.buffer.setUint32(this.position, value, littleEndian);

    this.position += 4;
  }

  public writeInt8(value: number) {
    this.ensureSize(1);
    this.buffer.setInt8(this.position, value);

    this.position += 1;
  }

  public writeInt16(value: number, littleEndian: boolean = true) {
    this.ensureSize(2);
    this.buffer.setInt16(this.position, value, littleEndian);

    this.position += 2;
  }

  public writeInt32(value: number, littleEndian: boolean = true) {
    this.ensureSize(4);
    this.buffer.setInt32(this.position, value, littleEndian);

    this.position += 4;
  }

  public writeFloat(value: number, littleEndian: boolean = true) {
    this.ensureSize(4);
    this.buffer.setFloat32(this.position, value, littleEndian);

    this.position += 4;
  }

  public writeDouble(value: number, littleEndian: boolean = true) {
    this.ensureSize(8);
    this.buffer.setFloat64(this.position, value, littleEndian);

    this.position += 8;
  }

  public writeBuffer(buffer: ArrayBuffer) {
    this.ensureSize(buffer.byteLength);

    new Uint8Array(this.buffer.buffer).set(new Uint8Array(buffer), this.position);
    this.position += buffer.byteLength;
  }

  public writeVarInt(value: number) {
    let length = 1;
  
    while ((value & 0xffffff80) !== 0) {
      this.writeUInt8((value & 0x7f) | 0x80);
      value >>>= 7;
      length++;
    }
  
    this.writeUInt8(value & 0x7f);
  
    return length;
  };

  private ensureSize(size: number) {
    if (this.buffer.byteLength >= this.position + size) return;

    if (!this.allowResize) throw new RangeError("index out of range");

    const tempBuffer = new DataView(new ArrayBuffer(this.position + size));
    new Uint8Array(tempBuffer.buffer).set(new Uint8Array(this.buffer.buffer));
    this.buffer = tempBuffer;
  }
}
