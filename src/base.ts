import { BinaryWriter } from "./binarywriter";
import { Precision, WKBExportOptions } from "./types";
import { encode } from "./zigzag";

export abstract class GeometryBase {
  public srid?: number;
  public hasZ: boolean;
  public hasM: boolean;

  constructor() {
    this.srid = undefined;
    this.hasZ = false;
    this.hasM = false;
  }

  /**
   * Export to WKT format
   */
  public abstract toWkt(): string;


  public abstract toWkb(options?: WKBExportOptions): ArrayBuffer;

  /**
   * Export to WKTB format
   */
  public abstract toTwkb(): ArrayBuffer;

  /**
   * Get the byte size of the geometry stored in WKB format
   */
  public abstract getWkbSize(): number;

  public static getTwkbPrecision(xyPrecision: number, zPrecision: number, mPrecision: number): Precision {
    return {
      xy: xyPrecision,
      z: zPrecision,
      m: mPrecision,
      xyFactor: Math.pow(10, xyPrecision),
      zFactor: Math.pow(10, zPrecision),
      mFactor: Math.pow(10, mPrecision)
    };
  };

  protected writeTwkbHeader(writer: BinaryWriter, geometryType: number, precision: Precision, isEmpty: boolean): void {
    const type = (encode(precision.xy) << 4) + geometryType;
    let metadataHeader = Number(this.hasZ || this.hasM) << 3;
    metadataHeader += Number(isEmpty) << 4;

    writer.writeUInt8(type);
    writer.writeUInt8(metadataHeader);

    if (this.hasZ || this.hasM) {
      let extendedPrecision = 0;
      if (this.hasZ)
        extendedPrecision |= 0x1;
      if (this.hasM)
        extendedPrecision |= 0x2;

      writer.writeUInt8(extendedPrecision);
    }
  }

  protected getWkbType(geometryType: number, options?: WKBExportOptions): number {
    let dimensionType = 0;

    if (this.srid === undefined && options?.srid === undefined) {
      if (this.hasZ && this.hasM) dimensionType += 3000;
      else if (this.hasZ) dimensionType += 1000;
      else if (this.hasM) dimensionType += 2000;
    } else {
      if (this.hasZ) dimensionType |= 0x80000000;
      if (this.hasM) dimensionType |= 0x40000000;
    }

    return (dimensionType + geometryType) >>> 0;
  }

  protected getWktType(wktType: string, isEmpty: boolean): string {
    let wkt = wktType;

    if (this.hasZ && this.hasM)
      wkt += ' ZM ';
    else if (this.hasZ)
      wkt += ' Z ';
    else if (this.hasM)
      wkt += ' M ';

    if (isEmpty && !this.hasZ && !this.hasM)
      wkt += ' ';

    if (isEmpty)
      wkt += 'EMPTY';

    return wkt;
  };

  public toEwkt(): string {
    return 'SRID=' + this.srid + ';' + this.toWkt();
  }

  public toEwkb(): ArrayBuffer {
    const writer = new BinaryWriter(this.getWkbSize() + 4);
    const buffer = this.toWkb();

    writer.writeInt8(1);
    writer.writeUInt32((new DataView(buffer.slice(1, 5)).getUint32(0, true) | 0x20000000) >>> 0);
    writer.writeUInt32(this.srid!);

    writer.writeBuffer(buffer.slice(5));

    return writer.buffer.buffer;
  };
}