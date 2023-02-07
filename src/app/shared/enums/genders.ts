import { RefList } from '../models/ref-list';

export enum Genders {
  male = 'male',
  female = 'female',
}

export const listGenders: RefList<Genders>[] = [
  { key: Genders.male, value: 'male' },
  { key: Genders.female, value: 'female' },
];
