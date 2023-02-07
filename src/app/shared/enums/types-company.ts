import { RefList } from '../models/ref-list';

export enum TypeCompany {
  supplier = 'supplier',
  store = 'store',
  factory = 'factory',
}

export const listTypeCompany: RefList<TypeCompany>[] = [
  { key: TypeCompany.factory, value: 'factory' },
  { key: TypeCompany.supplier, value: 'supplier' },
  { key: TypeCompany.store, value: 'store' },
];
