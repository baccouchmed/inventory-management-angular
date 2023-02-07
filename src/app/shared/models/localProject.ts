import { User } from './user';
import { Local } from './local';

export class LocalProject {
  id?: string;
  // tslint:disable-next-line:variable-name
  _id?: string;
  localId: Local;
  projectId: string;
  status: boolean;
  usersCreation: User;
  usersLastUpdate: User;
}
