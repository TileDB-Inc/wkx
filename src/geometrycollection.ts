import { TWKBParseOptions, Types, WKBExportOptions, WKBParseOptions, WKTParseOptions } from './types';
import { BinaryWriter } from './binarywriter';
import { BinaryReader } from './binaryreader';
import { WktParser } from './wktparser';
import { GeometryBase } from './base';
import { Parser } from './parser';

export class GeometryCollection extends GeometryBase {
  public geometries: GeometryBase[];

  constructor(geometries?: GeometryBase[], srid?: number) {
    super();

    this.geometries = geometries || [];
    this.srid = srid;

    if (this.geometries.length > 0) {
      this.hasZ = this.geometries[0].hasZ;
      this.hasM = this.geometries[0].hasM;
    }
  }

  public static Z(geometries: GeometryBase[], srid: number) {
    const geometryCollection = new GeometryCollection(geometries, srid);
    geometryCollection.hasZ = true;
    return geometryCollection;
  };

  public static M(geometries: GeometryBase[], srid: number) {
    const geometryCollection = new GeometryCollection(geometries, srid);
    geometryCollection.hasM = true;
    return geometryCollection;
  };

  public static ZM(geometries: GeometryBase[], srid: number) {
    const geometryCollection = new GeometryCollection(geometries, srid);
    geometryCollection.hasZ = true;
    geometryCollection.hasM = true;
    return geometryCollection;
  };

  public static parseWkt(reader: WktParser, options: WKTParseOptions): GeometryCollection {
    var geometryCollection = new GeometryCollection();
    geometryCollection.srid = options.srid;
    geometryCollection.hasZ = options.hasZ;
    geometryCollection.hasM = options.hasM;

    if (reader.isMatch(['EMPTY']))
      return geometryCollection;

    reader.expectGroupStart();

    do {
      geometryCollection.geometries.push(Parser.parse(reader));
    } while (reader.isMatch([',']));

    reader.expectGroupEnd();

    return geometryCollection;
  }

  public static parseWkb(reader: BinaryReader, options: WKBParseOptions): GeometryCollection {
    var geometryCollection = new GeometryCollection();
    geometryCollection.srid = options.srid;
    geometryCollection.hasZ = options.hasZ;
    geometryCollection.hasM = options.hasM;

    var geometryCount = reader.readUInt32();

    for (var i = 0; i < geometryCount; i++)
      geometryCollection.geometries.push(Parser.parse(reader, options));

    return geometryCollection;
  }

  public static parseTwkb(reader: BinaryReader, options: TWKBParseOptions): GeometryCollection {
    const geometryCollection = new GeometryCollection();
    geometryCollection.hasZ = options.hasZ;
    geometryCollection.hasM = options.hasM;

    if (options.isEmpty)
      return geometryCollection;

    var geometryCount = reader.readVarInt();

    for (var i = 0; i < geometryCount; i++)
      geometryCollection.geometries.push(Parser.parseTwkb(reader));

    return geometryCollection;
  }

  public toWkt(): string {
    if (this.geometries.length === 0)
      return this.getWktType(Types.wkt.GeometryCollection, true);

    var wkt = this.getWktType(Types.wkt.GeometryCollection, false) + '(';

    for (var i = 0; i < this.geometries.length; i++)
      wkt += this.geometries[i].toWkt() + ',';

    wkt = wkt.slice(0, -1);
    wkt += ')';

    return wkt;
  };

  public toWkb(options?: WKBExportOptions): ArrayBuffer {
    const wkb = new BinaryWriter(this.getWkbSize(), false);

    wkb.writeInt8(1);
    wkb.writeUInt32(this.getWkbType(Types.wkb.GeometryCollection, options));
    wkb.writeUInt32(this.geometries.length);

    for (var i = 0; i < this.geometries.length; i++)
      wkb.writeBuffer(this.geometries[i].toWkb({ srid: this.srid }));

    return wkb.buffer.buffer;
  };

  public toTwkb(): ArrayBuffer {
    const writer = new BinaryWriter(0, true);

    const precision = GeometryBase.getTwkbPrecision(5, 0, 0);
    const isEmpty = this.geometries.length === 0;

    this.writeTwkbHeader(writer, Types.wkb.GeometryCollection, precision, isEmpty);

    if (this.geometries.length > 0) {
      writer.writeVarInt(this.geometries.length);

      for (let i = 0; i < this.geometries.length; i++)
        writer.writeBuffer(this.geometries[i].toTwkb());
    }

    return writer.buffer.buffer;
  }

  public getWkbSize(): number {
    let size = 1 + 4 + 4;

    for (let i = 0; i < this.geometries.length; i++)
      size += this.geometries[i].getWkbSize();

    return size;
  };
}
