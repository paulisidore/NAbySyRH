/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {firstValueFrom, map } from 'rxjs' ;

@Injectable({
  providedIn: 'root'
})
export class CommonKssvServiceService {

  constructor(private http: HttpClient,) { }

  /**
   * Retourne la liste des boutiques
   *
   * @returns Liste des boutiques
   */
  async getListeBoutiques(): Promise<xLBoutique[]> {
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded' );
    const param="Action=GET_LISTE_BOUTIQUE&CLIENT_GENERAL=1";
    const apiUrl=environment.nabysyGS.messagingEndpoint+"?"+param;
    console.log('demande la liste des Boutiques via get: '+apiUrl);
    const liste = await firstValueFrom(
      this.http.get<xLBoutique[]>(apiUrl, { headers, responseType: 'json' }).pipe(
        map((boutiques: xLBoutique[]) => boutiques.map(bout => new xLBoutique(bout)))
      )
    );
    return liste;
  }
}


// eslint-disable-next-line @typescript-eslint/naming-convention
export class xReponseAPI {
  OK: number = 0;
  Extra: any ;
  Source: any ;
  TxErreur: string ="";
  Contenue: any ;
  Autres: any;
}

export class xLBoutique {
  ID: number =0;
  NOM: string ='';
  constructor(oBj: object = {}){
    Object.assign(this,oBj);
  }
}
