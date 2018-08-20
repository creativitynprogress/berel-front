import { Injectable } from '@angular/core'
import { Response } from "@angular/http"
@Injectable()

export class ToolsService {
  constructor() { }

  public extractData(response: Response) {
    return response.json();
  }
}
