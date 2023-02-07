import { User } from './user';
import { LocalProject } from './localProject';
import { Company } from './company';

export class LocalCompany {
  id?: string;
  // tslint:disable-next-line:variable-name
  _id?: string;
  companyId: Company;
  localProjectId: LocalProject;
  status: boolean;
  usersCreation: User;
  usersLastUpdate: User;
}
