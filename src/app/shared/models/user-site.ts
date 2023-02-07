import { Company } from './company';
import { User } from './user';
import { Site } from './site';

export class UserSite {
  id?: string;
  // tslint:disable-next-line:variable-name
  _id?: string;
  companyId?: Company;
  siteId?: Site;
  usersId?: User;
}
