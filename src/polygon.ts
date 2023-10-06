import { TWKBParseOptions, Types, WKBExportOptions, WKBParseOptions, WKTParseOptions } from './types';
import { Point } from './point';
import { BinaryWriter } from './binarywriter';
import { WktParser } from './wktparser';
import { BinaryReader } from './binaryreader';
import { GeometryBase } from './base';

export class Polygon extends GeometryBase {
  public exteriorRing: Point[];
  public interiorRings: Point[][];

  constructor(exteriorRing?: Point[], interiorRings?: Point[][], srid?: number) {
    super();

    this.exteriorRing = exteriorRing || [];
    this.interiorRings = interiorRings || [];
    this.srid = srid;

    if (this.exteriorRing.length > 0) {
      this.hasZ = this.exteriorRing[0].hasZ;
      this.hasM = this.exteriorRing[0].hasM;
    }
  }

  public static Z = function (exteriorRing: Point[], interiorRings: Point[][], srid: number) {
    const polygon = new Polygon(exteriorRing, interiorRings, srid);
    polygon.hasZ = true;
    return polygon;
  };

  public static M(exteriorRing: Point[], interiorRings: Point[][], srid: number) {
    const polygon = new Polygon(exteriorRing, interiorRings, srid);
    polygon.hasM = true;
    return polygon;
  };

  public static ZM(exteriorRing: Point[], interiorRings: Point[][], srid: number) {
    const polygon = new Polygon(exteriorRing, interiorRings, srid);
    polygon.hasZ = true;
    polygon.hasM = true;
    return polygon;
  };

  public static parseWkt(reader: WktParser, options: WKTParseOptions): Polygon {
    let polygon = new Polygon();
    polygon.srid = options.srid;
    polygon.hasZ = options.hasZ;
    polygon.hasM = options.hasM;

    if (reader.isMatch(['EMPTY']))
      return polygon;

    reader.expectGroupStart();

    reader.expectGroupStart();
    polygon.exteriorRing = reader.matchCoordinates(options).map(x => new Point(x[0], x[1], x[2], x[3]));
    reader.expectGroupEnd();

    while (reader.isMatch([','])) {
      reader.expectGroupStart();
      polygon.interiorRings.push(reader.matchCoordinates(options).map(x => new Point(x[0], x[1], x[2], x[3])));
      reader.expectGroupEnd();
    }

    reader.expectGroupEnd();

    return polygon;
  }

  public static parseWkb(reader: BinaryReader, options: WKBParseOptions): Polygon {
    var polygon = new Polygon();
    polygon.srid = options.srid;
    polygon.hasZ = options.hasZ;
    polygon.hasM = options.hasM;

    var ringCount = reader.readUInt32();

    if (ringCount > 0) {
      var exteriorRingCount = reader.readUInt32();

      for (var i = 0; i < exteriorRingCount; i++)
        polygon.exteriorRing.push(Point.readWkbPoint(reader, options));

      for (i = 1; i < ringCount; i++) {
        var interiorRing: Point[] = [];

        var interiorRingCount = reader.readUInt32();

        for (var j = 0; j < interiorRingCount; j++)
          interiorRing.push(Point.readWkbPoint(reader, options));

        polygon.interiorRings.push(interiorRing);
      }
    }

    return polygon;
  };

  public static parseTwkb(reader: BinaryReader, options: TWKBParseOptions): Polygon {
    const polygon = new Polygon();
    polygon.hasZ = options.hasZ;
    polygon.hasM = options.hasM;

    if (options.isEmpty)
      return polygon;

    const previousPoint = new Point(0, 0, options.hasZ ? 0 : undefined, options.hasM ? 0 : undefined);
    const ringCount = reader.readVarInt();
    const exteriorRingCount = reader.readVarInt();

    for (let i = 0; i < exteriorRingCount; i++)
      polygon.exteriorRing.push(Point.readTwkbPoint(reader, options, previousPoint));

    for (let i = 1; i < ringCount; i++) {
      const interiorRing = [];

      const interiorRingCount = reader.readVarInt();

      for (let j = 0; j < interiorRingCount; j++)
        interiorRing.push(Point.readTwkbPoint(reader, options, previousPoint));

      polygon.interiorRings.push(interiorRing);
    }

    return polygon;
  }

  public toWkt(): string {
    if (this.exteriorRing.length === 0)
      return this.getWktType(Types.wkt.Polygon, true);

    return this.getWktType(Types.wkt.Polygon, false) + this._toInnerWkt();
  };

  public _toInnerWkt(): string {
    var innerWkt = '((';

    for (var i = 0; i < this.exteriorRing.length; i++)
      innerWkt += this.exteriorRing[i].getWktCoordinate() + ',';

    innerWkt = innerWkt.slice(0, -1);
    innerWkt += ')';

    for (i = 0; i < this.interiorRings.length; i++) {
      innerWkt += ',(';

      for (var j = 0; j < this.interiorRings[i].length; j++) {
        innerWkt += this.interiorRings[i][j].getWktCoordinate() + ',';
      }

      innerWkt = innerWkt.slice(0, -1);
      innerWkt += ')';
    }

    innerWkt += ')';

    return innerWkt;
  };

  public toWkb(options?: WKBExportOptions): ArrayBuffer {
    var writer = new BinaryWriter(this.getWkbSize());

    writer.writeInt8(1);
    writer.writeUInt32(this.getWkbType(Types.wkb.Polygon, options));

    if (this.exteriorRing.length > 0) {
      writer.writeUInt32(1 + this.interiorRings.length);
      writer.writeUInt32(this.exteriorRing.length);
    }
    else {
      writer.writeUInt32(0);
    }

    for (let i = 0; i < this.exteriorRing.length; i++)
      this.exteriorRing[i].writeWkbPoint(writer);

    for (let i = 0; i < this.interiorRings.length; i++) {
      writer.writeUInt32(this.interiorRings[i].length);

      for (let j = 0; j < this.interiorRings[i].length; j++)
      this.interiorRings[i][j].writeWkbPoint(writer);
    }

    return writer.buffer.buffer;
  };

  public toTwkb(): ArrayBuffer {
    const writer = new BinaryWriter(0, true);

    const precision = GeometryBase.getTwkbPrecision(5, 0, 0);
    const isEmpty = this.exteriorRing.length === 0;

    this.writeTwkbHeader(writer, Types.wkb.Polygon, precision, isEmpty);

    if (this.exteriorRing.length > 0) {
      writer.writeVarInt(1 + this.interiorRings.length);

      writer.writeVarInt(this.exteriorRing.length);

      const previousPoint = new Point(0, 0, 0, 0);
      for (let i = 0; i < this.exteriorRing.length; i++)
        this.exteriorRing[i].writeTwkbPoint(writer, precision, previousPoint);

      for (let i = 0; i < this.interiorRings.length; i++) {
        writer.writeVarInt(this.interiorRings[i].length);

        for (let j = 0; j < this.interiorRings[i].length; j++)
          this.interiorRings[i][j].writeTwkbPoint(writer, precision, previousPoint);
      }
    }

    return writer.buffer.buffer;
  }

  public getWkbSize(): number {
    var coordinateSize = 16;

    if (this.hasZ)
      coordinateSize += 8;
    if (this.hasM)
      coordinateSize += 8;

    var size = 1 + 4 + 4;

    if (this.exteriorRing.length > 0)
      size += 4 + (this.exteriorRing.length * coordinateSize);

    for (var i = 0; i < this.interiorRings.length; i++)
      size += 4 + (this.interiorRings[i].length * coordinateSize);

    return size;
  };
}
