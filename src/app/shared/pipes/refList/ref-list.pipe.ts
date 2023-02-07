import { Pipe, PipeTransform } from '@angular/core';
import { RefList } from '../../models/ref-list';
import { StatusEnum } from '../../enums/status';
import { SortEnum } from '../../enums/sort';
import { Civility } from '../../enums/civility';
import { Roles } from '../../enums/roles';
import { StateEnum } from '../../enums/state';
import { Identifiers } from '../../enums/identifiers';

@Pipe({
  name: 'refList',
})
export class RefListPipe implements PipeTransform {
  transform(
    value: SortEnum | StatusEnum | Civility | Roles | StateEnum | Identifiers,
    list: RefList<SortEnum | StatusEnum | Civility | Roles | StateEnum | Identifiers>[],
    valueType?: 'value' | 'subValue',
  ): string {
    const myRef = list.find((refValue) => refValue.key === value);
    if (valueType) {
      return myRef[valueType];
    }
    return myRef.value;
  }
}
