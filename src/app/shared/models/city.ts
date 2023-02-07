import { Country } from './country';

export class City {
  id?: string;
  // tslint:disable-next-line:variable-name
  _id?: string;
  code?: string;
  countryId?: Country;
  cityName?: string;
}
