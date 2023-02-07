import { RefList } from '../models/ref-list';

export enum Civility {
  mrs = 'mrs',
  sir = 'sir',
}

export const listCivility: RefList<Civility>[] = [
  { key: Civility.mrs, value: 'Madame' },
  { key: Civility.sir, value: 'Monsieur' },
];
