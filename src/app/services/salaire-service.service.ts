import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalaireServiceService {

  constructor(private http: HttpClient) { }

  readAPI(url: string){
    console.log(url);
    return this.http.get(url);
  }

  postAPI(url: string, data: any){
    return this.http.post(url, data);
  }

  getListeSalaireAPayer(idMois: number = 0, listeIdEmploye: []=null){
    const action='GET_SALAIRE_LIST';
    let url=environment.endPoint+'salaire_action.php?Action='+action;
    if (idMois === 0){
      idMois = new Date().getMonth()+1;
    }
    if(idMois !== 0){
      url +='&IdMois='+idMois;
    }
    if(listeIdEmploye!=null){
      url +='&ListeIdEmploye='+listeIdEmploye;
    }
    url +='&Token='+environment.tokenUser;
  }

}
