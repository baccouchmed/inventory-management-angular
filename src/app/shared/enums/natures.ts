import { RefList } from '../models/ref-list';

export enum Natures {
  physical = 'physical',
  moral = 'moral',
}

export const listNatures: RefList<Natures>[] = [
  { key: Natures.physical, value: 'physical' },
  { key: Natures.moral, value: 'moral' },
];
