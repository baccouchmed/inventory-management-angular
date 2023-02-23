import { Observable } from 'rxjs';

export class RefList<T> {
  key: T;
  value: string;
  nextStep?: any[];
  files?: string[];
  features?: string[];
  subValue?: string;
  link?: string;
  observable?: Observable<any>;
}
