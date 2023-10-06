export class BinaryReader {
  private buffer: DataView;
  private position: number;

  public isBigEndian: boolean;

  constructor(buffer: DataView, isBigEndian: boolean = false) {
    this.buffer = buffer;
    this.position = 0;
    this.isBigEndian = isBigEndian;
  }

  public readUInt8(): number {
    const result = this.buffer.getUint8(this.position);

    ++this.position;

    return result;
  }

  public readUInt16(): number {
    const result = this.buffer.getUint16(this.position, !this.isBigEndian);

    this.position += 2;

    return result;
  }

  public readUInt32(): number {
    const result = this.buffer.getUint32(this.position, !this.isBigEndian);

    this.position += 4;

    return result;
  }

  public readInt8(): number {
    const result = this.buffer.getInt8(this.position);

    ++this.position;

    return result;
  }

  public readInt16(): number {
    const result = this.buffer.getInt16(this.position, !this.isBigEndian);

    this.position += 2;

    return result;
  }

  public readInt32(): number {
    const result = this.buffer.getInt32(this.position, !this.isBigEndian);

    this.position += 4;

    return result;
  }

  public readFloat(): number {
    const result = this.buffer.getFloat32(this.position, !this.isBigEndian);

    this.position += 4;

    return result;
  }

  public readDouble(): number {
    const result = this.buffer.getFloat64(this.position, !this.isBigEndian);

    this.position += 8;

    return result;
  }

  public readVarInt(): number {
    let result = 0;
    let bytesRead = 0;
    let nextByte: number;

    do {
      nextByte = this.buffer.getUint8(this.position + bytesRead);
      result += (nextByte & 0x7f) << (7 * bytesRead);
      bytesRead++;
    } while (nextByte >= 0x80);

    this.position += bytesRead;

    return result;
  }
}
