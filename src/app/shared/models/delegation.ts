import { Country } from './country';

export class Delegation {
  id?: string;
  // tslint:disable-next-line:variable-name
  _id?: string;
  code?: string;
  countryId?: Country;
  delegationName?: string;
}
