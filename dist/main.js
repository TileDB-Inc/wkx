function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "BinaryReader", () => $6f59db5aecb64db1$export$76c443c41c20b286);
$parcel$export(module.exports, "BinaryWriter", () => $cce64cb23c6e3c70$export$b6da98667e5e554f);
$parcel$export(module.exports, "WktParser", () => $3cbb4977a62e28e1$export$7057cae8b783d070);
$parcel$export(module.exports, "Point", () => $b88dec074129450a$export$baf26146a414f24a);
$parcel$export(module.exports, "Polygon", () => $0751656ec0b50546$export$7d31b617c820d435);
$parcel$export(module.exports, "LineString", () => $a4fb63b66e38f047$export$27733b973b72e710);
$parcel$export(module.exports, "MultiPoint", () => $475a4917f0b733ec$export$96afecae28385f21);
$parcel$export(module.exports, "MultiPolygon", () => $2ea735447b250056$export$33402c60aeb5385e);
$parcel$export(module.exports, "MultiLineString", () => $29fb558284236d2d$export$67bf33efacdfe108);
$parcel$export(module.exports, "GeometryCollection", () => $6fbcdde72a2b135b$export$914c76c60a2662a);
class $6f59db5aecb64db1$export$76c443c41c20b286 {
    buffer;
    position;
    isBigEndian;
    constructor(buffer, isBigEndian = false){
        this.buffer = buffer;
        this.position = 0;
        this.isBigEndian = isBigEndian;
    }
    readUInt8() {
        const result = this.buffer.getUint8(this.position);
        ++this.position;
        return result;
    }
    readUInt16() {
        const result = this.buffer.getUint16(this.position, !this.isBigEndian);
        this.position += 2;
        return result;
    }
    readUInt32() {
        const result = this.buffer.getUint32(this.position, !this.isBigEndian);
        this.position += 4;
        return result;
    }
    readInt8() {
        const result = this.buffer.getInt8(this.position);
        ++this.position;
        return result;
    }
    readInt16() {
        const result = this.buffer.getInt16(this.position, !this.isBigEndian);
        this.position += 2;
        return result;
    }
    readInt32() {
        const result = this.buffer.getInt32(this.position, !this.isBigEndian);
        this.position += 4;
        return result;
    }
    readFloat() {
        const result = this.buffer.getFloat32(this.position, !this.isBigEndian);
        this.position += 4;
        return result;
    }
    readDouble() {
        const result = this.buffer.getFloat64(this.position, !this.isBigEndian);
        this.position += 8;
        return result;
    }
    readVarInt() {
        let result = 0;
        let bytesRead = 0;
        let nextByte;
        do {
            nextByte = this.buffer.getUint8(this.position + bytesRead);
            result += (nextByte & 0x7f) << 7 * bytesRead;
            bytesRead++;
        }while (nextByte >= 0x80);
        this.position += bytesRead;
        return result;
    }
}


class $cce64cb23c6e3c70$export$b6da98667e5e554f {
    buffer;
    position;
    allowResize;
    constructor(size, allowResize = false){
        this.buffer = new DataView(new ArrayBuffer(size));
        this.position = 0;
        this.allowResize = allowResize;
    }
    writeUInt8(value) {
        this.ensureSize(1);
        this.buffer.setUint8(this.position, value);
        this.position += 1;
    }
    writeUInt16(value, littleEndian = true) {
        this.ensureSize(2);
        this.buffer.setUint16(this.position, value, littleEndian);
        this.position += 2;
    }
    writeUInt32(value, littleEndian = true) {
        this.ensureSize(4);
        this.buffer.setUint32(this.position, value, littleEndian);
        this.position += 4;
    }
    writeInt8(value) {
        this.ensureSize(1);
        this.buffer.setInt8(this.position, value);
        this.position += 1;
    }
    writeInt16(value, littleEndian = true) {
        this.ensureSize(2);
        this.buffer.setInt16(this.position, value, littleEndian);
        this.position += 2;
    }
    writeInt32(value, littleEndian = true) {
        this.ensureSize(4);
        this.buffer.setInt32(this.position, value, littleEndian);
        this.position += 4;
    }
    writeFloat(value, littleEndian = true) {
        this.ensureSize(4);
        this.buffer.setFloat32(this.position, value, littleEndian);
        this.position += 4;
    }
    writeDouble(value, littleEndian = true) {
        this.ensureSize(8);
        this.buffer.setFloat64(this.position, value, littleEndian);
        this.position += 8;
    }
    writeBuffer(buffer) {
        this.ensureSize(buffer.byteLength);
        new Uint8Array(this.buffer.buffer).set(new Uint8Array(buffer), this.position);
        this.position += buffer.byteLength;
    }
    writeVarInt(value) {
        let length = 1;
        while((value & 0xffffff80) !== 0){
            this.writeUInt8(value & 0x7f | 0x80);
            value >>>= 7;
            length++;
        }
        this.writeUInt8(value & 0x7f);
        return length;
    }
    ensureSize(size) {
        if (this.buffer.byteLength >= this.position + size) return;
        if (!this.allowResize) throw new RangeError("index out of range");
        const tempBuffer = new DataView(new ArrayBuffer(this.position + size));
        new Uint8Array(tempBuffer.buffer).set(new Uint8Array(this.buffer.buffer));
        this.buffer = tempBuffer;
    }
}


const $faefaad95e5fcca0$export$4624c240901a6889 = {
    wkt: {
        Point: "POINT",
        LineString: "LINESTRING",
        Polygon: "POLYGON",
        MultiPoint: "MULTIPOINT",
        MultiLineString: "MULTILINESTRING",
        MultiPolygon: "MULTIPOLYGON",
        GeometryCollection: "GEOMETRYCOLLECTION"
    },
    wkb: {
        Point: 1,
        LineString: 2,
        Polygon: 3,
        MultiPoint: 4,
        MultiLineString: 5,
        MultiPolygon: 6,
        GeometryCollection: 7
    },
    geoJSON: {
        Point: "Point",
        LineString: "LineString",
        Polygon: "Polygon",
        MultiPoint: "MultiPoint",
        MultiLineString: "MultiLineString",
        MultiPolygon: "MultiPolygon",
        GeometryCollection: "GeometryCollection"
    }
};


class $3cbb4977a62e28e1$export$7057cae8b783d070 {
    position;
    value;
    constructor(value){
        this.value = value;
        this.position = 0;
    }
    matchRegex(tokens) {
        this.skipWhitespaces();
        for(let i = 0; i < tokens.length; i++){
            const match = this.value.substring(this.position).match(tokens[i]);
            if (match) {
                this.position += match[0].length;
                return match;
            }
        }
        return null;
    }
    match(tokens) {
        this.skipWhitespaces();
        for(let i = 0; i < tokens.length; i++)if (this.value.substring(this.position).indexOf(tokens[i]) === 0) {
            this.position += tokens[i].length;
            return tokens[i];
        }
        return null;
    }
    matchDimension() {
        const dimension = this.match([
            "ZM",
            "Z",
            "M"
        ]);
        switch(dimension){
            case "ZM":
                return {
                    hasZ: true,
                    hasM: true
                };
            case "Z":
                return {
                    hasZ: true,
                    hasM: false
                };
            case "M":
                return {
                    hasZ: false,
                    hasM: true
                };
            default:
                return {
                    hasZ: false,
                    hasM: false
                };
        }
    }
    isMatch(tokens) {
        this.skipWhitespaces();
        for(let i = 0; i < tokens.length; i++)if (this.value.substring(this.position).indexOf(tokens[i]) === 0) {
            this.position += tokens[i].length;
            return true;
        }
        return false;
    }
    matchType() {
        const geometryType = this.match([
            (0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.Point,
            (0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.LineString,
            (0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.Polygon,
            (0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.MultiPoint,
            (0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.MultiLineString,
            (0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.MultiPolygon,
            (0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.GeometryCollection
        ]);
        if (!geometryType) throw new Error("Expected geometry type");
        return geometryType;
    }
    expectGroupStart() {
        if (!this.isMatch([
            "("
        ])) throw new Error("Expected group start");
    }
    expectGroupEnd() {
        if (!this.isMatch([
            ")"
        ])) throw new Error("Expected group end");
    }
    matchCoordinate(options) {
        let match;
        if (options.hasZ && options.hasM) match = this.matchRegex([
            /^(\S*)\s+(\S*)\s+(\S*)\s+([^\s,)]*)/
        ]);
        else if (options.hasZ || options.hasM) match = this.matchRegex([
            /^(\S*)\s+(\S*)\s+([^\s,)]*)/
        ]);
        else match = this.matchRegex([
            /^(\S*)\s+([^\s,)]*)/
        ]);
        if (!match) throw new Error("Expected coordinates");
        if (options.hasZ && options.hasM) return [
            parseFloat(match[1]),
            parseFloat(match[2]),
            parseFloat(match[3]),
            parseFloat(match[4])
        ];
        else if (options.hasZ) return [
            parseFloat(match[1]),
            parseFloat(match[2]),
            parseFloat(match[3]),
            undefined
        ];
        else if (options.hasM) return [
            parseFloat(match[1]),
            parseFloat(match[2]),
            undefined,
            parseFloat(match[3])
        ];
        else return [
            parseFloat(match[1]),
            parseFloat(match[2]),
            undefined,
            undefined
        ];
    }
    matchCoordinates(options) {
        const coordinates = [];
        do {
            const startsWithBracket = this.isMatch([
                "("
            ]);
            coordinates.push(this.matchCoordinate(options));
            if (startsWithBracket) this.expectGroupEnd();
        }while (this.isMatch([
            ","
        ]));
        return coordinates;
    }
    skipWhitespaces() {
        while(this.position < this.value.length && this.value[this.position] === " ")this.position++;
    }
}





function $c68ca8efa17f19ea$export$c564cdbbe6da493(value) {
    return value << 1 ^ value >> 31;
}
function $c68ca8efa17f19ea$export$2f872c0f2117be69(value) {
    return value >> 1 ^ -(value & 1);
}


class $0a6c6bc697a854ef$export$d191e0c3149b3fac {
    srid;
    hasZ;
    hasM;
    constructor(){
        this.srid = undefined;
        this.hasZ = false;
        this.hasM = false;
    }
    static getTwkbPrecision(xyPrecision, zPrecision, mPrecision) {
        return {
            xy: xyPrecision,
            z: zPrecision,
            m: mPrecision,
            xyFactor: Math.pow(10, xyPrecision),
            zFactor: Math.pow(10, zPrecision),
            mFactor: Math.pow(10, mPrecision)
        };
    }
    writeTwkbHeader(writer, geometryType, precision, isEmpty) {
        const type = ((0, $c68ca8efa17f19ea$export$c564cdbbe6da493)(precision.xy) << 4) + geometryType;
        let metadataHeader = Number(this.hasZ || this.hasM) << 3;
        metadataHeader += Number(isEmpty) << 4;
        writer.writeUInt8(type);
        writer.writeUInt8(metadataHeader);
        if (this.hasZ || this.hasM) {
            let extendedPrecision = 0;
            if (this.hasZ) extendedPrecision |= 0x1;
            if (this.hasM) extendedPrecision |= 0x2;
            writer.writeUInt8(extendedPrecision);
        }
    }
    getWkbType(geometryType, options) {
        let dimensionType = 0;
        if (this.srid === undefined && options?.srid === undefined) {
            if (this.hasZ && this.hasM) dimensionType += 3000;
            else if (this.hasZ) dimensionType += 1000;
            else if (this.hasM) dimensionType += 2000;
        } else {
            if (this.hasZ) dimensionType |= 0x80000000;
            if (this.hasM) dimensionType |= 0x40000000;
        }
        return dimensionType + geometryType >>> 0;
    }
    getWktType(wktType, isEmpty) {
        let wkt = wktType;
        if (this.hasZ && this.hasM) wkt += " ZM ";
        else if (this.hasZ) wkt += " Z ";
        else if (this.hasM) wkt += " M ";
        if (isEmpty && !this.hasZ && !this.hasM) wkt += " ";
        if (isEmpty) wkt += "EMPTY";
        return wkt;
    }
    toEwkt() {
        return "SRID=" + this.srid + ";" + this.toWkt();
    }
    toEwkb() {
        const writer = new (0, $cce64cb23c6e3c70$export$b6da98667e5e554f)(this.getWkbSize() + 4);
        const buffer = this.toWkb();
        writer.writeInt8(1);
        writer.writeUInt32((new DataView(buffer.slice(1, 5)).getUint32(0, true) | 0x20000000) >>> 0);
        writer.writeUInt32(this.srid);
        writer.writeBuffer(buffer.slice(5));
        return writer.buffer.buffer;
    }
}



class $b88dec074129450a$export$baf26146a414f24a extends (0, $0a6c6bc697a854ef$export$d191e0c3149b3fac) {
    x;
    y;
    z;
    m;
    constructor(x, y, z, m, srid){
        super();
        this.x = x;
        this.y = y;
        this.z = z;
        this.m = m;
        this.srid = srid;
        this.hasZ = this.z !== undefined;
        this.hasM = this.m !== undefined;
    }
    static Z(x, y, z, srid) {
        const point = new $b88dec074129450a$export$baf26146a414f24a(x, y, z, undefined, srid);
        point.hasZ = true;
        return point;
    }
    static M(x, y, m, srid) {
        const point = new $b88dec074129450a$export$baf26146a414f24a(x, y, undefined, m, srid);
        point.hasM = true;
        return point;
    }
    static ZM(x, y, z, m, srid) {
        const point = new $b88dec074129450a$export$baf26146a414f24a(x, y, z, m, srid);
        point.hasZ = true;
        point.hasM = true;
        return point;
    }
    //#region Static parsers
    static parseWkt(reader, options) {
        const point = new $b88dec074129450a$export$baf26146a414f24a();
        point.srid = options.srid;
        point.hasZ = options.hasZ;
        point.hasM = options.hasM;
        if (reader.isMatch([
            "EMPTY"
        ])) return point;
        reader.expectGroupStart();
        [point.x, point.y, point.z, point.m] = reader.matchCoordinate(options);
        reader.expectGroupEnd();
        return point;
    }
    static parseWkb(reader, options) {
        const point = $b88dec074129450a$export$baf26146a414f24a.readWkbPoint(reader, options);
        point.srid = options.srid;
        return point;
    }
    static readWkbPoint(reader, options) {
        return new $b88dec074129450a$export$baf26146a414f24a(reader.readDouble(), reader.readDouble(), options.hasZ ? reader.readDouble() : undefined, options.hasM ? reader.readDouble() : undefined);
    }
    static parseTwkb(reader, options) {
        const point = new $b88dec074129450a$export$baf26146a414f24a();
        point.hasZ = options.hasZ;
        point.hasM = options.hasM;
        if (options.isEmpty) return point;
        point.x = (0, $c68ca8efa17f19ea$export$2f872c0f2117be69)(reader.readVarInt()) / options.precisionFactor;
        point.y = (0, $c68ca8efa17f19ea$export$2f872c0f2117be69)(reader.readVarInt()) / options.precisionFactor;
        point.z = options.hasZ ? (0, $c68ca8efa17f19ea$export$2f872c0f2117be69)(reader.readVarInt()) / options.zPrecisionFactor : undefined;
        point.m = options.hasM ? (0, $c68ca8efa17f19ea$export$2f872c0f2117be69)(reader.readVarInt()) / options.mPrecisionFactor : undefined;
        return point;
    }
    static readTwkbPoint(reader, options, previousPoint) {
        previousPoint.x += (0, $c68ca8efa17f19ea$export$2f872c0f2117be69)(reader.readVarInt()) / options.precisionFactor;
        previousPoint.y += (0, $c68ca8efa17f19ea$export$2f872c0f2117be69)(reader.readVarInt()) / options.precisionFactor;
        if (options.hasZ) previousPoint.z += (0, $c68ca8efa17f19ea$export$2f872c0f2117be69)(reader.readVarInt()) / options.zPrecisionFactor;
        if (options.hasM) previousPoint.m += (0, $c68ca8efa17f19ea$export$2f872c0f2117be69)(reader.readVarInt()) / options.mPrecisionFactor;
        return new $b88dec074129450a$export$baf26146a414f24a(previousPoint.x, previousPoint.y, previousPoint.z, previousPoint.m);
    }
    //#endregion
    toWkt() {
        if (this.x === undefined && this.y === undefined && this.z === undefined && this.m === undefined) return this.getWktType((0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.Point, true);
        return this.getWktType((0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.Point, false) + "(" + this.getWktCoordinate() + ")";
    }
    toWkb(options) {
        var wkb = new (0, $cce64cb23c6e3c70$export$b6da98667e5e554f)(this.getWkbSize(), false);
        wkb.writeInt8(1);
        wkb.writeUInt32(this.getWkbType((0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.Point, options));
        if (this.x === undefined && this.y === undefined) {
            wkb.writeDouble(NaN);
            wkb.writeDouble(NaN);
            if (this.hasZ) wkb.writeDouble(NaN);
            if (this.hasM) wkb.writeDouble(NaN);
        } else this.writeWkbPoint(wkb);
        return wkb.buffer.buffer;
    }
    writeWkbPoint(writer) {
        writer.writeDouble(this.x);
        writer.writeDouble(this.y);
        if (this.hasZ) writer.writeDouble(this.z);
        if (this.hasM) writer.writeDouble(this.m);
    }
    toTwkb() {
        const writer = new (0, $cce64cb23c6e3c70$export$b6da98667e5e554f)(0, true);
        const precision = (0, $0a6c6bc697a854ef$export$d191e0c3149b3fac).getTwkbPrecision(5, 0, 0);
        const isEmpty = this.x === undefined && this.y === undefined;
        this.writeTwkbHeader(writer, (0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.Point, precision, isEmpty);
        if (!isEmpty) this.writeTwkbPoint(writer, precision, new $b88dec074129450a$export$baf26146a414f24a(0, 0, 0, 0));
        return writer.buffer.buffer;
    }
    writeTwkbPoint(writer, precision, previousPoint) {
        const x = this.x * precision.xyFactor;
        const y = this.y * precision.xyFactor;
        const z = this.z * precision.zFactor;
        const m = this.m * precision.mFactor;
        writer.writeVarInt((0, $c68ca8efa17f19ea$export$c564cdbbe6da493)(x - previousPoint.x));
        writer.writeVarInt((0, $c68ca8efa17f19ea$export$c564cdbbe6da493)(y - previousPoint.y));
        if (this.hasZ) writer.writeVarInt((0, $c68ca8efa17f19ea$export$c564cdbbe6da493)(z - previousPoint.z));
        if (this.hasM) writer.writeVarInt((0, $c68ca8efa17f19ea$export$c564cdbbe6da493)(m - previousPoint.m));
        previousPoint.x = x;
        previousPoint.y = y;
        previousPoint.z = z;
        previousPoint.m = m;
    }
    getWkbSize() {
        let size = 21;
        if (this.hasZ) size += 8;
        if (this.hasM) size += 8;
        return size;
    }
    //#region Public Methods 
    getWktCoordinate() {
        var coordinates = this.x + " " + this.y;
        if (this.hasZ) coordinates += " " + this.z;
        if (this.hasM) coordinates += " " + this.m;
        return coordinates;
    }
}






class $0751656ec0b50546$export$7d31b617c820d435 extends (0, $0a6c6bc697a854ef$export$d191e0c3149b3fac) {
    exteriorRing;
    interiorRings;
    constructor(exteriorRing, interiorRings, srid){
        super();
        this.exteriorRing = exteriorRing || [];
        this.interiorRings = interiorRings || [];
        this.srid = srid;
        if (this.exteriorRing.length > 0) {
            this.hasZ = this.exteriorRing[0].hasZ;
            this.hasM = this.exteriorRing[0].hasM;
        }
    }
    static Z = function(exteriorRing, interiorRings, srid) {
        const polygon = new $0751656ec0b50546$export$7d31b617c820d435(exteriorRing, interiorRings, srid);
        polygon.hasZ = true;
        return polygon;
    };
    static M(exteriorRing, interiorRings, srid) {
        const polygon = new $0751656ec0b50546$export$7d31b617c820d435(exteriorRing, interiorRings, srid);
        polygon.hasM = true;
        return polygon;
    }
    static ZM(exteriorRing, interiorRings, srid) {
        const polygon = new $0751656ec0b50546$export$7d31b617c820d435(exteriorRing, interiorRings, srid);
        polygon.hasZ = true;
        polygon.hasM = true;
        return polygon;
    }
    static parseWkt(reader, options) {
        let polygon = new $0751656ec0b50546$export$7d31b617c820d435();
        polygon.srid = options.srid;
        polygon.hasZ = options.hasZ;
        polygon.hasM = options.hasM;
        if (reader.isMatch([
            "EMPTY"
        ])) return polygon;
        reader.expectGroupStart();
        reader.expectGroupStart();
        polygon.exteriorRing = reader.matchCoordinates(options).map((x)=>new (0, $b88dec074129450a$export$baf26146a414f24a)(x[0], x[1], x[2], x[3]));
        reader.expectGroupEnd();
        while(reader.isMatch([
            ","
        ])){
            reader.expectGroupStart();
            polygon.interiorRings.push(reader.matchCoordinates(options).map((x)=>new (0, $b88dec074129450a$export$baf26146a414f24a)(x[0], x[1], x[2], x[3])));
            reader.expectGroupEnd();
        }
        reader.expectGroupEnd();
        return polygon;
    }
    static parseWkb(reader, options) {
        var polygon = new $0751656ec0b50546$export$7d31b617c820d435();
        polygon.srid = options.srid;
        polygon.hasZ = options.hasZ;
        polygon.hasM = options.hasM;
        var ringCount = reader.readUInt32();
        if (ringCount > 0) {
            var exteriorRingCount = reader.readUInt32();
            for(var i = 0; i < exteriorRingCount; i++)polygon.exteriorRing.push((0, $b88dec074129450a$export$baf26146a414f24a).readWkbPoint(reader, options));
            for(i = 1; i < ringCount; i++){
                var interiorRing = [];
                var interiorRingCount = reader.readUInt32();
                for(var j = 0; j < interiorRingCount; j++)interiorRing.push((0, $b88dec074129450a$export$baf26146a414f24a).readWkbPoint(reader, options));
                polygon.interiorRings.push(interiorRing);
            }
        }
        return polygon;
    }
    static parseTwkb(reader, options) {
        const polygon = new $0751656ec0b50546$export$7d31b617c820d435();
        polygon.hasZ = options.hasZ;
        polygon.hasM = options.hasM;
        if (options.isEmpty) return polygon;
        const previousPoint = new (0, $b88dec074129450a$export$baf26146a414f24a)(0, 0, options.hasZ ? 0 : undefined, options.hasM ? 0 : undefined);
        const ringCount = reader.readVarInt();
        const exteriorRingCount = reader.readVarInt();
        for(let i = 0; i < exteriorRingCount; i++)polygon.exteriorRing.push((0, $b88dec074129450a$export$baf26146a414f24a).readTwkbPoint(reader, options, previousPoint));
        for(let i = 1; i < ringCount; i++){
            const interiorRing = [];
            const interiorRingCount = reader.readVarInt();
            for(let j = 0; j < interiorRingCount; j++)interiorRing.push((0, $b88dec074129450a$export$baf26146a414f24a).readTwkbPoint(reader, options, previousPoint));
            polygon.interiorRings.push(interiorRing);
        }
        return polygon;
    }
    toWkt() {
        if (this.exteriorRing.length === 0) return this.getWktType((0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.Polygon, true);
        return this.getWktType((0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.Polygon, false) + this._toInnerWkt();
    }
    _toInnerWkt() {
        var innerWkt = "((";
        for(var i = 0; i < this.exteriorRing.length; i++)innerWkt += this.exteriorRing[i].getWktCoordinate() + ",";
        innerWkt = innerWkt.slice(0, -1);
        innerWkt += ")";
        for(i = 0; i < this.interiorRings.length; i++){
            innerWkt += ",(";
            for(var j = 0; j < this.interiorRings[i].length; j++)innerWkt += this.interiorRings[i][j].getWktCoordinate() + ",";
            innerWkt = innerWkt.slice(0, -1);
            innerWkt += ")";
        }
        innerWkt += ")";
        return innerWkt;
    }
    toWkb(options) {
        var writer = new (0, $cce64cb23c6e3c70$export$b6da98667e5e554f)(this.getWkbSize());
        writer.writeInt8(1);
        writer.writeUInt32(this.getWkbType((0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.Polygon, options));
        if (this.exteriorRing.length > 0) {
            writer.writeUInt32(1 + this.interiorRings.length);
            writer.writeUInt32(this.exteriorRing.length);
        } else writer.writeUInt32(0);
        for(let i = 0; i < this.exteriorRing.length; i++)this.exteriorRing[i].writeWkbPoint(writer);
        for(let i = 0; i < this.interiorRings.length; i++){
            writer.writeUInt32(this.interiorRings[i].length);
            for(let j = 0; j < this.interiorRings[i].length; j++)this.interiorRings[i][j].writeWkbPoint(writer);
        }
        return writer.buffer.buffer;
    }
    toTwkb() {
        const writer = new (0, $cce64cb23c6e3c70$export$b6da98667e5e554f)(0, true);
        const precision = (0, $0a6c6bc697a854ef$export$d191e0c3149b3fac).getTwkbPrecision(5, 0, 0);
        const isEmpty = this.exteriorRing.length === 0;
        this.writeTwkbHeader(writer, (0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.Polygon, precision, isEmpty);
        if (this.exteriorRing.length > 0) {
            writer.writeVarInt(1 + this.interiorRings.length);
            writer.writeVarInt(this.exteriorRing.length);
            const previousPoint = new (0, $b88dec074129450a$export$baf26146a414f24a)(0, 0, 0, 0);
            for(let i = 0; i < this.exteriorRing.length; i++)this.exteriorRing[i].writeTwkbPoint(writer, precision, previousPoint);
            for(let i = 0; i < this.interiorRings.length; i++){
                writer.writeVarInt(this.interiorRings[i].length);
                for(let j = 0; j < this.interiorRings[i].length; j++)this.interiorRings[i][j].writeTwkbPoint(writer, precision, previousPoint);
            }
        }
        return writer.buffer.buffer;
    }
    getWkbSize() {
        var coordinateSize = 16;
        if (this.hasZ) coordinateSize += 8;
        if (this.hasM) coordinateSize += 8;
        var size = 9;
        if (this.exteriorRing.length > 0) size += 4 + this.exteriorRing.length * coordinateSize;
        for(var i = 0; i < this.interiorRings.length; i++)size += 4 + this.interiorRings[i].length * coordinateSize;
        return size;
    }
}






class $a4fb63b66e38f047$export$27733b973b72e710 extends (0, $0a6c6bc697a854ef$export$d191e0c3149b3fac) {
    points;
    constructor(points, srid){
        super();
        this.points = points || [];
        this.srid = srid;
        if (this.points.length > 0) {
            this.hasZ = this.points[0].hasZ;
            this.hasM = this.points[0].hasM;
        }
    }
    static Z(points, srid) {
        const lineString = new $a4fb63b66e38f047$export$27733b973b72e710(points, srid);
        lineString.hasZ = true;
        return lineString;
    }
    static M(points, srid) {
        const lineString = new $a4fb63b66e38f047$export$27733b973b72e710(points, srid);
        lineString.hasM = true;
        return lineString;
    }
    static ZM(points, srid) {
        const lineString = new $a4fb63b66e38f047$export$27733b973b72e710(points, srid);
        lineString.hasZ = true;
        lineString.hasM = true;
        return lineString;
    }
    static parseWkt(reader, options) {
        const lineString = new $a4fb63b66e38f047$export$27733b973b72e710();
        lineString.srid = options.srid;
        lineString.hasZ = options.hasZ;
        lineString.hasM = options.hasM;
        if (reader.isMatch([
            "EMPTY"
        ])) return lineString;
        reader.expectGroupStart();
        lineString.points = reader.matchCoordinates(options).map((x)=>new (0, $b88dec074129450a$export$baf26146a414f24a)(x[0], x[1], x[2], x[3]));
        reader.expectGroupEnd();
        return lineString;
    }
    static parseWkb(reader, options) {
        const lineString = new $a4fb63b66e38f047$export$27733b973b72e710();
        lineString.srid = options.srid;
        lineString.hasZ = options.hasZ;
        lineString.hasM = options.hasM;
        var pointCount = reader.readUInt32();
        for(var i = 0; i < pointCount; i++)lineString.points.push((0, $b88dec074129450a$export$baf26146a414f24a).readWkbPoint(reader, options));
        return lineString;
    }
    static parseTwkb(reader, options) {
        const lineString = new $a4fb63b66e38f047$export$27733b973b72e710();
        lineString.hasZ = options.hasZ;
        lineString.hasM = options.hasM;
        if (options.isEmpty) return lineString;
        const previousPoint = new (0, $b88dec074129450a$export$baf26146a414f24a)(0, 0, options.hasZ ? 0 : undefined, options.hasM ? 0 : undefined);
        const pointCount = reader.readVarInt();
        for(var i = 0; i < pointCount; i++)lineString.points.push((0, $b88dec074129450a$export$baf26146a414f24a).readTwkbPoint(reader, options, previousPoint));
        return lineString;
    }
    toWkt() {
        if (this.points.length === 0) return this.getWktType((0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.LineString, true);
        return this.getWktType((0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.LineString, false) + this._toInnerWkt();
    }
    _toInnerWkt() {
        var innerWkt = "(";
        for(var i = 0; i < this.points.length; i++)innerWkt += this.points[i].getWktCoordinate() + ",";
        innerWkt = innerWkt.slice(0, -1);
        innerWkt += ")";
        return innerWkt;
    }
    toWkb(options) {
        var writer = new (0, $cce64cb23c6e3c70$export$b6da98667e5e554f)(this.getWkbSize(), false);
        writer.writeInt8(1);
        writer.writeUInt32(this.getWkbType((0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.LineString, options));
        writer.writeUInt32(this.points.length);
        for(let i = 0; i < this.points.length; i++)this.points[i].writeWkbPoint(writer);
        return writer.buffer.buffer;
    }
    toTwkb() {
        const writer = new (0, $cce64cb23c6e3c70$export$b6da98667e5e554f)(0, true);
        const precision = (0, $0a6c6bc697a854ef$export$d191e0c3149b3fac).getTwkbPrecision(5, 0, 0);
        const isEmpty = this.points.length === 0;
        this.writeTwkbHeader(writer, (0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.LineString, precision, isEmpty);
        if (this.points.length > 0) {
            writer.writeVarInt(this.points.length);
            var previousPoint = new (0, $b88dec074129450a$export$baf26146a414f24a)(0, 0, 0, 0);
            for(var i = 0; i < this.points.length; i++)this.points[i].writeTwkbPoint(writer, precision, previousPoint);
        }
        return writer.buffer.buffer;
    }
    getWkbSize() {
        let coordinateSize = 16;
        if (this.hasZ) coordinateSize += 8;
        if (this.hasM) coordinateSize += 8;
        return 9 + this.points.length * coordinateSize;
    }
}


















class $2ea735447b250056$export$33402c60aeb5385e extends (0, $0a6c6bc697a854ef$export$d191e0c3149b3fac) {
    polygons;
    constructor(polygons, srid){
        super();
        this.polygons = polygons || [];
        this.srid = srid;
        if (this.polygons.length > 0) {
            this.hasZ = this.polygons[0].hasZ;
            this.hasM = this.polygons[0].hasM;
        }
    }
    static Z(polygons, srid) {
        const multiPolygon = new $2ea735447b250056$export$33402c60aeb5385e(polygons, srid);
        multiPolygon.hasZ = true;
        return multiPolygon;
    }
    static M(polygons, srid) {
        const multiPolygon = new $2ea735447b250056$export$33402c60aeb5385e(polygons, srid);
        multiPolygon.hasM = true;
        return multiPolygon;
    }
    static ZM(polygons, srid) {
        const multiPolygon = new $2ea735447b250056$export$33402c60aeb5385e(polygons, srid);
        multiPolygon.hasZ = true;
        multiPolygon.hasM = true;
        return multiPolygon;
    }
    static parseWkt(reader, options) {
        var multiPolygon = new $2ea735447b250056$export$33402c60aeb5385e();
        multiPolygon.srid = options.srid;
        multiPolygon.hasZ = options.hasZ;
        multiPolygon.hasM = options.hasM;
        if (reader.isMatch([
            "EMPTY"
        ])) return multiPolygon;
        reader.expectGroupStart();
        do {
            reader.expectGroupStart();
            var exteriorRing = [];
            var interiorRings = [];
            reader.expectGroupStart();
            exteriorRing = reader.matchCoordinates(options).map((x)=>new (0, $b88dec074129450a$export$baf26146a414f24a)(x[0], x[1], x[2], x[3]));
            reader.expectGroupEnd();
            while(reader.isMatch([
                ","
            ])){
                reader.expectGroupStart();
                interiorRings.push(reader.matchCoordinates(options).map((x)=>new (0, $b88dec074129450a$export$baf26146a414f24a)(x[0], x[1], x[2], x[3])));
                reader.expectGroupEnd();
            }
            multiPolygon.polygons.push(new (0, $0751656ec0b50546$export$7d31b617c820d435)(exteriorRing, interiorRings));
            reader.expectGroupEnd();
        }while (reader.isMatch([
            ","
        ]));
        reader.expectGroupEnd();
        return multiPolygon;
    }
    static parseWkb(reader, options) {
        const multiPolygon = new $2ea735447b250056$export$33402c60aeb5385e();
        multiPolygon.srid = options.srid;
        multiPolygon.hasZ = options.hasZ;
        multiPolygon.hasM = options.hasM;
        var polygonCount = reader.readUInt32();
        for(var i = 0; i < polygonCount; i++)multiPolygon.polygons.push((0, $0f6a681c4346f47b$export$7acfa6ed01010e37).parse(reader, options));
        return multiPolygon;
    }
    static parseTwkb(reader, options) {
        const multiPolygon = new $2ea735447b250056$export$33402c60aeb5385e();
        multiPolygon.hasZ = options.hasZ;
        multiPolygon.hasM = options.hasM;
        if (options.isEmpty) return multiPolygon;
        const previousPoint = new (0, $b88dec074129450a$export$baf26146a414f24a)(0, 0, options.hasZ ? 0 : undefined, options.hasM ? 0 : undefined);
        const polygonCount = reader.readVarInt();
        for(let i = 0; i < polygonCount; i++){
            const polygon = new (0, $0751656ec0b50546$export$7d31b617c820d435)();
            polygon.hasZ = options.hasZ;
            polygon.hasM = options.hasM;
            const ringCount = reader.readVarInt();
            const exteriorRingCount = reader.readVarInt();
            for(let j = 0; j < exteriorRingCount; j++)polygon.exteriorRing.push((0, $b88dec074129450a$export$baf26146a414f24a).readTwkbPoint(reader, options, previousPoint));
            for(let j = 1; j < ringCount; j++){
                const interiorRing = [];
                const interiorRingCount = reader.readVarInt();
                for(let k = 0; k < interiorRingCount; k++)interiorRing.push((0, $b88dec074129450a$export$baf26146a414f24a).readTwkbPoint(reader, options, previousPoint));
                polygon.interiorRings.push(interiorRing);
            }
            multiPolygon.polygons.push(polygon);
        }
        return multiPolygon;
    }
    toWkt() {
        if (this.polygons.length === 0) return this.getWktType((0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.MultiPolygon, true);
        var wkt = this.getWktType((0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.MultiPolygon, false) + "(";
        for(var i = 0; i < this.polygons.length; i++)wkt += this.polygons[i]._toInnerWkt() + ",";
        wkt = wkt.slice(0, -1);
        wkt += ")";
        return wkt;
    }
    toWkb(options) {
        var wkb = new (0, $cce64cb23c6e3c70$export$b6da98667e5e554f)(this.getWkbSize(), false);
        wkb.writeInt8(1);
        wkb.writeUInt32(this.getWkbType((0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.MultiPolygon, options), true);
        wkb.writeUInt32(this.polygons.length);
        for(var i = 0; i < this.polygons.length; i++)wkb.writeBuffer(this.polygons[i].toWkb({
            srid: this.srid
        }));
        return wkb.buffer.buffer;
    }
    toTwkb() {
        const writer = new (0, $cce64cb23c6e3c70$export$b6da98667e5e554f)(0, true);
        const precision = (0, $0a6c6bc697a854ef$export$d191e0c3149b3fac).getTwkbPrecision(5, 0, 0);
        const isEmpty = this.polygons.length === 0;
        this.writeTwkbHeader(writer, (0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.MultiPolygon, precision, isEmpty);
        if (this.polygons.length > 0) {
            writer.writeVarInt(this.polygons.length);
            const previousPoint = new (0, $b88dec074129450a$export$baf26146a414f24a)(0, 0, 0, 0);
            for(let i = 0; i < this.polygons.length; i++){
                writer.writeVarInt(1 + this.polygons[i].interiorRings.length);
                writer.writeVarInt(this.polygons[i].exteriorRing.length);
                for(let j = 0; j < this.polygons[i].exteriorRing.length; j++)this.polygons[i].exteriorRing[j].writeTwkbPoint(writer, precision, previousPoint);
                for(let j = 0; j < this.polygons[i].interiorRings.length; j++){
                    writer.writeVarInt(this.polygons[i].interiorRings[j].length);
                    for(let k = 0; k < this.polygons[i].interiorRings[j].length; k++)this.polygons[i].interiorRings[j][k].writeTwkbPoint(writer, precision, previousPoint);
                }
            }
        }
        return writer.buffer.buffer;
    }
    getWkbSize() {
        var size = 9;
        for(var i = 0; i < this.polygons.length; i++)size += this.polygons[i].getWkbSize();
        return size;
    }
}









class $29fb558284236d2d$export$67bf33efacdfe108 extends (0, $0a6c6bc697a854ef$export$d191e0c3149b3fac) {
    lineStrings;
    constructor(lineStrings, srid){
        super();
        this.lineStrings = lineStrings || [];
        this.srid = srid;
        if (this.lineStrings.length > 0) {
            this.hasZ = this.lineStrings[0].hasZ;
            this.hasM = this.lineStrings[0].hasM;
        }
    }
    static Z(lineStrings, srid) {
        const multiLineString = new $29fb558284236d2d$export$67bf33efacdfe108(lineStrings, srid);
        multiLineString.hasZ = true;
        return multiLineString;
    }
    static M(lineStrings, srid) {
        const multiLineString = new $29fb558284236d2d$export$67bf33efacdfe108(lineStrings, srid);
        multiLineString.hasM = true;
        return multiLineString;
    }
    static ZM(lineStrings, srid) {
        const multiLineString = new $29fb558284236d2d$export$67bf33efacdfe108(lineStrings, srid);
        multiLineString.hasZ = true;
        multiLineString.hasM = true;
        return multiLineString;
    }
    static parseWkt(reader, options) {
        var multiLineString = new $29fb558284236d2d$export$67bf33efacdfe108();
        multiLineString.srid = options.srid;
        multiLineString.hasZ = options.hasZ;
        multiLineString.hasM = options.hasM;
        if (reader.isMatch([
            "EMPTY"
        ])) return multiLineString;
        reader.expectGroupStart();
        do {
            reader.expectGroupStart();
            multiLineString.lineStrings.push(new (0, $a4fb63b66e38f047$export$27733b973b72e710)(reader.matchCoordinates(options).map((x)=>new (0, $b88dec074129450a$export$baf26146a414f24a)(x[0], x[1], x[2], x[3]))));
            reader.expectGroupEnd();
        }while (reader.isMatch([
            ","
        ]));
        reader.expectGroupEnd();
        return multiLineString;
    }
    static parseWkb(reader, options) {
        var multiLineString = new $29fb558284236d2d$export$67bf33efacdfe108();
        multiLineString.srid = options.srid;
        multiLineString.hasZ = options.hasZ;
        multiLineString.hasM = options.hasM;
        var lineStringCount = reader.readUInt32();
        for(var i = 0; i < lineStringCount; i++)multiLineString.lineStrings.push((0, $0f6a681c4346f47b$export$7acfa6ed01010e37).parse(reader, options));
        return multiLineString;
    }
    static parseTwkb(reader, options) {
        const multiLineString = new $29fb558284236d2d$export$67bf33efacdfe108();
        multiLineString.hasZ = options.hasZ;
        multiLineString.hasM = options.hasM;
        if (options.isEmpty) return multiLineString;
        const previousPoint = new (0, $b88dec074129450a$export$baf26146a414f24a)(0, 0, options.hasZ ? 0 : undefined, options.hasM ? 0 : undefined);
        const lineStringCount = reader.readVarInt();
        for(var i = 0; i < lineStringCount; i++){
            const lineString = new (0, $a4fb63b66e38f047$export$27733b973b72e710)();
            lineString.hasZ = options.hasZ;
            lineString.hasM = options.hasM;
            const pointCount = reader.readVarInt();
            for(var j = 0; j < pointCount; j++)lineString.points.push((0, $b88dec074129450a$export$baf26146a414f24a).readTwkbPoint(reader, options, previousPoint));
            multiLineString.lineStrings.push(lineString);
        }
        return multiLineString;
    }
    toWkt() {
        if (this.lineStrings.length === 0) return this.getWktType((0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.MultiLineString, true);
        var wkt = this.getWktType((0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.MultiLineString, false) + "(";
        for(var i = 0; i < this.lineStrings.length; i++)wkt += this.lineStrings[i]._toInnerWkt() + ",";
        wkt = wkt.slice(0, -1);
        wkt += ")";
        return wkt;
    }
    toWkb(options) {
        var wkb = new (0, $cce64cb23c6e3c70$export$b6da98667e5e554f)(this.getWkbSize(), false);
        wkb.writeInt8(1);
        wkb.writeUInt32(this.getWkbType((0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.MultiLineString, options));
        wkb.writeUInt32(this.lineStrings.length);
        for(var i = 0; i < this.lineStrings.length; i++)wkb.writeBuffer(this.lineStrings[i].toWkb({
            srid: this.srid
        }));
        return wkb.buffer.buffer;
    }
    toTwkb() {
        const writer = new (0, $cce64cb23c6e3c70$export$b6da98667e5e554f)(0, true);
        const precision = (0, $0a6c6bc697a854ef$export$d191e0c3149b3fac).getTwkbPrecision(5, 0, 0);
        const isEmpty = this.lineStrings.length === 0;
        this.writeTwkbHeader(writer, (0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.MultiLineString, precision, isEmpty);
        if (this.lineStrings.length > 0) {
            writer.writeVarInt(this.lineStrings.length);
            const previousPoint = new (0, $b88dec074129450a$export$baf26146a414f24a)(0, 0, 0, 0);
            for(let i = 0; i < this.lineStrings.length; i++){
                writer.writeVarInt(this.lineStrings[i].points.length);
                for(var j = 0; j < this.lineStrings[i].points.length; j++)this.lineStrings[i].points[j].writeTwkbPoint(writer, precision, previousPoint);
            }
        }
        return writer.buffer.buffer;
    }
    getWkbSize() {
        var size = 9;
        for(var i = 0; i < this.lineStrings.length; i++)size += this.lineStrings[i].getWkbSize();
        return size;
    }
}






class $6fbcdde72a2b135b$export$914c76c60a2662a extends (0, $0a6c6bc697a854ef$export$d191e0c3149b3fac) {
    geometries;
    constructor(geometries, srid){
        super();
        this.geometries = geometries || [];
        this.srid = srid;
        if (this.geometries.length > 0) {
            this.hasZ = this.geometries[0].hasZ;
            this.hasM = this.geometries[0].hasM;
        }
    }
    static Z(geometries, srid) {
        const geometryCollection = new $6fbcdde72a2b135b$export$914c76c60a2662a(geometries, srid);
        geometryCollection.hasZ = true;
        return geometryCollection;
    }
    static M(geometries, srid) {
        const geometryCollection = new $6fbcdde72a2b135b$export$914c76c60a2662a(geometries, srid);
        geometryCollection.hasM = true;
        return geometryCollection;
    }
    static ZM(geometries, srid) {
        const geometryCollection = new $6fbcdde72a2b135b$export$914c76c60a2662a(geometries, srid);
        geometryCollection.hasZ = true;
        geometryCollection.hasM = true;
        return geometryCollection;
    }
    static parseWkt(reader, options) {
        var geometryCollection = new $6fbcdde72a2b135b$export$914c76c60a2662a();
        geometryCollection.srid = options.srid;
        geometryCollection.hasZ = options.hasZ;
        geometryCollection.hasM = options.hasM;
        if (reader.isMatch([
            "EMPTY"
        ])) return geometryCollection;
        reader.expectGroupStart();
        do geometryCollection.geometries.push((0, $0f6a681c4346f47b$export$7acfa6ed01010e37).parse(reader));
        while (reader.isMatch([
            ","
        ]));
        reader.expectGroupEnd();
        return geometryCollection;
    }
    static parseWkb(reader, options) {
        var geometryCollection = new $6fbcdde72a2b135b$export$914c76c60a2662a();
        geometryCollection.srid = options.srid;
        geometryCollection.hasZ = options.hasZ;
        geometryCollection.hasM = options.hasM;
        var geometryCount = reader.readUInt32();
        for(var i = 0; i < geometryCount; i++)geometryCollection.geometries.push((0, $0f6a681c4346f47b$export$7acfa6ed01010e37).parse(reader, options));
        return geometryCollection;
    }
    static parseTwkb(reader, options) {
        const geometryCollection = new $6fbcdde72a2b135b$export$914c76c60a2662a();
        geometryCollection.hasZ = options.hasZ;
        geometryCollection.hasM = options.hasM;
        if (options.isEmpty) return geometryCollection;
        var geometryCount = reader.readVarInt();
        for(var i = 0; i < geometryCount; i++)geometryCollection.geometries.push((0, $0f6a681c4346f47b$export$7acfa6ed01010e37).parseTwkb(reader));
        return geometryCollection;
    }
    toWkt() {
        if (this.geometries.length === 0) return this.getWktType((0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.GeometryCollection, true);
        var wkt = this.getWktType((0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.GeometryCollection, false) + "(";
        for(var i = 0; i < this.geometries.length; i++)wkt += this.geometries[i].toWkt() + ",";
        wkt = wkt.slice(0, -1);
        wkt += ")";
        return wkt;
    }
    toWkb(options) {
        const wkb = new (0, $cce64cb23c6e3c70$export$b6da98667e5e554f)(this.getWkbSize(), false);
        wkb.writeInt8(1);
        wkb.writeUInt32(this.getWkbType((0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.GeometryCollection, options));
        wkb.writeUInt32(this.geometries.length);
        for(var i = 0; i < this.geometries.length; i++)wkb.writeBuffer(this.geometries[i].toWkb({
            srid: this.srid
        }));
        return wkb.buffer.buffer;
    }
    toTwkb() {
        const writer = new (0, $cce64cb23c6e3c70$export$b6da98667e5e554f)(0, true);
        const precision = (0, $0a6c6bc697a854ef$export$d191e0c3149b3fac).getTwkbPrecision(5, 0, 0);
        const isEmpty = this.geometries.length === 0;
        this.writeTwkbHeader(writer, (0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.GeometryCollection, precision, isEmpty);
        if (this.geometries.length > 0) {
            writer.writeVarInt(this.geometries.length);
            for(let i = 0; i < this.geometries.length; i++)writer.writeBuffer(this.geometries[i].toTwkb());
        }
        return writer.buffer.buffer;
    }
    getWkbSize() {
        let size = 9;
        for(let i = 0; i < this.geometries.length; i++)size += this.geometries[i].getWkbSize();
        return size;
    }
}



class $0f6a681c4346f47b$export$7acfa6ed01010e37 {
    static parse(input, options) {
        if (typeof input === "string" || input instanceof (0, $3cbb4977a62e28e1$export$7057cae8b783d070)) return $0f6a681c4346f47b$export$7acfa6ed01010e37.parseWkt(input);
        else if (input instanceof DataView || input instanceof (0, $6f59db5aecb64db1$export$76c443c41c20b286)) return $0f6a681c4346f47b$export$7acfa6ed01010e37.parseWkb(input, options);
        throw new Error("first argument must be a string or Buffer");
    }
    static parseWkt(value) {
        let srid;
        const wktParser = value instanceof (0, $3cbb4977a62e28e1$export$7057cae8b783d070) ? value : new (0, $3cbb4977a62e28e1$export$7057cae8b783d070)(value);
        var match = wktParser.matchRegex([
            /^SRID=(\d+);/
        ]);
        if (match) srid = parseInt(match[1], 10);
        var geometryType = wktParser.matchType();
        var dimension = wktParser.matchDimension();
        var options = {
            srid: srid,
            hasZ: dimension.hasZ,
            hasM: dimension.hasM
        };
        switch(geometryType){
            case (0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.Point:
                return (0, $b88dec074129450a$export$baf26146a414f24a).parseWkt(wktParser, options);
            case (0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.LineString:
                return (0, $a4fb63b66e38f047$export$27733b973b72e710).parseWkt(wktParser, options);
            case (0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.Polygon:
                return (0, $0751656ec0b50546$export$7d31b617c820d435).parseWkt(wktParser, options);
            case (0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.MultiPoint:
                return (0, $475a4917f0b733ec$export$96afecae28385f21).parseWkt(wktParser, options);
            case (0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.MultiLineString:
                return (0, $29fb558284236d2d$export$67bf33efacdfe108).parseWkt(wktParser, options);
            case (0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.MultiPolygon:
                return (0, $2ea735447b250056$export$33402c60aeb5385e).parseWkt(wktParser, options);
            case (0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.GeometryCollection:
                return (0, $6fbcdde72a2b135b$export$914c76c60a2662a).parseWkt(wktParser, options);
            default:
                throw new Error("GeometryType " + geometryType + " not supported");
        }
    }
    static parseWkb(value, parentOptions) {
        let geometryType;
        const options = {};
        const binaryReader = value instanceof (0, $6f59db5aecb64db1$export$76c443c41c20b286) ? value : new (0, $6f59db5aecb64db1$export$76c443c41c20b286)(value, true);
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
            } else geometryType = wkbType;
        } else {
            if (wkbType & 0x80000000) options.hasZ = true;
            if (wkbType & 0x40000000) options.hasM = true;
            geometryType = wkbType & 0xf;
        }
        switch(geometryType){
            case (0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.Point:
                return (0, $b88dec074129450a$export$baf26146a414f24a).parseWkb(binaryReader, options);
            case (0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.LineString:
                return (0, $a4fb63b66e38f047$export$27733b973b72e710).parseWkb(binaryReader, options);
            case (0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.Polygon:
                return (0, $0751656ec0b50546$export$7d31b617c820d435).parseWkb(binaryReader, options);
            case (0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.MultiPoint:
                return (0, $475a4917f0b733ec$export$96afecae28385f21).parseWkb(binaryReader, options);
            case (0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.MultiLineString:
                return (0, $29fb558284236d2d$export$67bf33efacdfe108).parseWkb(binaryReader, options);
            case (0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.MultiPolygon:
                return (0, $2ea735447b250056$export$33402c60aeb5385e).parseWkb(binaryReader, options);
            case (0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.GeometryCollection:
                return (0, $6fbcdde72a2b135b$export$914c76c60a2662a).parseWkb(binaryReader, options);
            default:
                throw new Error("GeometryType " + geometryType + " not supported");
        }
    }
    static parseTwkb(value) {
        const options = {};
        const binaryReader = value instanceof (0, $6f59db5aecb64db1$export$76c443c41c20b286) ? value : new (0, $6f59db5aecb64db1$export$76c443c41c20b286)(value, true);
        const type = binaryReader.readUInt8();
        const metadataHeader = binaryReader.readUInt8();
        const geometryType = type & 0x0F;
        options.precision = (0, $c68ca8efa17f19ea$export$2f872c0f2117be69)(type >> 4);
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
            options.zPrecision = (0, $c68ca8efa17f19ea$export$2f872c0f2117be69)((extendedPrecision & 0x1C) >> 2);
            options.zPrecisionFactor = Math.pow(10, options.zPrecision);
            options.mPrecision = (0, $c68ca8efa17f19ea$export$2f872c0f2117be69)((extendedPrecision & 0xE0) >> 5);
            options.mPrecisionFactor = Math.pow(10, options.mPrecision);
        } else {
            options.hasZ = false;
            options.hasM = false;
        }
        if (options.hasSizeAttribute) binaryReader.readVarInt();
        if (options.hasBoundingBox) {
            let dimensions = 2;
            if (options.hasZ) dimensions++;
            if (options.hasM) dimensions++;
            for(var i = 0; i < dimensions; i++){
                binaryReader.readVarInt();
                binaryReader.readVarInt();
            }
        }
        switch(geometryType){
            case (0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.Point:
                return (0, $b88dec074129450a$export$baf26146a414f24a).parseTwkb(binaryReader, options);
            case (0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.LineString:
                return (0, $a4fb63b66e38f047$export$27733b973b72e710).parseTwkb(binaryReader, options);
            case (0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.Polygon:
                return (0, $0751656ec0b50546$export$7d31b617c820d435).parseTwkb(binaryReader, options);
            case (0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.MultiPoint:
                return (0, $475a4917f0b733ec$export$96afecae28385f21).parseTwkb(binaryReader, options);
            case (0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.MultiLineString:
                return (0, $29fb558284236d2d$export$67bf33efacdfe108).parseTwkb(binaryReader, options);
            case (0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.MultiPolygon:
                return (0, $2ea735447b250056$export$33402c60aeb5385e).parseTwkb(binaryReader, options);
            case (0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.GeometryCollection:
                return (0, $6fbcdde72a2b135b$export$914c76c60a2662a).parseTwkb(binaryReader, options);
            default:
                throw new Error("GeometryType " + geometryType + " not supported");
        }
    }
}


class $475a4917f0b733ec$export$96afecae28385f21 extends (0, $0a6c6bc697a854ef$export$d191e0c3149b3fac) {
    points;
    constructor(points, srid){
        super();
        this.points = points || [];
        this.srid = srid;
        if (this.points.length > 0) {
            this.hasZ = this.points[0].hasZ;
            this.hasM = this.points[0].hasM;
        }
    }
    static Z(points, srid) {
        const multiPoint = new $475a4917f0b733ec$export$96afecae28385f21(points, srid);
        multiPoint.hasZ = true;
        return multiPoint;
    }
    static M(points, srid) {
        const multiPoint = new $475a4917f0b733ec$export$96afecae28385f21(points, srid);
        multiPoint.hasM = true;
        return multiPoint;
    }
    static ZM(points, srid) {
        const multiPoint = new $475a4917f0b733ec$export$96afecae28385f21(points, srid);
        multiPoint.hasZ = true;
        multiPoint.hasM = true;
        return multiPoint;
    }
    static parseWkt(reader, options) {
        let multiPoint = new $475a4917f0b733ec$export$96afecae28385f21();
        multiPoint.srid = options.srid;
        multiPoint.hasZ = options.hasZ;
        multiPoint.hasM = options.hasM;
        if (reader.isMatch([
            "EMPTY"
        ])) return multiPoint;
        reader.expectGroupStart();
        multiPoint.points = reader.matchCoordinates(options).map((x)=>new (0, $b88dec074129450a$export$baf26146a414f24a)(x[0], x[1], x[2], x[3]));
        reader.expectGroupEnd();
        return multiPoint;
    }
    static parseWkb(reader, options) {
        let multiPoint = new $475a4917f0b733ec$export$96afecae28385f21();
        multiPoint.srid = options.srid;
        multiPoint.hasZ = options.hasZ;
        multiPoint.hasM = options.hasM;
        const pointCount = reader.readUInt32();
        for(var i = 0; i < pointCount; i++)multiPoint.points.push((0, $0f6a681c4346f47b$export$7acfa6ed01010e37).parse(reader, options));
        return multiPoint;
    }
    static parseTwkb(reader, options) {
        const multiPoint = new $475a4917f0b733ec$export$96afecae28385f21();
        multiPoint.hasZ = options.hasZ;
        multiPoint.hasM = options.hasM;
        if (options.isEmpty) return multiPoint;
        const previousPoint = new (0, $b88dec074129450a$export$baf26146a414f24a)(0, 0, options.hasZ ? 0 : undefined, options.hasM ? 0 : undefined);
        const pointCount = reader.readVarInt();
        for(var i = 0; i < pointCount; i++)multiPoint.points.push((0, $b88dec074129450a$export$baf26146a414f24a).readTwkbPoint(reader, options, previousPoint));
        return multiPoint;
    }
    toWkt() {
        if (this.points.length === 0) return this.getWktType((0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.MultiPoint, true);
        var wkt = this.getWktType((0, $faefaad95e5fcca0$export$4624c240901a6889).wkt.MultiPoint, false) + "(";
        for(var i = 0; i < this.points.length; i++)wkt += this.points[i].getWktCoordinate() + ",";
        wkt = wkt.slice(0, -1);
        wkt += ")";
        return wkt;
    }
    toWkb(options) {
        var wkb = new (0, $cce64cb23c6e3c70$export$b6da98667e5e554f)(this.getWkbSize(), false);
        wkb.writeInt8(1);
        wkb.writeUInt32(this.getWkbType((0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.MultiPoint, options), true);
        wkb.writeUInt32(this.points.length);
        for(var i = 0; i < this.points.length; i++)wkb.writeBuffer(this.points[i].toWkb({
            srid: this.srid
        }));
        return wkb.buffer.buffer;
    }
    toTwkb() {
        const writer = new (0, $cce64cb23c6e3c70$export$b6da98667e5e554f)(0, true);
        const precision = (0, $0a6c6bc697a854ef$export$d191e0c3149b3fac).getTwkbPrecision(5, 0, 0);
        const isEmpty = this.points.length === 0;
        this.writeTwkbHeader(writer, (0, $faefaad95e5fcca0$export$4624c240901a6889).wkb.MultiPoint, precision, isEmpty);
        if (this.points.length > 0) {
            writer.writeVarInt(this.points.length);
            const previousPoint = new (0, $b88dec074129450a$export$baf26146a414f24a)(0, 0, 0, 0);
            for(let i = 0; i < this.points.length; i++)this.points[i].writeTwkbPoint(writer, precision, previousPoint);
        }
        return writer.buffer.buffer;
    }
    getWkbSize() {
        var coordinateSize = 16;
        if (this.hasZ) coordinateSize += 8;
        if (this.hasM) coordinateSize += 8;
        coordinateSize += 5;
        return 9 + this.points.length * coordinateSize;
    }
}







//# sourceMappingURL=main.js.map
