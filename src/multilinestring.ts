import { TWKBParseOptions, Types, WKBExportOptions, WKBParseOptions, WKTParseOptions } from "./types";
import { Point } from "./point";
import { LineString } from "./linestring";
import { BinaryReader } from "./binaryreader";
import { BinaryWriter } from "./binarywriter";
import { WktParser } from "./wktparser";
import { GeometryBase } from "./base";
import { Parser } from "./parser";

export class MultiLineString extends GeometryBase {
  public lineStrings: LineString[];

  constructor(lineStrings?: LineString[], srid?: number) {
    super();

    this.lineStrings = lineStrings || [];
    this.srid = srid;

    if (this.lineStrings.length > 0) {
      this.hasZ = this.lineStrings[0].hasZ;
      this.hasM = this.lineStrings[0].hasM;
    }
  }

  public static Z(lineStrings: LineString[], srid: number) {
    const multiLineString = new MultiLineString(lineStrings, srid);
    multiLineString.hasZ = true;
    return multiLineString;
  };

  public static M(lineStrings: LineString[], srid: number) {
    const multiLineString = new MultiLineString(lineStrings, srid);
    multiLineString.hasM = true;
    return multiLineString;
  };

  public static ZM(lineStrings: LineString[], srid: number) {
    const multiLineString = new MultiLineString(lineStrings, srid);
    multiLineString.hasZ = true;
    multiLineString.hasM = true;
    return multiLineString;
  };

  public static parseWkt(reader: WktParser, options: WKTParseOptions): MultiLineString {
    var multiLineString = new MultiLineString();
    multiLineString.srid = options.srid;
    multiLineString.hasZ = options.hasZ;
    multiLineString.hasM = options.hasM;

    if (reader.isMatch(['EMPTY']))
      return multiLineString;

    reader.expectGroupStart();

    do {
      reader.expectGroupStart();
      multiLineString.lineStrings.push(new LineString(reader.matchCoordinates(options).map(x => new Point(x[0], x[1], x[2], x[3]))));
      reader.expectGroupEnd();
    } while (reader.isMatch([',']));

    reader.expectGroupEnd();

    return multiLineString;
  };

  public static parseWkb(reader: BinaryReader, options: WKBParseOptions): MultiLineString {
    var multiLineString = new MultiLineString();
    multiLineString.srid = options.srid;
    multiLineString.hasZ = options.hasZ;
    multiLineString.hasM = options.hasM;

    var lineStringCount = reader.readUInt32();

    for (var i = 0; i < lineStringCount; i++)
      multiLineString.lineStrings.push(Parser.parse(reader, options) as LineString);

    return multiLineString;
  };

  public static parseTwkb(reader: BinaryReader, options: TWKBParseOptions): MultiLineString {
    const multiLineString = new MultiLineString();
    multiLineString.hasZ = options.hasZ;
    multiLineString.hasM = options.hasM;

    if (options.isEmpty)
      return multiLineString;

    const previousPoint = new Point(0, 0, options.hasZ ? 0 : undefined, options.hasM ? 0 : undefined);
    const lineStringCount = reader.readVarInt();

    for (var i = 0; i < lineStringCount; i++) {
      const lineString = new LineString();
      lineString.hasZ = options.hasZ;
      lineString.hasM = options.hasM;

      const pointCount = reader.readVarInt();

      for (var j = 0; j < pointCount; j++)
        lineString.points.push(Point.readTwkbPoint(reader, options, previousPoint));

      multiLineString.lineStrings.push(lineString);
    }

    return multiLineString;
  }

  public toWkt(): string {
    if (this.lineStrings.length === 0)
      return this.getWktType(Types.wkt.MultiLineString, true);

    var wkt = this.getWktType(Types.wkt.MultiLineString, false) + '(';

    for (var i = 0; i < this.lineStrings.length; i++)
      wkt += this.lineStrings[i]._toInnerWkt() + ',';

    wkt = wkt.slice(0, -1);
    wkt += ')';

    return wkt;
  };

  public toWkb(options?: WKBExportOptions): ArrayBuffer {
    var wkb = new BinaryWriter(this.getWkbSize(), false);

    wkb.writeInt8(1);

    wkb.writeUInt32(this.getWkbType(Types.wkb.MultiLineString, options));
    wkb.writeUInt32(this.lineStrings.length);

    for (var i = 0; i < this.lineStrings.length; i++)
      wkb.writeBuffer(this.lineStrings[i].toWkb({ srid: this.srid }));

    return wkb.buffer.buffer;
  };

  public toTwkb(): ArrayBuffer {
    const writer = new BinaryWriter(0, true);

    const precision = GeometryBase.getTwkbPrecision(5, 0, 0);
    const isEmpty = this.lineStrings.length === 0;

    this.writeTwkbHeader(writer, Types.wkb.MultiLineString, precision, isEmpty);

    if (this.lineStrings.length > 0) {
      writer.writeVarInt(this.lineStrings.length);

      const previousPoint = new Point(0, 0, 0, 0);
      for (let i = 0; i < this.lineStrings.length; i++) {
        writer.writeVarInt(this.lineStrings[i].points.length);

        for (var j = 0; j < this.lineStrings[i].points.length; j++)
          this.lineStrings[i].points[j].writeTwkbPoint(writer, precision, previousPoint);
      }
    }

    return writer.buffer.buffer;
  }

  public getWkbSize(): number {
    var size = 1 + 4 + 4;

    for (var i = 0; i < this.lineStrings.length; i++)
      size += this.lineStrings[i].getWkbSize();

    return size;
  };
}
