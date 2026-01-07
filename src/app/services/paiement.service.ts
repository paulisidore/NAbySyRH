/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IReponseAPI } from './nabysy-global-service.service';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {
   private apiTransactionUrl = 'https://kssv.homeip.net/gs_api.php';
  constructor(private http: HttpClient,) { }

  /*** Modifie une historique d'avance sur salaire
   * @param idHistorique
   * @param montant
   * @returns
   */
  async editHistoriqueSalaire(idHistorique: number|string, montant: number): Promise<IReponseAPI>{
    const employee = environment.employeConnecte ;
    if(!employee){
      console.log('Aucun utilisateur connecté !');
      return new Promise((resolve, reject)=>{
        const ret: IReponseAPI={OK:0, TxErreur: 'Aucun utilisateur connecté'};
        reject(ret);
      });
    }
    return new Promise((resolve, reject)=>{
        const apiUrl = environment.endPoint +
                        'salaire_action.php?Action=AVANCE_SALAIRE_EDIT&IDEMPLOYE='+employee.ID +
                        '&IDAVANCE=' + idHistorique +
                        '&MONTANT=' + montant +
                        '&Token=' +
                        environment.tokenUser;
        this.http.get<IReponseAPI>(apiUrl).subscribe(
          {
            next: reponse =>  {
              console.log('Reponse: ',reponse);
                if(reponse.OK>0){
                  //Demande envoyée correctement
                  resolve(reponse);
                }else{
                  reject(reponse);
                }
            },
            error: err =>{
              reject(err);
            }
          }
        );
      }
    );

  }

  /*** Supprime une historique d'avance sur salaire
   * @param idHistorique
   * @returns
   */
  async deleteHistoriqueSalaire(idHistorique: number|string): Promise<IReponseAPI>{
    const employee = environment.employeConnecte ;
    if(!employee){
      console.log('Aucun utilisateur connecté !');
      return new Promise((resolve, reject)=>{
        const ret: IReponseAPI={OK:0, TxErreur: 'Aucun utilisateur connecté'};
        reject(ret);
      });
    }
    return new Promise((resolve, reject)=>{
        const apiUrl = environment.endPoint +
                        'salaire_action.php?Action=AVANCE_SALAIRE_DELETE&IDEMPLOYE='+employee.ID +
                        '&IDAVANCE=' + idHistorique +
                        '&Token=' +
                        environment.tokenUser;
        this.http.get<IReponseAPI>(apiUrl).subscribe(
          {
            next: reponse =>  {
              console.log('Reponse: ',reponse);
                if(reponse.OK>0){
                  //Demande envoyée correctement
                  resolve(reponse);
                }else{
                  reject(reponse);
                }
            },
            error: err =>{
              reject(err);
            }
          }
        );
      }
    );

  }

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

  /**
   * Envoie une demande d'avance sur Salaire
   *
   * @param montant Montant demandé
   * @param motif Le motif
   * @returns Promise<IReponseAPI>
   */
  async envoieDemandeAvance(montant: number, motif: string): Promise<IReponseAPI>{
    const employee = environment.employeConnecte ;
    if(!employee){
      console.log('Aucun utilisateur connecté !');
      return new Promise((resolve, reject)=>{
        const ret: IReponseAPI={OK:0, TxErreur: 'Aucun utilisateur connecté'};
        reject(ret);
      });
    }
    return new Promise((resolve, reject)=>{
        const apiUrl = environment.endPoint +
                        'salaire_action.php?Action=DEMANDE_AVANCE_SALAIRE&IDEMPLOYE='+employee.ID +
                        '&MOTIF=' +
                        motif +
                        '&MONTANT='+
                        montant +
                        '&Token=' +
                        environment.tokenUser;
                        console.log(`Envoie d'une demande d'avance: ${employee.nom}`, employee);
                        console.log('Montant:', montant);
        this.http.get<IReponseAPI>(apiUrl).subscribe(
          {
            next: reponse =>  {
              console.log('Reponse de la demande: ',reponse);
                if(reponse.OK>0){
                  //Demande envoyée correctement
                  resolve(reponse);
                }else{
                  reject(reponse);
                }
            },
            error: err =>{
              reject(err);
            }
          }
        );
      }
    );

  }

  async getHistoriqueDemande(IdEmploye: number|string|null = null): Promise<IReponseAPI>{
    const employee = environment.employeConnecte ;
    if(!employee){
      console.log('Aucun utilisateur connecté !');
      return new Promise((resolve, reject)=>{
        const ret: IReponseAPI={OK:0, TxErreur: 'Aucun utilisateur connecté'};
        reject(ret);
      });
    }
    let TxCrit='';
    if(IdEmploye){
      TxCrit +='&IDEMPLOYE='+IdEmploye ;
    }
    return new Promise((resolve, reject)=>{
        const apiUrl = environment.endPoint +
                        'salaire_action.php?Action=DEMANDE_HISTORIQUE_AVANCE_SALAIRE'+ TxCrit +
                        '&Token=' +
                        environment.tokenUser;
        this.http.get<IReponseAPI>(apiUrl).subscribe(
          {
            next: reponse =>  {
              console.log('Reponse de la demande: ',reponse);
                if(reponse.OK>0){
                  //Demande envoyée correctement
                  resolve(reponse);
                }else{
                  reject(reponse);
                }
            },
            error: err =>{
              reject(err);
            }
          }
        );
      }
    );

  }

  async editDemandeAvance(idDemande: number|string, montant: number, motif: string): Promise<IReponseAPI>{
    const employee = environment.employeConnecte ;
    if(!employee){
      console.log('Aucun utilisateur connecté !');
      return new Promise((resolve, reject)=>{
        const ret: IReponseAPI={OK:0, TxErreur: 'Aucun utilisateur connecté'};
        reject(ret);
      });
    }
    return new Promise((resolve, reject)=>{
        const apiUrl = environment.endPoint +
                        'salaire_action.php?Action=DEMANDE_AVANCE_SALAIRE_EDIT&IDEMPLOYE='+employee.ID +
                        '&ID=' + idDemande +
                        '&MOTIF=' +
                        motif +
                        '&MONTANT='+
                        montant +
                        '&Token=' +
                        environment.tokenUser;
        this.http.get<IReponseAPI>(apiUrl).subscribe(
          {
            next: reponse =>  {
              console.log('Reponse de la demande: ',reponse);
                if(reponse.OK>0){
                  //Demande envoyée correctement
                  resolve(reponse);
                }else{
                  reject(reponse);
                }
            },
            error: err =>{
              reject(err);
            }
          }
        );
      }
    );

  }

  /**
   * Permet de supprmer une demande
   *
   * @param idDemande
   * @returns Promise<IReponseAPI>
   */
  async deleteDemandeAvance(idDemande: number|string): Promise<IReponseAPI>{
    const employee = environment.employeConnecte ;
    if(!employee){
      console.log('Aucun utilisateur connecté !');
      return new Promise((resolve, reject)=>{
        const ret: IReponseAPI={OK:0, TxErreur: 'Aucun utilisateur connecté'};
        reject(ret);
      });
    }
    return new Promise((resolve, reject)=>{
        const apiUrl = environment.endPoint +
                        'salaire_action.php?Action=DEMANDE_AVANCE_SALAIRE_SUPPRIMER&IDEMPLOYE='+employee.ID +
                        '&ID=' + idDemande +
                        '&Token=' +
                        environment.tokenUser;
        this.http.get<IReponseAPI>(apiUrl).subscribe(
          {
            next: reponse =>  {
              console.log('Reponse de la demande: ',reponse);
                if(reponse.OK>0){
                  //Demande envoyée correctement
                  resolve(reponse);
                }else{
                  reject(reponse);
                }
            },
            error: err =>{
              reject(err);
            }
          }
        );
      }
    );

  }

  async rejectDemandeAvance(idDemande: number|string, motif: string): Promise<IReponseAPI>{
    const employee = environment.employeConnecte ;
    if(!employee){
      console.log('Aucun utilisateur connecté !');
      return new Promise((resolve, reject)=>{
        const ret: IReponseAPI={OK:0, TxErreur: 'Aucun utilisateur connecté'};
        reject(ret);
      });
    }
    return new Promise((resolve, reject)=>{
        const apiUrl = environment.endPoint +
                        'salaire_action.php?Action=DEMANDE_AVANCE_REPONSE&IDEMPLOYE='+employee.ID +
                        '&IDDEMANDE=' + idDemande +
                        '&VALIDER=0'+
                        '&MOTIF=' +
                        motif +
                        '&Token=' +
                        environment.tokenUser;
        this.http.get<IReponseAPI>(apiUrl).subscribe(
          {
            next: reponse =>  {
              console.log('Reponse de la demande: ',reponse);
                if(reponse.OK>0){
                  //Demande envoyée correctement
                  resolve(reponse);
                }else{
                  reject(reponse);
                }
            },
            error: err =>{
              reject(err);
            }
          }
        );
      }
    );

  }

  async validDemandeAvance(idDemande: number|string): Promise<IReponseAPI>{
    const employee = environment.employeConnecte ;
    if(!employee){
      console.log('Aucun utilisateur connecté !');
      return new Promise((resolve, reject)=>{
        const ret: IReponseAPI={OK:0, TxErreur: 'Aucun utilisateur connecté'};
        reject(ret);
      });
    }
    return new Promise((resolve, reject)=>{
        const apiUrl = environment.endPoint +
                        'salaire_action.php?Action=DEMANDE_AVANCE_REPONSE&IDEMPLOYE='+employee.ID +
                        '&IDDEMANDE=' + idDemande +
                        '&VALIDER=1'+
                        '&Token=' +
                        environment.tokenUser;
        this.http.get<IReponseAPI>(apiUrl).subscribe(
          {
            next: reponse =>  {
              console.log('Reponse de la demande: ',reponse);
                if(reponse.OK>0){
                  //Demande envoyée correctement
                  resolve(reponse);
                }else{
                  reject(reponse);
                }
            },
            error: err =>{
              reject(err);
            }
          }
        );
      }
    );

  }

  //Pour les retenues sur salaire

  async addRetenuSalaireForOne(idEmploye: number|string, montant: number, motif: string): Promise<IReponseAPI>{
    return new Promise((resolve, reject)=>{
        const apiUrl = environment.endPoint +
                        'salaire_action.php?Action=RETENUE_SALAIRE_AJOUTER&IDEMPLOYE='+idEmploye +
                        '&MOTIF=' +
                        motif +
                        '&MONTANT='+
                        montant +
                        '&Token=' +
                        environment.tokenUser;
        this.http.get<IReponseAPI>(apiUrl).subscribe(
          {
            next: reponse =>  {
              console.log('Reponse de la retenue sur salaire: ',reponse);
                if(reponse.OK>0){
                  //Demande envoyée correctement
                  resolve(reponse);
                }else{
                  reject(reponse);
                }
            },
            error: err =>{
              reject(err);
            }
          }
        );
      }
    );

  }

  async addRetenuSalaireMultiple(listeIdEmploye: [], montant: number, motif: string): Promise<IReponseAPI>{
    return new Promise((resolve, reject)=>{
        const apiUrl = environment.endPoint +
                        'salaire_action.php?Action=RETENUE_SALAIRE_AJOUTER&IDEMPLOYE='+JSON.stringify(listeIdEmploye) +
                        '&MOTIF=' +
                        motif +
                        '&MONTANT='+
                        montant +
                        '&Token=' +
                        environment.tokenUser;
        this.http.get<IReponseAPI>(apiUrl).subscribe(
          {
            next: reponse =>  {
              console.log('Reponse de la retenue sur salaire: ',reponse);
                if(reponse.OK>0){
                  //Demande envoyée correctement
                  resolve(reponse);
                }else{
                  reject(reponse);
                }
            },
            error: err =>{
              reject(err);
            }
          }
        );
      }
    );

  }

  async getHistoriqueRetenueSalaire(dateDeb: string, dateFin: string, IdEmploye: number|string|null = null): Promise<IReponseAPI>{
    const employee = environment.employeConnecte ;
    if(!employee){
      console.log('Aucun utilisateur connecté !');
      return new Promise((resolve, reject)=>{
        const ret: IReponseAPI={OK:0, TxErreur: 'Aucun utilisateur connecté'};
        reject(ret);
      });
    }
    let TxCrit='';
    if(IdEmploye){
      TxCrit +='&IDEMPLOYE='+IdEmploye ;
    }
    let TxPeriode='';
    if(dateDeb && dateFin){
      TxPeriode = '&DATEDEBUT='+dateDeb+'&DATEFIN='+dateFin;
    }else if(dateDeb){
      TxPeriode = '&DATEDEBUT='+dateDeb;
    }

    return new Promise((resolve, reject)=>{
        const apiUrl = environment.endPoint +
                        'salaire_action.php?Action=RETENUE_SALAIRE_LISTE'+ TxCrit +
                        '&Token=' +
                        environment.tokenUser;
        this.http.get<IReponseAPI>(apiUrl).subscribe(
          {
            next: reponse =>  {
              console.log('Reponse de la demande: ',reponse);
                if(reponse.OK>0){
                  //Demande envoyée correctement
                  resolve(reponse);
                }else{
                  reject(reponse);
                }
            },
            error: err =>{
              reject(err);
            }
          }
        );
      }
    );

  }

  async editRetnueSalaire(idRetenue: number|string, montant: number, motif: string): Promise<IReponseAPI>{
    const employee = environment.employeConnecte ;
    if(!employee){
      console.log('Aucun utilisateur connecté !');
      return new Promise((resolve, reject)=>{
        const ret: IReponseAPI={OK:0, TxErreur: 'Aucun utilisateur connecté'};
        reject(ret);
      });
    }
    return new Promise((resolve, reject)=>{
        const apiUrl = environment.endPoint +
                        'salaire_action.php?Action=RETENUE_SALAIRE_EDIT&IDRETENUE='+idRetenue +
                        '&MOTIF=' +
                        motif +
                        '&MONTANT='+
                        montant +
                        '&Token=' +
                        environment.tokenUser;
        this.http.get<IReponseAPI>(apiUrl).subscribe(
          {
            next: reponse =>  {
              console.log('Reponse: ',reponse);
                if(reponse.OK>0){
                  //Demande envoyée correctement
                  resolve(reponse);
                }else{
                  reject(reponse);
                }
            },
            error: err =>{
              reject(err);
            }
          }
        );
      }
    );

  }

  async deleteRetenueSalaire(idRetenue: number|string): Promise<IReponseAPI>{
    const employee = environment.employeConnecte ;
    if(!employee){
      console.log('Aucun utilisateur connecté !');
      return new Promise((resolve, reject)=>{
        const ret: IReponseAPI={OK:0, TxErreur: 'Aucun utilisateur connecté'};
        reject(ret);
      });
    }
    return new Promise((resolve, reject)=>{
        const apiUrl = environment.endPoint +
                        'salaire_action.php?Action=RETENUE_SALAIRE_DELETE&IDRETENUE='+idRetenue +
                        '&Token=' +
                        environment.tokenUser;
        this.http.get<IReponseAPI>(apiUrl).subscribe(
          {
            next: reponse =>  {
              console.log('Reponse: ',reponse);
                if(reponse.OK>0){
                  //Demande envoyée correctement
                  resolve(reponse);
                }else{
                  reject(reponse);
                }
            },
            error: err =>{
              reject(err);
            }
          }
        );
      }
    );

  }

  //*************************************************************************** */
}

export interface IKSSVTransactionSalaire {
  idBoutique?: number;
  id?: number;
  montant: number;
  modePayment?: string;
  libelle: string;
  date?: string;
}
