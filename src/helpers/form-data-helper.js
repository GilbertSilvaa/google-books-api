
export class FormDataHelper {
  #form;
  constructor(form) {
    this.#form = new FormData(form);
  }

  json() {
    let data = {};

    for(const [key, value] of this.#form) {
      data = Object.assign(data, {[key]: value})
    }
    
    return data;
  }
}