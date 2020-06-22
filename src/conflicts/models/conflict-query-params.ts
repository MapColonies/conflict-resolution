import { postgis } from '../../global/services/postgis'
import { unixToDate } from '../../util/times';
import { DEFAULT_SRID, createGeometryFromGeojson } from '../../global/services/postgis/util'
import { CustomGeoJson } from 'src/global/models/custom-geojson';

const minKeywordLength = 3;
const keywordInFields = [
  'description',
  'source_server',
  'target_server',
];

export class ConflictQueryParams {
  public from: Date;
  public to: Date;
  public geojson: any;
  public keywords: string[] = []

  constructor(from?: number, to?: number, geojson?: CustomGeoJson, keywords?: string[], public hasResolved?: boolean) {
    this.from = unixToDate(from);
    this.to = unixToDate(to);
    if (keywords) {
      // filter by word length
      keywords = keywords.filter(k =>
        k.length >= minKeywordLength
      );
      // store unique values
      this.keywords = [...new Set(keywords)];
    }
    
    // if (coordinates) {
    //   const coordinatesArray = coordinates
    //     .split(',')
    //     .map((coordinate) => coordinate.split('@'))
    //     .map((c) => c.map((cc) => parseFloat(cc)));
    //   this.polygon = createGeometry(coordinatesArray, 'Polygon');
    // }

    // TODO: validate geojson & test
    if (geojson) {
      this.geojson = createGeometryFromGeojson(geojson);
    }   
  }

  isValid(): boolean {
    if (this.from && this.to && this.from > this.to) {
      return false;
    }
    return true;
  }

  buildQuery(query) {
    if (this.geojson) {
      const geometryA = postgis.setSRID('location', DEFAULT_SRID);
      const geometryB = postgis.setSRID(this.geojson, DEFAULT_SRID);
      query.where(postgis.within(geometryA, geometryB));
      query.orWhere(postgis.intersects(geometryA, geometryB));
    }
    if (this.hasResolved !== undefined) {
      query.where('has_resolved', this.hasResolved);
    }
    if (this.keywords.length > 0) {
      query.where((q) => {
        this.keywords.map((keyword) => {
          keywordInFields.forEach((field) =>
            q.orWhere(field, 'LIKE', `%${keyword}%`)
          );
        });
      });
    }
    this.timeQuery(query, 'created_at', this.from, this.to);
  }

  private timeQuery = (query, fieldName: string, from: Date, to: Date) => {
    if (from && to) {
      query.whereBetween(fieldName, [from, to]);
      return;
    }
    if (from) {
      query.where(fieldName, '>=', from);
      return;
    }
    if (to) {
      query.where(fieldName, '<', to);
    }
  };
};
