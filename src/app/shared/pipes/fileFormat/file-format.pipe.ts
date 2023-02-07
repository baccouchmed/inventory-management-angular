import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileFormat',
})
export class FileFormatPipe implements PipeTransform {
  transform(file) {
    let fileExtension = 'file';
    switch (file) {
      case 'text/csv':
        fileExtension = 'csv';
        break;
      case 'application/csv':
        fileExtension = 'csv1';
        break;
      case 'application/json':
        fileExtension = 'json';
        break;
      case 'text/plain':
        fileExtension = 'txt';
        break;
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        fileExtension = 'xlsx';
        break;
      case 'application/vnd.ms-excel.sheet.binary.macroEnabled.12':
        fileExtension = 'xlsb';
        break;
      case 'application/vnd.ms-excel':
        fileExtension = 'xls';
        break;
      case 'application/vnd.ms-excel.sheet.macroEnabled.12':
        fileExtension = 'xlsm';
        break;
      case 'image/bmp':
        fileExtension = 'bmp';
        break;
      case 'image/gif':
        fileExtension = 'gif';
        break;
      case 'image/jpeg':
        fileExtension = 'jpg';
        break;
      case 'image/png':
        fileExtension = 'png';
        break;
      case 'application/msword':
        fileExtension = 'doc';
        break;
      case 'application/vnd.ms-word.document.macroEnabled.12':
        fileExtension = 'docm';
        break;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        fileExtension = 'docx';
        break;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.template':
        fileExtension = 'dotx';
        break;
      case 'application/vnd.ms-word.template.macroEnabled.12':
        fileExtension = 'dotm';
        break;
      case 'text/html':
        fileExtension = 'html';
        break;
      case 'application/pdf':
        fileExtension = 'pdf';
        break;
      case 'application/vnd.ms-powerpoint.template.macroEnabled.12':
        fileExtension = 'potm';
        break;
      case 'application/vnd.openxmlformats-officedocument.presentationml.template':
        fileExtension = 'potx';
        break;
      case 'application/vnd.ms-powerpoint.addin.macroEnabled.12':
        fileExtension = 'ppam';
        break;
      case 'application/vnd.openxmlformats-officedocument.presentationml.slideshow':
        fileExtension = 'pps';
        break;
      case 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12':
        fileExtension = 'ppsm';
        break;
      case 'application/vnd.ms-powerpoint':
        fileExtension = 'ppt';
        break;
      case 'application/vnd.ms-powerpoint.presentation.macroEnabled.12':
        fileExtension = 'pptm';
        break;
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        fileExtension = 'pptx';
        break;
      default:
        fileExtension = 'file';
        break;
    }
    return fileExtension;
  }
}
