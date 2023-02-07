import { RefList } from '../models/ref-list';

export enum ThirdPartyTypeNature {
  customer = 'customer',
  supplier = 'supplier',
  employee = 'employee',
  other = 'other',
}

export const listThirdPartyTypeNature: RefList<ThirdPartyTypeNature>[] = [
  { key: ThirdPartyTypeNature.customer, value: 'customer' },
  { key: ThirdPartyTypeNature.supplier, value: 'supplier' },
  { key: ThirdPartyTypeNature.employee, value: 'employee' },
  { key: ThirdPartyTypeNature.other, value: 'other' },
];
