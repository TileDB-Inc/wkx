import { Types, WKTParseOptions } from "./types";

export class WktParser {
  private position: number;
  private value: string;

  constructor(value: string) {
    this.value = value;
    this.position = 0;
  }

  public matchRegex(tokens: RegExp[]) {
    this.skipWhitespaces();
  
    for (let i = 0; i < tokens.length; i++) {
      const match = this.value.substring(this.position).match(tokens[i]);
  
      if (match) {
        this.position += match[0].length;
        return match;
      }
    }
  
    return null;
  };

  private match(tokens: string[]) {
    this.skipWhitespaces();

    for (let i = 0; i < tokens.length; i++) {
      if (this.value.substring(this.position).indexOf(tokens[i]) === 0) {
        this.position += tokens[i].length;
        return tokens[i];
      }
    }

    return null;
  }

  public matchDimension(): WKTParseOptions {
    const dimension = this.match(['ZM', 'Z', 'M']);
  
    switch (dimension) {
      case 'ZM': return { hasZ: true, hasM: true };
      case 'Z': return { hasZ: true, hasM: false };
      case 'M': return { hasZ: false, hasM: true };
      default: return { hasZ: false, hasM: false };
    }
  };

  public isMatch(tokens: string[]) {
    this.skipWhitespaces();
  
    for (let i = 0; i < tokens.length; i++) {
      if (this.value.substring(this.position).indexOf(tokens[i]) === 0) {
        this.position += tokens[i].length;
        return true;
      }
    }
  
    return false;
  };

  public matchType() {
    const geometryType = this.match([Types.wkt.Point, Types.wkt.LineString, Types.wkt.Polygon, Types.wkt.MultiPoint,
    Types.wkt.MultiLineString, Types.wkt.MultiPolygon, Types.wkt.GeometryCollection]);
  
    if (!geometryType)
      throw new Error('Expected geometry type');
  
    return geometryType;
  };

  public expectGroupStart() {
    if (!this.isMatch(['(']))
      throw new Error('Expected group start');
  };
  
  public expectGroupEnd() {
    if (!this.isMatch([')']))
      throw new Error('Expected group end');
  };
  
  public matchCoordinate(options: WKTParseOptions) {
    let match;
  
    if (options.hasZ && options.hasM)
      match = this.matchRegex([/^(\S*)\s+(\S*)\s+(\S*)\s+([^\s,)]*)/]);
    else if (options.hasZ || options.hasM)
      match = this.matchRegex([/^(\S*)\s+(\S*)\s+([^\s,)]*)/]);
    else
      match = this.matchRegex([/^(\S*)\s+([^\s,)]*)/]);
  
    if (!match)
      throw new Error('Expected coordinates');
  
    if (options.hasZ && options.hasM)
      return [parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3]), parseFloat(match[4])];
    else if (options.hasZ)
      return [parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3]), undefined];
    else if (options.hasM)
      return [parseFloat(match[1]), parseFloat(match[2]), undefined, parseFloat(match[3])];
    else
      return [parseFloat(match[1]), parseFloat(match[2]), undefined, undefined];
  };
  
  public matchCoordinates(options: WKTParseOptions) {
    const coordinates = [];
  
    do {
      const startsWithBracket = this.isMatch(['(']);
  
      coordinates.push(this.matchCoordinate(options));
  
      if (startsWithBracket)
        this.expectGroupEnd();
    } while (this.isMatch([',']));
  
    return coordinates;
  };

  private skipWhitespaces() 
  {
    while (this.position < this.value.length && this.value[this.position] === ' ')
      this.position++;
  }
}

