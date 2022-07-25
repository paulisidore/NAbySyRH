import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoadingService } from './loading.service';

export interface Employe {
  id: string;
  nom: string;
  prenom: string;
  fonction: string;
  adresse: string;
  telephone: string;
  sexe: string;
  idDirection: string;
  idService: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeService {
  private url= environment.endPoint+'employe_action.php?Action=GET_EMPLOYE&Token='+environment.tokenUser;
  private urlDelete;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService) { }
  getAll(){
    return this.http.get(this.url);
  }
  get(id: string){
    this.loadingService.presentLoading();
    this.url= environment.endPoint+'employe_action.php?Action=GET_EMPLOYE&IdEmploye='+id+'&Token='+environment.tokenUser;
    return this.http.get(this.url);
  }

  create(employe: any){
    return this.http.post(this.url, employe);
  }

  update(employe: any, id: string){
    return this.http.get(this.url + '/' +id, employe);
  }

  remove(id: string){

   this.urlDelete= environment.endPoint+'employe_action.php?Action=SUPPRIME_EMPLOYE&IdEmploye='+id+'&Token='+environment.tokenUser;
    return this.http.get(this.urlDelete);
  }

  getService(id: ''){
    this.url= environment.endPoint+'service_action.php?Action=GET_SERVICE&IdService='+id+'&Token='+environment.tokenUser;
    return this.http.get(this.url);
  }
}
