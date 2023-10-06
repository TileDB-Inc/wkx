import { BinaryReader } from "./binaryreader";
import { WktParser } from "./wktparser";
import { TWKBParseOptions, Types, WKBParseOptions, WKTParseOptions } from "./types";
import { Point } from "./point";
import { Polygon } from "./polygon";
import { MultiPoint } from './multipoint';
import { MultiPolygon } from './multipolygon';
import { LineString } from './linestring';
import { MultiLineString } from './multilinestring';
import { GeometryCollection } from './geometrycollection';
import { GeometryBase } from "./base";
import { decode } from "./zigzag";

export class Parser {

  public static parse(input: string | DataView | WktParser | BinaryReader, options?: WKBParseOptions): GeometryBase {
    if (typeof input === "string" || input instanceof WktParser) {
      return Parser.parseWkt(input);
    }
    else if (input instanceof DataView || input instanceof BinaryReader) {
      return Parser.parseWkb(input, options);
    }

    throw new Error("first argument must be a string or Buffer");
  }

  public static parseWkt(value: string | WktParser): GeometryBase {
    let srid: number | undefined;
    const wktParser = value instanceof WktParser ? value : new WktParser(value);

    var match = wktParser.matchRegex([/^SRID=(\d+);/]);
    if (match) srid = parseInt(match[1], 10);

    var geometryType = wktParser.matchType();
    var dimension = wktParser.matchDimension();

    var options: WKTParseOptions = {
      srid: srid,
      hasZ: dimension.hasZ,
      hasM: dimension.hasM,
    };

    switch (geometryType) {
      case Types.wkt.Point:
        return Point.parseWkt(wktParser, options);
      case Types.wkt.LineString:
        return LineString.parseWkt(wktParser, options);
      case Types.wkt.Polygon:
        return Polygon.parseWkt(wktParser, options);
      case Types.wkt.MultiPoint:
        return MultiPoint.parseWkt(wktParser, options);
      case Types.wkt.MultiLineString:
        return MultiLineString.parseWkt(wktParser, options);
      case Types.wkt.MultiPolygon:
        return MultiPolygon.parseWkt(wktParser, options);
      case Types.wkt.GeometryCollection:
        return GeometryCollection.parseWkt(wktParser, options);
      default:
        throw new Error("GeometryType " + geometryType + " not supported");
    }
  }

  public static parseWkb(value: BinaryReader | DataView, parentOptions?: WKBParseOptions): GeometryBase {
    let geometryType: number;
    const options: WKBParseOptions = {} as WKBParseOptions;
    const binaryReader = value instanceof BinaryReader ? value : new BinaryReader(value, true);

    binaryReader.isBigEndian = !binaryReader.readInt8();

    const wkbType = binaryReader.readUInt32();

    options.hasSrid = (wkbType & 0x20000000) === 0x20000000;
    options.isEwkb = Boolean(wkbType & 0x20000000 || wkbType & 0x40000000 || wkbType & 0x80000000);

    if (options.hasSrid) options.srid = binaryReader.readUInt32();

    options.hasZ = false;
    options.hasM = false;

    if (!options.isEwkb && (!parentOptions || !parentOptions.isEwkb)) {
      if (wkbType >= 1000 && wkbType < 2000) {
        options.hasZ = true;
        geometryType = wkbType - 1000;
      } else if (wkbType >= 2000 && wkbType < 3000) {
        options.hasM = true;
        geometryType = wkbType - 2000;
      } else if (wkbType >= 3000 && wkbType < 4000) {
        options.hasZ = true;
        options.hasM = true;
        geometryType = wkbType - 3000;
      } else {
        geometryType = wkbType;
      }
    } else {
      if (wkbType & 0x80000000) options.hasZ = true;
      if (wkbType & 0x40000000) options.hasM = true;

      geometryType = wkbType & 0xf;
    }

    switch (geometryType) {
      case Types.wkb.Point:
        return Point.parseWkb(binaryReader, options);
      case Types.wkb.LineString:
        return LineString.parseWkb(binaryReader, options);
      case Types.wkb.Polygon:
        return Polygon.parseWkb(binaryReader, options);
      case Types.wkb.MultiPoint:
        return MultiPoint.parseWkb(binaryReader, options);
      case Types.wkb.MultiLineString:
        return MultiLineString.parseWkb(binaryReader, options);
      case Types.wkb.MultiPolygon:
        return MultiPolygon.parseWkb(binaryReader, options);
      case Types.wkb.GeometryCollection:
        return GeometryCollection.parseWkb(binaryReader, options);
      default:
        throw new Error("GeometryType " + geometryType + " not supported");
    }
  }

  public static parseTwkb(value: BinaryReader | DataView) {
    const options: TWKBParseOptions = {} as TWKBParseOptions;
    const binaryReader = value instanceof BinaryReader ? value : new BinaryReader(value, true);

    const type = binaryReader.readUInt8();
    const metadataHeader = binaryReader.readUInt8();

    const geometryType = type & 0x0F;
    options.precision = decode(type >> 4);
    options.precisionFactor = Math.pow(10, options.precision);

    options.hasBoundingBox = Boolean(metadataHeader >> 0 & 1);
    options.hasSizeAttribute = Boolean(metadataHeader >> 1 & 1);
    options.hasIdList = Boolean(metadataHeader >> 2 & 1);
    options.hasExtendedPrecision = Boolean(metadataHeader >> 3 & 1);
    options.isEmpty = Boolean(metadataHeader >> 4 & 1);

    if (options.hasExtendedPrecision) {
      const extendedPrecision = binaryReader.readUInt8();
      options.hasZ = (extendedPrecision & 0x01) === 0x01;
      options.hasM = (extendedPrecision & 0x02) === 0x02;

      options.zPrecision = decode((extendedPrecision & 0x1C) >> 2);
      options.zPrecisionFactor = Math.pow(10, options.zPrecision);

      options.mPrecision = decode((extendedPrecision & 0xE0) >> 5);
      options.mPrecisionFactor = Math.pow(10, options.mPrecision);
    }
    else {
      options.hasZ = false;
      options.hasM = false;
    }

    if (options.hasSizeAttribute)
      binaryReader.readVarInt();
    if (options.hasBoundingBox) {
      let dimensions = 2;

      if (options.hasZ)
        dimensions++;
      if (options.hasM)
        dimensions++;

      for (var i = 0; i < dimensions; i++) {
        binaryReader.readVarInt();
        binaryReader.readVarInt();
      }
    }

    switch (geometryType) {
      case Types.wkb.Point:
        return Point.parseTwkb(binaryReader, options);
      case Types.wkb.LineString:
        return LineString.parseTwkb(binaryReader, options);
      case Types.wkb.Polygon:
        return Polygon.parseTwkb(binaryReader, options);
      case Types.wkb.MultiPoint:
        return MultiPoint.parseTwkb(binaryReader, options);
      case Types.wkb.MultiLineString:
        return MultiLineString.parseTwkb(binaryReader, options);
      case Types.wkb.MultiPolygon:
        return MultiPolygon.parseTwkb(binaryReader, options);
      case Types.wkb.GeometryCollection:
        return GeometryCollection.parseTwkb(binaryReader, options);
      default:
        throw new Error('GeometryType ' + geometryType + ' not supported');
    }
  }
}
