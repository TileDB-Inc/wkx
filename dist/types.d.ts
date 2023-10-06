export class BinaryReader {
    isBigEndian: boolean;
    constructor(buffer: DataView, isBigEndian?: boolean);
    readUInt8(): number;
    readUInt16(): number;
    readUInt32(): number;
    readInt8(): number;
    readInt16(): number;
    readInt32(): number;
    readFloat(): number;
    readDouble(): number;
    readVarInt(): number;
}
export class BinaryWriter {
    buffer: DataView;
    position: number;
    constructor(size: number, allowResize?: boolean);
    writeUInt8(value: number): void;
    writeUInt16(value: number, littleEndian?: boolean): void;
    writeUInt32(value: number, littleEndian?: boolean): void;
    writeInt8(value: number): void;
    writeInt16(value: number, littleEndian?: boolean): void;
    writeInt32(value: number, littleEndian?: boolean): void;
    writeFloat(value: number, littleEndian?: boolean): void;
    writeDouble(value: number, littleEndian?: boolean): void;
    writeBuffer(buffer: ArrayBuffer): void;
    writeVarInt(value: number): number;
}
interface WKBExportOptions {
    srid?: number;
}
interface WKTParseOptions {
    srid?: number;
    hasZ: boolean;
    hasM: boolean;
}
interface WKBParseOptions {
    srid?: number;
    hasSrid: boolean;
    hasZ: boolean;
    hasM: boolean;
    isEwkb: boolean;
}
interface Precision {
    xy: number;
    z: number;
    m: number;
    xyFactor: number;
    zFactor: number;
    mFactor: number;
}
interface TWKBParseOptions {
    precision: number;
    precisionFactor: number;
    hasBoundingBox: boolean;
    hasSizeAttribute: boolean;
    hasIdList: boolean;
    hasExtendedPrecision: boolean;
    isEmpty: boolean;
    hasZ: boolean;
    hasM: boolean;
    zPrecision: number;
    zPrecisionFactor: number;
    mPrecision: number;
    mPrecisionFactor: number;
}
export class WktParser {
    constructor(value: string);
    matchRegex(tokens: RegExp[]): RegExpMatchArray | null;
    matchDimension(): WKTParseOptions;
    isMatch(tokens: string[]): boolean;
    matchType(): string;
    expectGroupStart(): void;
    expectGroupEnd(): void;
    matchCoordinate(options: WKTParseOptions): (number | undefined)[];
    matchCoordinates(options: WKTParseOptions): (number | undefined)[][];
}
declare abstract class GeometryBase {
    srid?: number;
    hasZ: boolean;
    hasM: boolean;
    constructor();
    /**
     * Export to WKT format
     */
    abstract toWkt(): string;
    abstract toWkb(options?: WKBExportOptions): ArrayBuffer;
    /**
     * Export to WKTB format
     */
    abstract toTwkb(): ArrayBuffer;
    /**
     * Get the byte size of the geometry stored in WKB format
     */
    abstract getWkbSize(): number;
    static getTwkbPrecision(xyPrecision: number, zPrecision: number, mPrecision: number): Precision;
    protected writeTwkbHeader(writer: BinaryWriter, geometryType: number, precision: Precision, isEmpty: boolean): void;
    protected getWkbType(geometryType: number, options?: WKBExportOptions): number;
    protected getWktType(wktType: string, isEmpty: boolean): string;
    toEwkt(): string;
    toEwkb(): ArrayBuffer;
}
export class Point extends GeometryBase {
    x?: number;
    y?: number;
    z?: number;
    m?: number;
    constructor(x?: number, y?: number, z?: number, m?: number, srid?: number);
    static Z(x: number, y: number, z: number, srid: number): Point;
    static M(x: number, y: number, m: number, srid: number): Point;
    static ZM(x: number, y: number, z: number, m: number, srid: number): Point;
    static parseWkt(reader: WktParser, options: WKTParseOptions): Point;
    static parseWkb(reader: BinaryReader, options: WKBParseOptions): Point;
    static readWkbPoint(reader: BinaryReader, options: WKBParseOptions): Point;
    static parseTwkb(reader: BinaryReader, options: TWKBParseOptions): Point;
    static readTwkbPoint(reader: BinaryReader, options: TWKBParseOptions, previousPoint: Point): Point;
    toWkt(): string;
    toWkb(options?: WKBExportOptions): ArrayBuffer;
    writeWkbPoint(writer: BinaryWriter): void;
    toTwkb(): ArrayBuffer;
    writeTwkbPoint(writer: BinaryWriter, precision: Precision, previousPoint: Point): void;
    getWkbSize(): number;
    getWktCoordinate(): string;
}
export class Polygon extends GeometryBase {
    exteriorRing: Point[];
    interiorRings: Point[][];
    constructor(exteriorRing?: Point[], interiorRings?: Point[][], srid?: number);
    static Z: (exteriorRing: Point[], interiorRings: Point[][], srid: number) => Polygon;
    static M(exteriorRing: Point[], interiorRings: Point[][], srid: number): Polygon;
    static ZM(exteriorRing: Point[], interiorRings: Point[][], srid: number): Polygon;
    static parseWkt(reader: WktParser, options: WKTParseOptions): Polygon;
    static parseWkb(reader: BinaryReader, options: WKBParseOptions): Polygon;
    static parseTwkb(reader: BinaryReader, options: TWKBParseOptions): Polygon;
    toWkt(): string;
    _toInnerWkt(): string;
    toWkb(options?: WKBExportOptions): ArrayBuffer;
    toTwkb(): ArrayBuffer;
    getWkbSize(): number;
}
export class LineString extends GeometryBase {
    points: Point[];
    constructor(points?: Point[], srid?: number);
    static Z(points: Point[], srid: number): LineString;
    static M(points: Point[], srid: number): LineString;
    static ZM(points: Point[], srid: number): LineString;
    static parseWkt(reader: WktParser, options: WKTParseOptions): LineString;
    static parseWkb(reader: BinaryReader, options: WKBParseOptions): LineString;
    static parseTwkb(reader: BinaryReader, options: TWKBParseOptions): LineString;
    toWkt(): string;
    _toInnerWkt(): string;
    toWkb(options?: WKBExportOptions): ArrayBuffer;
    toTwkb(): ArrayBuffer;
    getWkbSize(): number;
}
export class MultiPolygon extends GeometryBase {
    polygons: Polygon[];
    constructor(polygons?: Polygon[], srid?: number);
    static Z(polygons: Polygon[], srid: number): MultiPolygon;
    static M(polygons: Polygon[], srid: number): MultiPolygon;
    static ZM(polygons: Polygon[], srid: number): MultiPolygon;
    static parseWkt(reader: WktParser, options: WKTParseOptions): MultiPolygon;
    static parseWkb(reader: BinaryReader, options: WKBParseOptions): MultiPolygon;
    static parseTwkb(reader: BinaryReader, options: TWKBParseOptions): MultiPolygon;
    toWkt(): string;
    toWkb(options?: WKBExportOptions): ArrayBuffer;
    toTwkb(): ArrayBuffer;
    getWkbSize(): number;
}
export class MultiLineString extends GeometryBase {
    lineStrings: LineString[];
    constructor(lineStrings?: LineString[], srid?: number);
    static Z(lineStrings: LineString[], srid: number): MultiLineString;
    static M(lineStrings: LineString[], srid: number): MultiLineString;
    static ZM(lineStrings: LineString[], srid: number): MultiLineString;
    static parseWkt(reader: WktParser, options: WKTParseOptions): MultiLineString;
    static parseWkb(reader: BinaryReader, options: WKBParseOptions): MultiLineString;
    static parseTwkb(reader: BinaryReader, options: TWKBParseOptions): MultiLineString;
    toWkt(): string;
    toWkb(options?: WKBExportOptions): ArrayBuffer;
    toTwkb(): ArrayBuffer;
    getWkbSize(): number;
}
export class GeometryCollection extends GeometryBase {
    geometries: GeometryBase[];
    constructor(geometries?: GeometryBase[], srid?: number);
    static Z(geometries: GeometryBase[], srid: number): GeometryCollection;
    static M(geometries: GeometryBase[], srid: number): GeometryCollection;
    static ZM(geometries: GeometryBase[], srid: number): GeometryCollection;
    static parseWkt(reader: WktParser, options: WKTParseOptions): GeometryCollection;
    static parseWkb(reader: BinaryReader, options: WKBParseOptions): GeometryCollection;
    static parseTwkb(reader: BinaryReader, options: TWKBParseOptions): GeometryCollection;
    toWkt(): string;
    toWkb(options?: WKBExportOptions): ArrayBuffer;
    toTwkb(): ArrayBuffer;
    getWkbSize(): number;
}
export class Parser {
    static parse(input: string | DataView | WktParser | BinaryReader, options?: WKBParseOptions): GeometryBase;
    static parseWkt(value: string | WktParser): GeometryBase;
    static parseWkb(value: BinaryReader | DataView, parentOptions?: WKBParseOptions): GeometryBase;
    static parseTwkb(value: BinaryReader | DataView): Point | Polygon | LineString | MultiPolygon | MultiLineString | GeometryCollection | MultiPoint;
}
export class MultiPoint extends GeometryBase {
    points: Point[];
    constructor(points?: Point[], srid?: number);
    static Z(points: Point[], srid: number): MultiPoint;
    static M(points: Point[], srid: number): MultiPoint;
    static ZM(points: Point[], srid: number): MultiPoint;
    static parseWkt(reader: WktParser, options: WKTParseOptions): MultiPoint;
    static parseWkb(reader: BinaryReader, options: WKBParseOptions): MultiPoint;
    static parseTwkb(reader: BinaryReader, options: TWKBParseOptions): MultiPoint;
    toWkt(): string;
    toWkb(options?: WKBExportOptions): ArrayBuffer;
    toTwkb(): ArrayBuffer;
    getWkbSize(): number;
}

//# sourceMappingURL=types.d.ts.map
