import { RefList } from '../models/ref-list';

export enum Types {
  super = 'super',
  external = 'external',
  internal = 'internal',
}

export const listTypes: RefList<Types>[] = [
  { key: Types.super, value: 'super' },
  { key: Types.external, value: 'external' },
  { key: Types.internal, value: 'internal' },
];
