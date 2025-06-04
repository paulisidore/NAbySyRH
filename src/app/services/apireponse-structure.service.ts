/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApireponseStructureService {

  constructor() { }
}

export interface IApiNotification {
  Action?: string;
  OK?: number|0|1;
  TxErreur?: string ;
  Extra?: any ;
  Contenue?: any ;
  Autre?: any ;
}
