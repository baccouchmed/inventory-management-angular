import { Company } from './company';
export class Feature {
  id?: string;
  // tslint:disable-next-line:variable-name
  _id?: string;
  companyId?: Company;
  code?: string;
  title?: string;
  link?: string;
  subtitle?: string;
  order?: number;
  status?: string;
  type: string;
  icon: string;
  divider: boolean;
  featuresIdParent?: Feature;
}

export class ResToken {
  token: string;
}
