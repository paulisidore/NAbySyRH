/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NabysyGlobalServiceService {
  private static myAppInf: any;
  public isReady: number;
  private appInfo: any;
  private http: HttpClient;


  constructor(httpClient: HttpClient) {
    this.http=httpClient;
    NabysyGlobalServiceService.myAppInf=null;
    //this.isReady=0;
    //this.loadAppInfosFromAPI();
    if(this.isReady===0){
      console.log('NabysyGlobalServiceService: Constructor');
      //this.loadAppInfosFromAPI();
    }
   }

  get myAppInfo(){
    NabysyGlobalServiceService.myAppInf=environment.appInfo;
    if(environment.appInfo == null){
      this.loadAppInfosFromAPI();
    }
    return NabysyGlobalServiceService.myAppInf;
  }

  async loadAppInfosFromAPI(){
    //console.log(environment.appInfo);
    if (this.isReady>0){
      console.log('Info deja chargé.');
      NabysyGlobalServiceService.myAppInf=environment.appInfo ;
      //console.log(NabysyGlobalServiceService.myAppInf);
      return;
    }
    console.log('loadAppInfosFromAPI');
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json' );
    // eslint-disable-next-line max-len
    const apiUrl=environment.endPoint+'siege_action.php?Action=GET_SIEGE';
    //console.log(apiUrl);
    await this.http.get(apiUrl).subscribe( data => {
      console.log(data);
      this.isReady=1;
      if (data) {
        environment.appInfo =data ;
        NabysyGlobalServiceService.myAppInf=data;
      }else{
        environment.appInfo=null;
        NabysyGlobalServiceService.myAppInf=null;
        this.isReady=1;
      }
      if (environment.appInfo){
        console.log(NabysyGlobalServiceService.myAppInf);
        this.appInfo=environment.appInfo;
        this.isReady=1;
        //this.getUserProfile();
      }
    });

  }

  /**
   * Charge les informations du profile de l'utilisateur connecté
   *
   * @param returnPromise bool : Si Vrai reourne une promesse
   * @returns any
   */
  async getUserProfile(returnPromise=false){
    if (environment.userName===''){
      console.log('En attente de connexion utilisateur...');
      const retour: any = [
        { err: 0, msg: 'Utilisateur non définit.' }
      ];
      return retour;
    }

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json' );
    // eslint-disable-next-line max-len
    const apiUrl=environment.endPoint+'nabysy_action.php?Action=OPEN_SESSION&User='+environment.userName+'&Password='+environment.passWord;
    //console.log(apiUrl);
    if (!returnPromise){
      await this.http.get(apiUrl).subscribe( data => {
        if (data) {
          environment.userProfile =data ;
        }else{
          environment.userProfile=null;
        }
        if (environment.userProfile){
          //console.log(environment.userProfile);
        }
      });
    }else{
      console.log('Retourne une Promesse...');
      return await this.http.get(apiUrl);
    }
  }

}

export interface IReponseAPI {
  Action?: string;
  OK?: number|0|1;
  TxErreur?: string ;
  Extra?: any ;
  Contenue?: any ;
  Autre?: any ;
}
