import { RefList } from '../models/ref-list';

export enum StatusContract {
  validate = 'validate',
  pending = 'pending',
  rejected = 'rejected',
  opened = 'opened',
}

export const listStatusContract: RefList<StatusContract>[] = [
  { key: StatusContract.validate, value: 'Validate' },
  { key: StatusContract.pending, value: 'Pending' },
  { key: StatusContract.rejected, value: 'Rejected' },
  { key: StatusContract.opened, value: 'Opened' },
];
