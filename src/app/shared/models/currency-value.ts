import { Company } from './company';
import { Currency } from './currency';

export class CurrencyValue {
  id?: string;
  // tslint:disable-next-line:variable-name
  _id?: string;
  companyId?: Company;
  currencyId?: Currency;
  date?: Date;
  value?: number;
}
