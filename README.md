wkx
========

A WKT/WKB/EWKT/EWKB/TWKB parser and serializer with support for

- Point
- LineString
- Polygon
- MultiPoint
- MultiLineString
- MultiPolygon
- GeometryCollection

Examples
--------

The following examples show you how to work with wkx.

```javascript
import { Parser, Point } from '@tiledb-inc/wkx'

//Parsing a WKT string
const geometry = Parser.parse('POINT(1 2)');

//Parsing an EWKT string
const geometry = Parser.parse('SRID=4326;POINT(1 2)');

//Parsing an ArrayBuffer containing a WKB object
const geometry = Parser.parse(new DataView(wkbBuffer));

//Parsing an ArrayBuffer containing an EWKB object
const geometry = Parser.parse(new DataView(ewkbBuffer));

//Parsing an ArrayBuffer containing a TWKB object
const geometry = Parser.parseTwkb(new DataView(twkbBuffer));

//Serializing a Point geometry to WKT
const wktString = new Point(1, 2).toWkt();

//Serializing a Point geometry to WKB
const wkbBuffer = new Point(1, 2).toWkb();

//Serializing a Point geometry to EWKT
const ewktString = new Point(1, 2, undefined, undefined, 4326).toEwkt();

//Serializing a Point geometry to EWKB
const ewkbBuffer = new Point(1, 2, undefined, undefined, 4326).toEwkb();

//Serializing a Point geometry to TWKB
const twkbBuffer = new Point(1, 2).toTwkb();
```
