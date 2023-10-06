import { TWKBParseOptions, Types, WKBExportOptions, WKBParseOptions, WKTParseOptions } from "./types";
import { Point } from "./point";
import { Polygon } from "./polygon";
import { BinaryWriter } from "./binarywriter";
import { BinaryReader } from "./binaryreader";
import { WktParser } from "./wktparser";
import { GeometryBase } from "./base";
import { Parser } from "./parser";

export class MultiPolygon extends GeometryBase {
  public polygons: Polygon[];

  constructor(polygons?: Polygon[], srid?: number) {
    super();

    this.polygons = polygons || [];
    this.srid = srid;

    if (this.polygons.length > 0) {
      this.hasZ = this.polygons[0].hasZ;
      this.hasM = this.polygons[0].hasM;
    }
  }

  public static Z(polygons: Polygon[], srid: number) {
    const multiPolygon = new MultiPolygon(polygons, srid);
    multiPolygon.hasZ = true;
    return multiPolygon;
  };

  public static M(polygons: Polygon[], srid: number) {
    const multiPolygon = new MultiPolygon(polygons, srid);
    multiPolygon.hasM = true;
    return multiPolygon;
  };

  public static ZM(polygons: Polygon[], srid: number) {
    const multiPolygon = new MultiPolygon(polygons, srid);
    multiPolygon.hasZ = true;
    multiPolygon.hasM = true;
    return multiPolygon;
  };

  public static parseWkt(reader: WktParser, options: WKTParseOptions): MultiPolygon {
    var multiPolygon = new MultiPolygon();
    multiPolygon.srid = options.srid;
    multiPolygon.hasZ = options.hasZ;
    multiPolygon.hasM = options.hasM;

    if (reader.isMatch(['EMPTY']))
      return multiPolygon;

    reader.expectGroupStart();

    do {
      reader.expectGroupStart();

      var exteriorRing: Point[] = [];
      var interiorRings: Point[][] = [];

      reader.expectGroupStart();
      exteriorRing = reader.matchCoordinates(options).map(x => new Point(x[0], x[1], x[2], x[3]));
      reader.expectGroupEnd();

      while (reader.isMatch([','])) {
        reader.expectGroupStart();
        interiorRings.push(reader.matchCoordinates(options).map(x => new Point(x[0], x[1], x[2], x[3])));
        reader.expectGroupEnd();
      }

      multiPolygon.polygons.push(new Polygon(exteriorRing, interiorRings));

      reader.expectGroupEnd();

    } while (reader.isMatch([',']));

    reader.expectGroupEnd();

    return multiPolygon;
  };

  public static parseWkb(reader: BinaryReader, options: WKBParseOptions): MultiPolygon {
    const multiPolygon = new MultiPolygon();
    multiPolygon.srid = options.srid;
    multiPolygon.hasZ = options.hasZ;
    multiPolygon.hasM = options.hasM;

    var polygonCount = reader.readUInt32();

    for (var i = 0; i < polygonCount; i++)
      multiPolygon.polygons.push(Parser.parse(reader, options) as Polygon);

    return multiPolygon;
  };

  public static parseTwkb(reader: BinaryReader, options: TWKBParseOptions): MultiPolygon {
    const multiPolygon = new MultiPolygon();
    multiPolygon.hasZ = options.hasZ;
    multiPolygon.hasM = options.hasM;

    if (options.isEmpty)
      return multiPolygon;

    const previousPoint = new Point(0, 0, options.hasZ ? 0 : undefined, options.hasM ? 0 : undefined);
    const polygonCount = reader.readVarInt();

    for (let i = 0; i < polygonCount; i++) {
      const polygon = new Polygon();
      polygon.hasZ = options.hasZ;
      polygon.hasM = options.hasM;

      const ringCount = reader.readVarInt();
      const exteriorRingCount = reader.readVarInt();

      for (let j = 0; j < exteriorRingCount; j++)
        polygon.exteriorRing.push(Point.readTwkbPoint(reader, options, previousPoint));

      for (let j = 1; j < ringCount; j++) {
        const interiorRing = [];

        const interiorRingCount = reader.readVarInt();

        for (let k = 0; k < interiorRingCount; k++)
          interiorRing.push(Point.readTwkbPoint(reader, options, previousPoint));

        polygon.interiorRings.push(interiorRing);
      }

      multiPolygon.polygons.push(polygon);
    }

    return multiPolygon;
  }

  public toWkt(): string {
    if (this.polygons.length === 0)
      return this.getWktType(Types.wkt.MultiPolygon, true);

    var wkt = this.getWktType(Types.wkt.MultiPolygon, false) + '(';

    for (var i = 0; i < this.polygons.length; i++)
      wkt += this.polygons[i]._toInnerWkt() + ',';

    wkt = wkt.slice(0, -1);
    wkt += ')';

    return wkt;
  };

  public toWkb(options?: WKBExportOptions): ArrayBuffer {
    var wkb = new BinaryWriter(this.getWkbSize(), false);

    wkb.writeInt8(1);
    wkb.writeUInt32(this.getWkbType(Types.wkb.MultiPolygon, options), true);
    wkb.writeUInt32(this.polygons.length);

    for (var i = 0; i < this.polygons.length; i++)
      wkb.writeBuffer(this.polygons[i].toWkb({ srid: this.srid }));

    return wkb.buffer.buffer;
  };

  public toTwkb(): ArrayBuffer {
    const writer = new BinaryWriter(0, true);

    const precision = GeometryBase.getTwkbPrecision(5, 0, 0);
    const isEmpty = this.polygons.length === 0;

    this.writeTwkbHeader(writer, Types.wkb.MultiPolygon, precision, isEmpty);

    if (this.polygons.length > 0) {
      writer.writeVarInt(this.polygons.length);

      const previousPoint = new Point(0, 0, 0, 0);
      for (let i = 0; i < this.polygons.length; i++) {
        writer.writeVarInt(1 + this.polygons[i].interiorRings.length);

        writer.writeVarInt(this.polygons[i].exteriorRing.length);

        for (let j = 0; j < this.polygons[i].exteriorRing.length; j++)
          this.polygons[i].exteriorRing[j].writeTwkbPoint(writer, precision, previousPoint);

        for (let j = 0; j < this.polygons[i].interiorRings.length; j++) {
          writer.writeVarInt(this.polygons[i].interiorRings[j].length);

          for (let k = 0; k < this.polygons[i].interiorRings[j].length; k++)
            this.polygons[i].interiorRings[j][k].writeTwkbPoint(writer, precision, previousPoint);
        }
      }
    }

    return writer.buffer.buffer;
  }

  public getWkbSize(): number {
    var size = 1 + 4 + 4;

    for (var i = 0; i < this.polygons.length; i++)
      size += this.polygons[i].getWkbSize();

    return size;
  };
}
