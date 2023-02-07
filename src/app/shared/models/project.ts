import { User } from './user';
import { Local } from './local';

export class Project {
  id?: string;
  // tslint:disable-next-line:variable-name
  _id?: string;
  label?: string;
  defaultLocal?: Local;
  usersCreation?: User;
  usersLastUpdate?: User;
  createdAt?: string;
  updatedAt?: string;
  code?: string;
}
