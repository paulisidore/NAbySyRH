/* eslint-disable no-trailing-spaces */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { PopupModalService } from 'src/app/services/popup-modal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detail-absence',
  templateUrl: './detail-absence.page.html',
  styleUrls: ['./detail-absence.page.scss'],
})
export class DetailAbsencePage implements OnInit {
  absence: any;
  userDetails: any;
  idEmploye: number;
  url: string;
  employe: any;
  nom: ''; prenom: ''; fonction: ''; adresse: ''; telephone: ''; idDirection: number; idService: number; photo: '';
  direction: any; service: any; nomdirection: ''; nomservice: '';
  nbPerformance: number;
  sexe: '';


  constructor(private popupModalService: PopupModalService,private navParams: NavParams,private http: HttpClient,) {
    this.loadEmploye();
  }

  ngOnInit() {
    this.absence= this.navParams.get('data');
    console.log(this.absence);
  }


  closeModal(){
    this.popupModalService.dismiss();
  }

  loadEmploye(){
    this.userDetails= this.navParams.get('data');
    this.idEmploye=this.userDetails.IdEmploye;
      console.log('idEmploye: '+this.idEmploye);
      this.url=environment.endPoint+'employe_action.php?Action=GET_EMPLOYE&IdEmploye='+this.idEmploye+
      '&Token='+environment.tokenUser;
      this.readAPI(this.url)
      .subscribe((data) =>{
        this.employe=data ;
        // this.products=data;
        console.log(data);
        console.log(data['0']);
        this.nom=this.employe['0'].Nom;
        this.prenom=this.employe['0'].Prenom;
        this.fonction=this.employe['0'].Fonction;
        this.adresse=this.employe['0'].Adresse;
        this.telephone=this.employe['0'].Tel;
        this.idDirection=this.employe['0'].IdDirection;
        this.idService=this.employe['0'].IdService;
        this.photo=this.employe['0'].PHOTO_URL;
        this.nbPerformance=this.employe['0'].NbPerformance;
        this.sexe=this.employe['0'].Sexe;
      });
  }
  readAPI(url: string){
    return this.http.get(url);

  }
}
