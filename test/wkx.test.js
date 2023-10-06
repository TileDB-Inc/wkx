import { Parser } from '../src/parser';
import { Point as point } from '../src/point';
import { LineString  as lineString} from '../src/linestring';
import { Polygon as polygon } from '../src/polygon';
import { MultiLineString as multiLineString } from '../src/multilinestring';
import { MultiPoint as multiPoint } from '../src/multipoint';
import { MultiPolygon as multiPolygon } from '../src/multipolygon';
import { GeometryCollection as geometryCollection } from '../src/geometrycollection';

var Point = point;
var LineString = lineString;
var Polygon = polygon;
var MultiPoint = multiPoint;
var MultiLineString = multiLineString;
var MultiPolygon = multiPolygon;
var GeometryCollection = geometryCollection;

var tests = {
  '2D': require('./testdata.json'),
  'Z': require('./testdataZ.json'),
  'M': require('./testdataM.json'),
  'ZM': require('./testdataZM.json')
};

var issueTests = require('./issuetestdata.json');

function assertParseWkt(data) {
  expect(Parser.parse(data.wkt)).toEqual(eval(data.geometry));
}

function assertParseWkb(data) {
  let geometry = data.wkbGeometry ? data.wkbGeometry : data.geometry;
  geometry = eval(geometry);
  geometry.srid = undefined;

  const array = new Uint8Array(data.wkb.match(/[\da-f]{2}/gi).map(function (h) { return parseInt(h, 16) }));
  expect(Parser.parse(new DataView(array.buffer))).toEqual(geometry);
}

function assertParseWkbXdr(data) {
  let geometry = data.wkbGeometry ? data.wkbGeometry : data.geometry;
  geometry = eval(geometry);
  geometry.srid = undefined;

  const array = new Uint8Array(data.wkbXdr.match(/[\da-f]{2}/gi).map(function (h) { return parseInt(h, 16) }));
  expect(Parser.parse(new DataView(array.buffer))).toEqual(geometry);
}

function assertParseEwkt(data) {
  let geometry = eval(data.geometry);
  geometry.srid = 4326;

  expect(Parser.parse('SRID=4326;' + data.wkt)).toEqual(geometry);
}

function assertParseEwkb(data) {
  let geometry = data.wkbGeometry ? data.wkbGeometry : data.geometry;
  geometry = eval(geometry);
  geometry.srid = 4326;

  const array = new Uint8Array(data.ewkb.match(/[\da-f]{2}/gi).map(function (h) { return parseInt(h, 16) }));
  expect(Parser.parse(new DataView(array.buffer))).toEqual(geometry);
}

function assertParseEwkbXdr(data) {
  let geometry = data.wkbGeometry ? data.wkbGeometry : data.geometry;
  geometry = eval(geometry);
  geometry.srid = 4326;

  const array = new Uint8Array(data.ewkbXdr.match(/[\da-f]{2}/gi).map(function (h) { return parseInt(h, 16) }));
  expect(Parser.parse(new DataView(array.buffer))).toEqual(geometry);
}

function assertParseEwkbNoSrid(data) {
  let geometry = data.wkbGeometry ? data.wkbGeometry : data.geometry;
  geometry = eval(geometry);

  const array = new Uint8Array(data.ewkbNoSrid.match(/[\da-f]{2}/gi).map(function (h) { return parseInt(h, 16) }));
  expect(Parser.parse(new DataView(array.buffer))).toEqual(geometry);
}

function assertParseEwkbXdrNoSrid(data) {
  let geometry = data.wkbGeometry ? data.wkbGeometry : data.geometry;
  geometry = eval(geometry);

  const array = new Uint8Array(data.ewkbXdrNoSrid.match(/[\da-f]{2}/gi).map(function (h) { return parseInt(h, 16) }));
  expect(Parser.parse(new DataView(array.buffer))).toEqual(geometry);
}

function assertParseTwkb(data) {
  let geometry = eval(data.geometry);
  geometry.srid = undefined;

  const array = new Uint8Array(data.twkb.match(/[\da-f]{2}/gi).map(function (h) { return parseInt(h, 16) }));
  expect(Parser.parseTwkb(new DataView(array.buffer))).toEqual(geometry);
}

function assertToWkt(data) {
  expect(eval(data.geometry).toWkt()).toEqual(data.wkt);
}

function assertToWkb(data) {
  let array = new Uint8Array(eval(data.geometry).toWkb());
  let hex = Array.from(array).map(x => x.toString(16).padStart(2, '0')).join('');

  expect(hex).toEqual(data.wkb);
}

function assertToEwkt(data) {
  let geometry = eval(data.geometry);
  geometry.srid = 4326;

  expect(geometry.toEwkt()).toEqual('SRID=4326;' + data.wkt);
}

function assertToEwkb(data) {
  let geometry = eval(data.geometry);
  geometry.srid = 4326;

  let array = new Uint8Array(geometry.toEwkb());
  let hex = Array.from(array).map(x => x.toString(16).padStart(2, '0')).join('');

  expect(hex).toEqual(data.ewkb);
}

function assertToTwkb(data) {
  let array = new Uint8Array(eval(data.geometry).toTwkb());
  let hex = Array.from(array).map(x => x.toString(16).padStart(2, '0')).join('');

  expect(hex).toEqual(data.twkb);
}

describe('Geometry', function () {
  it('parse(wkt) - coordinate', function () {
    expect(Parser.parse('POINT(1 2)')).toEqual(new Point(1, 2));
    expect(Parser.parse('POINT(1.2 3.4)')).toEqual(new Point(1.2, 3.4));
    expect(Parser.parse('POINT(1 3.4)')).toEqual(new Point(1, 3.4));
    expect(Parser.parse('POINT(1.2 3)')).toEqual(new Point(1.2, 3));

    expect(Parser.parse('POINT(-1 -2)')).toEqual(new Point(-1, -2));
    expect(Parser.parse('POINT(-1 2)')).toEqual(new Point(-1, 2));
    expect(Parser.parse('POINT(1 -2)')).toEqual(new Point(1, -2));

    expect(Parser.parse('POINT(-1.2 -3.4)')).toEqual(new Point(-1.2, -3.4));
    expect(Parser.parse('POINT(-1.2 3.4)')).toEqual(new Point(-1.2, 3.4));
    expect(Parser.parse('POINT(1.2 -3.4)')).toEqual(new Point(1.2, -3.4));

    expect(Parser.parse('POINT(1.2e1 3.4e1)')).toEqual(new Point(12, 34));
    expect(Parser.parse('POINT(1.2e-1 3.4e-1)')).toEqual(new Point(0.12, 0.34));
    expect(Parser.parse('POINT(-1.2e1 -3.4e1)')).toEqual(new Point(-12, -34));
    expect(Parser.parse('POINT(-1.2e-1 -3.4e-1)')).toEqual(new Point(-0.12, -0.34));

    expect(Parser.parse('MULTIPOINT(1 2,3 4)')).toEqual(new MultiPoint([new Point(1, 2), new Point(3, 4)]));
    expect(Parser.parse('MULTIPOINT(1 2, 3 4)')).toEqual(new MultiPoint([new Point(1, 2), new Point(3, 4)]));
    expect(Parser.parse('MULTIPOINT((1 2),(3 4))')).toEqual(new MultiPoint([new Point(1, 2), new Point(3, 4)]));
    expect(Parser.parse('MULTIPOINT((1 2), (3 4))')).toEqual(new MultiPoint([new Point(1, 2), new Point(3, 4)]));
  });
  it('parse() - invalid input', function () {
    expect(Parser.parse).toThrow(/first argument must be a string or Buffer/);
    expect(() => Parser.parse('TEST')).toThrow(/Expected geometry type/);
    expect(() => Parser.parse('POINT)')).toThrow(/Expected group start/);
    expect(() => Parser.parse('POINT(1 2')).toThrow(/Expected group end/);
    expect(() => Parser.parse('POINT(1)')).toThrow(/Expected coordinates/);
    expect(() => Parser.parse('TEST')).toThrow(/Expected geometry type/);

    let hex = '010800000000000000';
    let array = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) { return parseInt(h, 16) }));
    expect(() => Parser.parse(new DataView(array.buffer))).toThrow(/GeometryType 8 not supported/);
  });
  it('parse(wkt) - #31', function () {
    expect(Parser.parse(issueTests['#31'].wkt)).toEqual(eval(issueTests['#31'].geometry));
  });
});

function createTest(testKey, testData) {
  describe(testKey, function () {
    it('parse(wkt)', function () {
      assertParseWkt(testData[testKey]);
    });
    it('parse(wkb)', function () {
      assertParseWkb(testData[testKey]);
    });
    it('parse(wkb xdr)', function () {
      assertParseWkbXdr(testData[testKey]);
    });
    it('parse(ewkt)', function () {
      assertParseEwkt(testData[testKey]);
    });
    it('parse(ewkb)', function () {
      assertParseEwkb(testData[testKey]);
    });
    it('parse(ewkb xdr)', function () {
      assertParseEwkbXdr(testData[testKey]);
    });
    it('parse(ewkb no srid)', function () {
      assertParseEwkbNoSrid(testData[testKey]);
    });
    it('parse(ewkb xdr no srid)', function () {
      assertParseEwkbXdrNoSrid(testData[testKey]);
    });
    it('parseTwkb()', function () {
      assertParseTwkb(testData[testKey]);
    });
    // it('parseGeoJSON()', function () {
    //   assertParseGeoJSON(testData[testKey]);
    // });
    it('toWkt()', function () {
      assertToWkt(testData[testKey]);
    });
    it('toWkb()', function () {
      assertToWkb(testData[testKey]);
    });
    it('toEwkt()', function () {
      assertToEwkt(testData[testKey]);
    });
    it('toEwkb()', function () {
      assertToEwkb(testData[testKey]);
    });
    it('toTwkb()', function () {
      assertToTwkb(testData[testKey]);
    });
    // it('toGeoJSON()', function () {
    //   assertToGeoJSON(testData[testKey]);
    // });
  });
}

function createTests(testKey, testData) {
  describe(testKey, function () {
    for (var testDataKey in testData) {
      createTest(testDataKey, testData);
    }
  });
}

for (var testKey in tests) {
  createTests(testKey, tests[testKey]);
}

