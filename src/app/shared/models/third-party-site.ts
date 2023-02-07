import { Country } from './country';
import { Company } from './company';
import { City } from './city';
import { User } from './user';
import { ThirdParty } from './third-party';
import { TypeThirdParty } from './third-party-type';

export class ThirdPartySite {
  id?: string;
  // tslint:disable-next-line:variable-name
  _id?: string;
  companyId?: Company;
  thirdPartyTypeId?: TypeThirdParty;
  thirdPartyId?: ThirdParty;
  label?: String;
  countryId?: Country;
  cityId?: City;
  address?: String;
  usersCreation?: User;
  usersLastUpdate?: User;
}
