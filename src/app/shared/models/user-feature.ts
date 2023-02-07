import { Company } from './company';
import { Feature } from './feature';
import { User } from './user';

export class UserFeature {
  id?: string;
  // tslint:disable-next-line:variable-name
  _id?: string;
  companyId?: Company;
  usersId?: User;
  featuresId?: Feature;
  list?: boolean;
  status?: boolean;
  create?: boolean;
  read?: boolean;
  update?: boolean;
  delete?: boolean;
  defaultFeature?: boolean;
}
