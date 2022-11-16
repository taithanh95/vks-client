import {Injectable} from '@angular/core';

@Injectable()
export class StringService {
  constructor() {
  }

  capitalize(word?: string) {
    if (word != null){
      const words = word.split(" ");

      for (let i = 0; i < words.length; i++) {
        if (words[i] != ''){
          words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }
      }

      return words.join(" ");
    }
    return '';
  }
}
