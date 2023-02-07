import { TypeCompany } from '../enums/types-company';

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
}
