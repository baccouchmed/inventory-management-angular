import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  timePickerRange(
    beginHour = 0,
    endHour = 24,
    hourPeriod = 1,
    beginMinute = 0,
    endMinute = 60,
    minutePeriod = 30,
  ): string[] {
    const timePickerRangeArray = [];
    let k = 0;
    for (let hour = beginHour; hour < endHour; hour += hourPeriod) {
      for (let minute = beginMinute; minute < endMinute; minute += minutePeriod) {
        timePickerRangeArray[k++] = `${hour < 10 ? `0${hour}` : hour}:${
          minute < 10 ? `0${minute}` : minute
        }`;
      }
    }
    return timePickerRangeArray;
  }
  timePickerRangeQuarter(
    beginHour = 7,
    endHour = 22,
    hourPeriod = 1,
    beginMinute = 0,
    endMinute = 60,
    minutePeriod = 60,
  ): string[] {
    const timePickerRangeArray = [];
    let k = 0;
    for (let hour = beginHour; hour < endHour; hour += hourPeriod) {
      for (let minute = beginMinute; minute < endMinute; minute += minutePeriod) {
        timePickerRangeArray[k++] = `${hour < 10 ? `0${hour}` : hour}:${
          minute < 10 ? `0${minute}` : minute
        }`;
      }
    }
    return timePickerRangeArray;
  }
}
