import { BinaryReader } from "./binaryreader";
import { Types, TWKBParseOptions, Precision, WKTParseOptions, WKBParseOptions, WKBExportOptions } from "./types";
import { WktParser } from "./wktparser";
import { BinaryWriter } from "./binarywriter";
import { GeometryBase } from "./base";
import { decode, encode } from "./zigzag";

export class Point extends GeometryBase {
  public x?: number;
  public y?: number;
  public z?: number;
  public m?: number;

  constructor(x?: number, y?: number, z?: number, m?: number, srid?: number) {
    super();

    this.x = x;
    this.y = y;
    this.z = z;
    this.m = m;
    this.srid = srid;

    this.hasZ = this.z !== undefined;
    this.hasM = this.m !== undefined;
  }

  public static Z(x: number, y: number, z: number, srid: number) {
    const point = new Point(x, y, z, undefined, srid);
    point.hasZ = true;
    return point;
  };

  public static M(x: number, y: number, m: number, srid: number) {
    const point = new Point(x, y, undefined, m, srid);
    point.hasM = true;
    return point;
  };

  public static ZM(x: number, y: number, z: number, m: number, srid: number) {
    const point = new Point(x, y, z, m, srid);
    point.hasZ = true;
    point.hasM = true;
    return point;
  };

  //#region Static parsers

  public static parseWkt(reader: WktParser, options: WKTParseOptions): Point {
    const point = new Point();
    point.srid = options.srid;
    point.hasZ = options.hasZ;
    point.hasM = options.hasM;

    if (reader.isMatch(['EMPTY']))
      return point;

    reader.expectGroupStart();

    [point.x, point.y, point.z, point.m] = reader.matchCoordinate(options);

    reader.expectGroupEnd();

    return point;
  }

  public static parseWkb(reader: BinaryReader, options: WKBParseOptions): Point {
    const point = Point.readWkbPoint(reader, options);
    point.srid = options.srid;
    return point;
  }

  public static readWkbPoint(reader: BinaryReader, options: WKBParseOptions) {
    return new Point(reader.readDouble(), reader.readDouble(),
      options.hasZ ? reader.readDouble() : undefined,
      options.hasM ? reader.readDouble() : undefined);
  };

  public static parseTwkb(reader: BinaryReader, options: TWKBParseOptions): Point {
    const point = new Point();
    point.hasZ = options.hasZ;
    point.hasM = options.hasM;

    if (options.isEmpty)
      return point;

    point.x = decode(reader.readVarInt()) / options.precisionFactor;
    point.y = decode(reader.readVarInt()) / options.precisionFactor;
    point.z = options.hasZ ? decode(reader.readVarInt()) / options.zPrecisionFactor : undefined;
    point.m = options.hasM ? decode(reader.readVarInt()) / options.mPrecisionFactor : undefined;

    return point;
  }

  public static readTwkbPoint(reader: BinaryReader, options: TWKBParseOptions, previousPoint: Point): Point {
    previousPoint.x! += decode(reader.readVarInt()) / options.precisionFactor;
    previousPoint.y! += decode(reader.readVarInt()) / options.precisionFactor;

    if (options.hasZ)
      previousPoint.z! += decode(reader.readVarInt()) / options.zPrecisionFactor;
    if (options.hasM)
      previousPoint.m! += decode(reader.readVarInt()) / options.mPrecisionFactor;

    return new Point(previousPoint.x, previousPoint.y, previousPoint.z, previousPoint.m);
  }

  //#endregion

  public toWkt(): string {
    if (this.x === undefined && this.y === undefined && this.z === undefined && this.m === undefined)
      return this.getWktType(Types.wkt.Point, true);

    return this.getWktType(Types.wkt.Point, false) + '(' + this.getWktCoordinate() + ')';
  }

  public toWkb(options?: WKBExportOptions): ArrayBuffer {
    var wkb = new BinaryWriter(this.getWkbSize(), false);

    wkb.writeInt8(1);
    wkb.writeUInt32(this.getWkbType(Types.wkb.Point, options));

    if (this.x === undefined && this.y === undefined) {
      wkb.writeDouble(NaN);
      wkb.writeDouble(NaN);

      if (this.hasZ)
        wkb.writeDouble(NaN);
      if (this.hasM)
        wkb.writeDouble(NaN);
    }
    else {
      this.writeWkbPoint(wkb);
    }

    return wkb.buffer.buffer;
  }

  public writeWkbPoint(writer: BinaryWriter) {
    writer.writeDouble(this.x!);
    writer.writeDouble(this.y!);

    if (this.hasZ)
      writer.writeDouble(this.z!);
    if (this.hasM)
      writer.writeDouble(this.m!);
  };

  public toTwkb(): ArrayBuffer {
    const writer = new BinaryWriter(0, true);

    const precision = GeometryBase.getTwkbPrecision(5, 0, 0);
    const isEmpty = this.x === undefined && this.y === undefined;

    this.writeTwkbHeader(writer, Types.wkb.Point, precision, isEmpty);

    if (!isEmpty)
      this.writeTwkbPoint(writer, precision, new Point(0, 0, 0, 0));

    return writer.buffer.buffer;
  }

  public writeTwkbPoint(writer: BinaryWriter, precision: Precision, previousPoint: Point): void {
    const x = this.x! * precision.xyFactor;
    const y = this.y! * precision.xyFactor;
    const z = this.z! * precision.zFactor;
    const m = this.m! * precision.mFactor;

    writer.writeVarInt(encode(x - previousPoint.x!));
    writer.writeVarInt(encode(y - previousPoint.y!));
    if (this.hasZ)
      writer.writeVarInt(encode(z - previousPoint.z!));
    if (this.hasM)
      writer.writeVarInt(encode(m - previousPoint.m!));

    previousPoint.x = x;
    previousPoint.y = y;
    previousPoint.z = z;
    previousPoint.m = m;
  }

  public getWkbSize(): number {
    let size = 1 + 4 + 8 + 8;

    if (this.hasZ)
      size += 8;
    if (this.hasM)
      size += 8;

    return size;
  }

  //#region Public Methods 

  public getWktCoordinate(): string {
    var coordinates = this.x + ' ' + this.y;

    if (this.hasZ)
      coordinates += ' ' + this.z;
    if (this.hasM)
      coordinates += ' ' + this.m;

    return coordinates;
  }

  //#endregion
}
