import { RefList } from '../models/ref-list';

export enum StateEnum {
  enable = 'enable',
  disable = 'disable',
}

export const listState: RefList<StateEnum>[] = [
  { key: StateEnum.enable, value: 'enable' },
  { key: StateEnum.disable, value: 'disable' },
];
