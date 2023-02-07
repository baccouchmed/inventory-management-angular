import { RefList } from '../models/ref-list';

export enum Periods {
  days = 'days',
  week = 'week',
  month = 'month',
  year = 'year',
  personalize = 'personalize',
}

export const listPeriod: RefList<Periods>[] = [
  { key: Periods.days, value: 'Quotidien' },
  { key: Periods.week, value: 'Hebdomadaire' },
  { key: Periods.month, value: 'Mensuel' },
  { key: Periods.year, value: 'Annuel' },
  { key: Periods.personalize, value: 'Personnaliser' },
];
