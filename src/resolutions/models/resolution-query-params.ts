import { unixMillisecondsToDate } from '../../util/times';
import { CustomGeoJson } from 'src/global/models/custom-geojson';
import { MIN_KEYOWRD_LENGTH } from 'src/global/constants';
import { validateGeojson } from 'src/util';
import { QueryParams } from 'src/global/models/query-params';

export class ResolutionQueryParams implements QueryParams {
    public from: Date;
    public to: Date;
    public keywords: string[] = [];
    public includeConflict: boolean;
  
    constructor(from?: number, to?: number, public geojson?: CustomGeoJson, keywords?: string[]) {
      this.from = unixMillisecondsToDate(from);
      this.to = unixMillisecondsToDate(to);
      if (keywords) {
        // filter by word length
        keywords = keywords.filter(keyword =>
          keyword.length >= MIN_KEYOWRD_LENGTH
        );
        // store unique values
        this.keywords = [...new Set(keywords)];
      }
    }
  
    isValid(): boolean {
      if (this.from && this.to && this.from >= this.to) {
        return false;
      }
        return this.geojson ? (validateGeojson(this.geojson)?.length === 0) : true;
    }
  };