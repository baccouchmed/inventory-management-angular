import { User } from './user';

export class Local {
  id?: string;
  // tslint:disable-next-line:variable-name
  _id?: string;
  key?: string;
  label?: string;
  flag?: string;
  orientation?: string;
  order?: number;
  usersCreation?: User;
  usersLastUpdate?: User;
  createdAt?: string;
  updatedAt?: string;
}
