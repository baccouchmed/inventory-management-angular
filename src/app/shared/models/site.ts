import { Country } from './country';
import { Company } from './company';
import { City } from './city';
import { User } from './user';

export class Site {
  id?: string;
  // tslint:disable-next-line:variable-name
  _id?: string;
  companyId?: Company;
  code?: String;
  label?: String;
  countryId?: Country;
  cityId?: City;
  address?: String;
  usersCreation?: User;
  usersLastUpdate?: User;
}
