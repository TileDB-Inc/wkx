import { TWKBParseOptions, Types, WKBExportOptions, WKBParseOptions, WKTParseOptions } from './types';
import { Point } from './point';
import { BinaryReader } from './binaryreader';
import { BinaryWriter } from './binarywriter';
import { WktParser } from './wktparser';
import { GeometryBase } from './base';

export class LineString extends GeometryBase {
  public points: Point[];

  constructor(points?: Point[], srid?: number) {
    super();

    this.points = points || [];
    this.srid = srid;

    if (this.points.length > 0) {
      this.hasZ = this.points[0].hasZ;
      this.hasM = this.points[0].hasM;
    }
  }

  public static Z(points: Point[], srid: number) {
    const lineString = new LineString(points, srid);
    lineString.hasZ = true;
    return lineString;
  };

  public static M(points: Point[], srid: number) {
    const lineString = new LineString(points, srid);
    lineString.hasM = true;
    return lineString;
  };

  public static ZM(points: Point[], srid: number) {
    const lineString = new LineString(points, srid);
    lineString.hasZ = true;
    lineString.hasM = true;
    return lineString;
  };

  public static parseWkt(reader: WktParser, options: WKTParseOptions): LineString {
    const lineString = new LineString();
    lineString.srid = options.srid;
    lineString.hasZ = options.hasZ;
    lineString.hasM = options.hasM;

    if (reader.isMatch(['EMPTY']))
      return lineString;

    reader.expectGroupStart();
    lineString.points = reader.matchCoordinates(options).map(x => new Point(x[0], x[1], x[2], x[3]));
    reader.expectGroupEnd();

    return lineString;
  };

  public static parseWkb(reader: BinaryReader, options: WKBParseOptions): LineString {
    const lineString = new LineString();
    lineString.srid = options.srid;
    lineString.hasZ = options.hasZ;
    lineString.hasM = options.hasM;

    var pointCount = reader.readUInt32();

    for (var i = 0; i < pointCount; i++)
      lineString.points.push(Point.readWkbPoint(reader, options));

    return lineString;
  };

  public static parseTwkb(reader: BinaryReader, options: TWKBParseOptions): LineString {
    const lineString = new LineString();
    lineString.hasZ = options.hasZ;
    lineString.hasM = options.hasM;

    if (options.isEmpty)
      return lineString;

    const previousPoint = new Point(0, 0, options.hasZ ? 0 : undefined, options.hasM ? 0 : undefined);
    const pointCount = reader.readVarInt();

    for (var i = 0; i < pointCount; i++)
      lineString.points.push(Point.readTwkbPoint(reader, options, previousPoint));

    return lineString;
  }

  public toWkt(): string {
    if (this.points.length === 0)
      return this.getWktType(Types.wkt.LineString, true);

    return this.getWktType(Types.wkt.LineString, false) + this._toInnerWkt();
  };

  public _toInnerWkt(): string {
    var innerWkt = '(';

    for (var i = 0; i < this.points.length; i++)
      innerWkt += this.points[i].getWktCoordinate() + ',';

    innerWkt = innerWkt.slice(0, -1);
    innerWkt += ')';

    return innerWkt;
  };

  public toWkb(options?: WKBExportOptions): ArrayBuffer {
    var writer = new BinaryWriter(this.getWkbSize(), false);

    writer.writeInt8(1);
    writer.writeUInt32(this.getWkbType(Types.wkb.LineString, options));
    writer.writeUInt32(this.points.length);

    for (let i = 0; i < this.points.length; i++)
      this.points[i].writeWkbPoint(writer);

    return writer.buffer.buffer;
  };

  public toTwkb(): ArrayBuffer {
    const writer = new BinaryWriter(0, true);

    const precision = GeometryBase.getTwkbPrecision(5, 0, 0);
    const isEmpty = this.points.length === 0;

    this.writeTwkbHeader(writer, Types.wkb.LineString, precision, isEmpty);

    if (this.points.length > 0) {
      writer.writeVarInt(this.points.length);

      var previousPoint = new Point(0, 0, 0, 0);
      for (var i = 0; i < this.points.length; i++)
        this.points[i].writeTwkbPoint(writer, precision, previousPoint);
    }

    return writer.buffer.buffer;
  }

  public getWkbSize(): number {
    let coordinateSize = 16;

    if (this.hasZ)
      coordinateSize += 8;
    if (this.hasM)
      coordinateSize += 8;

    return 1 + 4 + 4 + (this.points.length * coordinateSize);
  };
}
