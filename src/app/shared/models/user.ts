import { Local } from './local';
import { Company } from './company';
import { Group } from './group';
import { ThirdParty } from './third-party';
import { TypeThirdParty } from './third-party-type';
import { Site } from './site';

export class User {
  id?: string;
  // tslint:disable-next-line:variable-name
  _id?: string;
  companyId?: Company;
  code?: string;
  confirmationDate?: string;
  name?: string;
  email?: string;
  defaultSite?: Site;
  accountStatus?: boolean;
  groupsId?: Group;
  type?: string;
  avatar?: string;
  phone?: string;
  password?: string;
  defaultLocal?: Local;
  thirdPartyTypeId?: TypeThirdParty;
  thirdPartyId?: ThirdParty;
  usersCreation?: User;
  usersLastUpdate?: User;
  createdAt?: string;
  updatedAt?: string;
  state?: string;
}

export class ResToken {
  token: string;
}
