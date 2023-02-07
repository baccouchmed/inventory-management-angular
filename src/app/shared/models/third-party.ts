import { TypeThirdParty } from './third-party-type';
import { Company } from './company';
export class ThirdParty {
  id?: string;
  // tslint:disable-next-line:variable-name
  _id?: string;
  companyId?: Company;
  code?: string;
  label?: string;
  email?: string;
  phone?: string;
  fax?: string;
  type?: string;
  firstName?: string;
  lastName?: string;
  thirdPartyTypeId?: TypeThirdParty;
  nature?: string;
  typeIdentifier?: string;
  identifier?: string;
  address?: string;
  postalCode?: string;
  webSite?: string;
  managerName?: string;
  activityDomain?: string;
  gender?: string;
}
