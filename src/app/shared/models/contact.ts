import { Company } from './company';
import { ThirdParty } from './third-party';
import { TypeThirdParty } from './third-party-type';
import { Country } from './country';
import { City } from './city';
import { User } from './user';

export class Contact {
  id?: string;
  // tslint:disable-next-line:variable-name
  _id?: string;
  companyId?: Company;
  code?: string;
  name?: string;
  phone?: string;
  fax?: string;
  email?: string;
  address?: string;
  countryId?: Country;
  cityId?: City;
  postalCode?: string;
  job?: string;
  website?: string;
  usersId?: User;
  contactIdParent?: Contact;
  thirdPartyTypeId?: TypeThirdParty;
  thirdPartyId?: ThirdParty;
  usersCreation?: User;
  usersLastUpdate?: User;
  createdAt?: string;
  updatedAt?: string;
}
