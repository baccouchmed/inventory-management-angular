import { TypeCompany } from '../enums/types-company';
import { Country, Governorate, Municipality } from './country';
import { StatusContract } from '../enums/status-contract';

export class Company {
  id?: string;
  _id?: string;
  code?: string;
  name?: string;
  identifier?: string;
  address?: string;
  postalCode?: string;
  phone?: string;
  fax?: string;
  email?: string;
  logo?: string;
  createdAt?: string;
  type?: TypeCompany;
  governorateId?: Governorate;
  municipalityId?: Municipality;
  countryId?: Country;
  statusContract?: StatusContract;
  creator?: boolean;
}
