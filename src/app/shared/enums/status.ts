import { RefList } from '../models/ref-list';

export enum StatusEnum {
  deleted = 'deleted',
  pending = 'pending',
  processing = 'processing',
  holding = 'holding',
  refused = 'refused',
  validated = 'validated',
  done = 'done',
  classified = 'classified',
}

export const listStatus: RefList<StatusEnum>[] = [
  {
    key: StatusEnum.deleted,
    value: 'deleted',
    nextStep: [
      { member: ['admin', 'technician'], status: ['deleted', 'pending', 'classified'] },
      { member: ['company', 'employee'], status: ['deleted', 'pending', 'classified'] },
    ],
  },
  {
    key: StatusEnum.pending,
    value: 'pending',
    nextStep: [
      { member: ['admin', 'technician'], status: ['processing', 'pending', 'classified'] },
      { member: ['company', 'employee'], status: ['deleted', 'pending', 'classified'] },
    ],
  },
  {
    key: StatusEnum.processing,
    value: 'processing',
    nextStep: [
      {
        member: ['admin', 'technician'],
        status: ['processing', 'pending', 'done', 'holding', 'classified'],
      },
      { member: ['company', 'employee'], status: ['processing', 'classified'] },
    ],
  },
  {
    key: StatusEnum.holding,
    value: 'holding',
    nextStep: [
      { member: ['admin', 'technician'], status: ['processing', 'holding', 'classified'] },
      { member: ['company', 'employee'], status: ['holding', 'classified'] },
    ],
  },
  {
    key: StatusEnum.done,
    value: 'done',
    nextStep: [
      { member: ['admin', 'technician'], status: ['done', 'processing', 'classified'] },
      { member: ['company', 'employee'], status: ['done', 'refused', 'validated', 'classified'] },
    ],
  },
  {
    key: StatusEnum.refused,
    value: 'refused',
    nextStep: [
      { member: ['admin', 'technician'], status: ['refused', 'processing', 'classified'] },
      { member: ['company', 'employee'], status: ['refused', 'classified'] },
    ],
  },
  {
    key: StatusEnum.validated,
    value: 'validated',
    nextStep: [
      { member: ['admin', 'technician'], status: ['validated'] },
      { member: ['company', 'employee'], status: ['validated'] },
    ],
  },
  {
    key: StatusEnum.classified,
    value: 'classified',
    nextStep: [
      { member: ['admin', 'technician'], status: ['classified', 'pending'] },
      { member: ['company', 'employee'], status: ['classified', 'pending'] },
    ],
  },
];
