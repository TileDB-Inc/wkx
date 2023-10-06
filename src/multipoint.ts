import { TWKBParseOptions, Types, WKBExportOptions, WKBParseOptions, WKTParseOptions } from './types';
import { Point } from './point';
import { BinaryReader } from './binaryreader';
import { BinaryWriter } from './binarywriter';
import { WktParser } from './wktparser';
import { GeometryBase } from './base';
import { Parser } from './parser';

export class MultiPoint extends GeometryBase {
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
    const multiPoint = new MultiPoint(points, srid);
    multiPoint.hasZ = true;
    return multiPoint;
  };

  public static M(points: Point[], srid: number) {
    const multiPoint = new MultiPoint(points, srid);
    multiPoint.hasM = true;
    return multiPoint;
  };

  public static ZM(points: Point[], srid: number) {
    const multiPoint = new MultiPoint(points, srid);
    multiPoint.hasZ = true;
    multiPoint.hasM = true;
    return multiPoint;
  };

  public static parseWkt(reader: WktParser, options: WKTParseOptions): MultiPoint {
    let multiPoint = new MultiPoint();
    multiPoint.srid = options.srid;
    multiPoint.hasZ = options.hasZ;
    multiPoint.hasM = options.hasM;

    if (reader.isMatch(['EMPTY']))
      return multiPoint;

    reader.expectGroupStart();
    multiPoint.points = reader.matchCoordinates(options).map(x => new Point(x[0], x[1], x[2], x[3]));
    reader.expectGroupEnd();

    return multiPoint;
  };

  public static parseWkb(reader: BinaryReader, options: WKBParseOptions): MultiPoint {
    let multiPoint = new MultiPoint();
    multiPoint.srid = options.srid;
    multiPoint.hasZ = options.hasZ;
    multiPoint.hasM = options.hasM;

    const pointCount = reader.readUInt32();

    for (var i = 0; i < pointCount; i++)
      multiPoint.points.push(Parser.parse(reader, options) as Point);

    return multiPoint;
  };

  public static parseTwkb(reader: BinaryReader, options: TWKBParseOptions): MultiPoint {
    const multiPoint = new MultiPoint();
    multiPoint.hasZ = options.hasZ;
    multiPoint.hasM = options.hasM;

    if (options.isEmpty) return multiPoint;

    const previousPoint = new Point(0, 0, options.hasZ ? 0 : undefined, options.hasM ? 0 : undefined);
    const pointCount = reader.readVarInt();

    for (var i = 0; i < pointCount; i++)
      multiPoint.points.push(Point.readTwkbPoint(reader, options, previousPoint));

    return multiPoint;
  }

  public toWkt(): string {
    if (this.points.length === 0)
      return this.getWktType(Types.wkt.MultiPoint, true);

    var wkt = this.getWktType(Types.wkt.MultiPoint, false) + '(';

    for (var i = 0; i < this.points.length; i++)
      wkt += this.points[i].getWktCoordinate() + ',';

    wkt = wkt.slice(0, -1);
    wkt += ')';

    return wkt;
  };

  public toWkb(options?: WKBExportOptions): ArrayBuffer {
    var wkb = new BinaryWriter(this.getWkbSize(), false);

    wkb.writeInt8(1);
    wkb.writeUInt32(this.getWkbType(Types.wkb.MultiPoint, options), true);
    wkb.writeUInt32(this.points.length);

    for (var i = 0; i < this.points.length; i++)
      wkb.writeBuffer(this.points[i].toWkb({ srid: this.srid }));

    return wkb.buffer.buffer;
  };

  public toTwkb(): ArrayBuffer {
    const writer = new BinaryWriter(0, true);

    const precision = GeometryBase.getTwkbPrecision(5, 0, 0);
    const isEmpty = this.points.length === 0;

    this.writeTwkbHeader(writer, Types.wkb.MultiPoint, precision, isEmpty);

    if (this.points.length > 0) {
      writer.writeVarInt(this.points.length);

      const previousPoint = new Point(0, 0, 0, 0);
      for (let i = 0; i < this.points.length; i++)
        this.points[i].writeTwkbPoint(writer, precision, previousPoint);
    }

    return writer.buffer.buffer;
  };

  public getWkbSize(): number {
    var coordinateSize = 16;

    if (this.hasZ)
      coordinateSize += 8;
    if (this.hasM)
      coordinateSize += 8;

    coordinateSize += 5;

    return 1 + 4 + 4 + (this.points.length * coordinateSize);
  };
}
