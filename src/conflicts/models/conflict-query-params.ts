import { unixMillisecondsToDate } from '../../util/times';
import { CustomGeoJson } from 'src/global/models/custom-geojson';
import { minKeywordLength } from 'src/global/constants';
import { validateGeojson } from 'src/util';
import { QueryParams } from 'src/global/models/query-params';

export class ConflictQueryParams implements QueryParams {
  public from: Date;
  public to: Date;
  public keywords: string[] = [];

  constructor(from?: number, to?: number, public geojson?: CustomGeoJson, keywords?: string[], public hasResolved?: boolean) {
    this.from = unixMillisecondsToDate(from);
    this.to = unixMillisecondsToDate(to);
    if (keywords) {
      // filter by word length
      keywords = keywords.filter(keyword =>
        keyword.length >= minKeywordLength
      );
      // store unique values
      this.keywords = [...new Set(keywords)];
    }
  }

  isValid(): boolean {
    if (this.from && this.to && this.from > this.to) {
      return false;
    }
      return this.geojson ? (validateGeojson(this.geojson)?.length === 0) : true;
  }
};
