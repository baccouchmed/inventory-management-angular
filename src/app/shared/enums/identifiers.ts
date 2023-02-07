import { RefList } from '../models/ref-list';

export enum Identifiers {
  tax = 'Tax registration number',
  cin = 'CIN',
  passport = 'Passport',
  permit = 'Residence permit',
}

export const listTypeIdentifiers: RefList<Identifiers>[] = [
  { key: Identifiers.tax, value: 'Tax registration number' },
  { key: Identifiers.cin, value: 'CIN' },
  { key: Identifiers.passport, value: 'Passport' },
  { key: Identifiers.permit, value: 'Residence permit' },
];
