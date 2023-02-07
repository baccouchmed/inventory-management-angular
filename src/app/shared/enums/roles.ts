import { RefList } from '../models/ref-list';

export enum Roles {
  admin = 'admin',
  client = 'client',
}

export const listRoles: RefList<Roles>[] = [
  { key: Roles.admin, value: 'Admin' },
  { key: Roles.client, value: 'Client' },
];
