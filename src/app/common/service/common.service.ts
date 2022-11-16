import {Injectable} from '@angular/core';
import {NumberService} from '../util/number.service';
import {DateService} from '../util/date.service';

@Injectable()
export class CommonService {
  constructor(
    private numberService: NumberService,
    private dateService: DateService
  ) {
  }

  getAuditNumber() {
    return this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd') +
      (this.numberService.getRandomNumber(999999999)).toString().padStart(9, '0');
  }

  base64toBlob(base64Data, contentType): Blob {
    contentType = contentType || '';
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, {type: contentType});
  }
  public async sleep(millis: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, millis);
    });
  }
}
