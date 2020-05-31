import { postgis } from '../../global/services/postgis'
import { unixToDate } from '../../util/times';
import { setSRID, createGeometry } from '../../global/services/postgis/util'

const minKeywordLength = 3;
const keywordInFields = [
  'description',
  'source_server',
  'target_server',
];

export class ConflictQueryParams {
  public from: Date;
  public to: Date;
  public polygon: any;
  public keywords: string[] = []

  constructor(from?: number, to?: number, coordinates?: string, keywords?: string, public hasResolved?: boolean) {
    this.from = unixToDate(from);
    this.to = unixToDate(to);
    if (keywords) {
      // remove spaces
      keywords = keywords.replace(/\s+/g, '')
      // split to array of words
      let keywordsArray = keywords.split(',');
      // filter by word length
      keywordsArray = keywordsArray.filter(k =>
        k.length >= minKeywordLength
      );
      // store unique values
      this.keywords = [...new Set(keywordsArray)];
    }
    if (coordinates) {
      const coordinatesArray = coordinates
        .split(',')
        .map((coordinate) => coordinate.split('@'))
        .map((c) => c.map((cc) => parseFloat(cc)));
      this.polygon = createGeometry(coordinatesArray, 'Polygon');
    }
  }

  isValid(): boolean {
    if (this.from && this.to && this.from > this.to) {
      return false;
    }
    return true;
  }

  buildQuery(query) {
    if (this.polygon) {
      query.where(postgis.within(setSRID('location'), setSRID(this.polygon)));
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
