import { RefList } from '../models/ref-list';

export enum StatusCompany {
  pending = 'pending',
  validated = 'validated',
  rejected = 'rejected',
}

export const listStatusCompany: RefList<StatusCompany>[] = [
  { key: StatusCompany.pending, value: 'pending' },
  { key: StatusCompany.validated, value: 'validated' },
  { key: StatusCompany.rejected, value: 'rejected' },
];
