import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusFormat',
})
export class StatusFormatPipe implements PipeTransform {
  // tslint:disable-next-line:typedef
  transform(listStatus: any[], status, role) {
    return listStatus
      .filter((data) => data.value === status)[0]
      .nextStep.filter((member) => member.member.includes(role))[0].status;
  }
}
