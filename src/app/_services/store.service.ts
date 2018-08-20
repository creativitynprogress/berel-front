import { Injectable } from "@angular/core";

@Injectable()

export class StoreService {
  constructor() {}

  store(collection: string, data: any) {
    localStorage.setItem(collection, JSON.stringify(data));
  }


}
