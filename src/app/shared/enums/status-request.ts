import { RefList } from '../models/ref-list';

export enum StatusRequest {
  pending = 'pending',
  requestedValidate = 'requestedValidate',
  requesterValidate = 'requesterValidate',
  done = 'done',
}

export const listStatusRequest: RefList<StatusRequest>[] = [
  { key: StatusRequest.pending, value: 'pending' },
  { key: StatusRequest.requestedValidate, value: 'requested validate' },
  { key: StatusRequest.requesterValidate, value: 'requester validate' },
  { key: StatusRequest.done, value: 'done' },
];
