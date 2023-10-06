export const Types = {
  wkt: {
    Point: 'POINT',
    LineString: 'LINESTRING',
    Polygon: 'POLYGON',
    MultiPoint: 'MULTIPOINT',
    MultiLineString: 'MULTILINESTRING',
    MultiPolygon: 'MULTIPOLYGON',
    GeometryCollection: 'GEOMETRYCOLLECTION'
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
    Point: 'Point',
    LineString: 'LineString',
    Polygon: 'Polygon',
    MultiPoint: 'MultiPoint',
    MultiLineString: 'MultiLineString',
    MultiPolygon: 'MultiPolygon',
    GeometryCollection: 'GeometryCollection'
  }
};

export interface WKBExportOptions {
  srid?: number;
}

export interface WKTParseOptions {
  srid?: number;
  hasZ: boolean;
  hasM: boolean;
}

export interface WKBParseOptions {
  srid?: number;

  hasSrid: boolean;
  hasZ: boolean;
  hasM: boolean;
  isEwkb: boolean;
}

export interface Precision {
  xy: number;
  z: number;
  m: number;
  xyFactor:number;
  zFactor: number;
  mFactor: number;
}

export interface TWKBParseOptions {
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