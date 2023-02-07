import { RefList } from '../models/ref-list';

export enum SortEnum {
  createdAtUp = 'createdAtUp',
  createdAtDown = 'createdAtDown',
}

export const listSort: RefList<SortEnum>[] = [
  { key: SortEnum.createdAtUp, value: 'du plus ancien au plus récent' },
  { key: SortEnum.createdAtDown, value: 'du plus récent au plus ancien' },
];
