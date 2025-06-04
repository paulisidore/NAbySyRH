import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {
   private apiTransactionUrl = 'https://kssv.homeip.net/gs_api.php';
  constructor(private http: HttpClient,) { }

  /**
   * Save transaction to KSSV Management server
   *
   * @param trans
   * @returns
   */
  async saveTransaction(trans: IKSSVTransactionSalaire) {
    let url = this.apiTransactionUrl + '?Action=ADD_TRANSACTION&CLIENT_GENERAL=1&OPERATEUR=' + environment.userName  ;
    url += '&IDBOUTIQUE=' + trans.idBoutique;
    url += '&MONTANT='+''+trans.montant;
    url += '&NOM='+trans.libelle;
    url += '&MODEPAIEMENT='+trans.modePayment;
    url += '&IsActiviteGeneral=1';
    console.log('Saving transaction to KSSV server: ' , url);
    return this.http.get(url);
  }
}

export interface IKSSVTransactionSalaire {
  idBoutique?: number;
  id?: number;
  montant: number;
  modePayment?: string;
  libelle: string;
  date?: string;
}
