/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/dot-notation */
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, ModalController, ToastController } from '@ionic/angular';
import { CrudEmployePage } from 'src/app/CRUD/crud-employe/crud-employe.page';
import { LoadingService } from 'src/app/services/loading.service';
import { PopupModalService } from 'src/app/services/popup-modal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-affectation',
  templateUrl: './affectation.page.html',
  styleUrls: ['./affectation.page.scss'],
})
export class AffectationPage implements OnInit {
  @Input() infoService: any;
  affectation: any;
  listeEmploye: any;
  historique: any;
  url: string ;
  searchTerm: string;

  page = 0;
  resultsCount = 10;
  totalPages = 10;
  idDirection: 0;
  idService: 0;
  direction: '';
  service: '';

  // data= [];
  data: any;
  bulkEdit= false;
  edit: any[];


  listeAffectation: any;
  sortDirection= 0;
  sortKey= null;
  Employeaffecte: any;

  constructor(private http: HttpClient, private modalctrl: ModalController, private popupModalService: PopupModalService,
    private router: Router, private route: ActivatedRoute,private menu: MenuController,private toastctrl: ToastController,
    private loadingService: LoadingService) {
      // this.loadData(); //EMPLOYE
      this.loadAffectation(); //AFFECTATIONS
     }

  ngOnInit() {
  }

  loadAffectation(){
    // this.loadingService.presentLoading();
    this.route.queryParams.subscribe(res =>{
      this.infoService=res ;
      //console.log(this.infoService);
      if (this.infoService){
        this.idDirection= this.infoService.IdDirection;
        this.idService= this.infoService.ID;
        //console.log(this.infoService);
      }
    });
    this.loadingService.presentLoading();
      this.http.get(environment.endPoint+'affectation_action.php?Action=GET_AFFECTATION&&Token='+
        localStorage.getItem('nabysy_token')).subscribe(res => {
      this.listeAffectation = res;
      console.log('listeAffectation =',this.listeAffectation);
      // this.data=res ;
      this.sort();
    });
  }



  sortBy(key){
    this.sortKey= key;
    this.sortDirection++;
  }
  sort(){
    if (this.sortDirection === 1){
      this.data = this.data.sort((a, b) =>{
        console.log('a: ', a);
        const valA = a[this.sortKey];
        const valB = b[this.sortKey];
        return valA.localeCompare(valB);
      });
    }else if (this.sortDirection === 2){
      this.data = this.data.sort((a, b) =>{
        const valA = a[this.sortKey];
        const valB = b[this.sortKey];
        return valB.localeCompare(valA);
      });
    }else{
      this.sortDirection= 0;
      this.sortKey= null;
    }

  }
  toggleBulkEdit(){
    this.bulkEdit = !this.bulkEdit;
    this.edit= [];
    console.log('listeEmploye =',this.listeEmploye);
  }

affectationMethode(){
    console.log('Objet en cour =',this);
      console.log('listeEmploye =',this.listeEmploye);
      const lst=this.listeEmploye;
      const headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json' );
      // ----------------------
        for (const [key, value] of Object.entries(this.edit)) {
          const employe=this.listeEmploye[key];
          this.affecterUnePersonne(employe.ID);

        }
        this.modalctrl.dismiss(this.data,'create');
      return false;
  this.bulkEdit= false;

  }

  affecterUnePersonne(idPersonne,afficherTost=true){
    let apiUrl=environment.endPoint+'employe_action.php?Action=AFFECTER_EMPLOYE&IdEmploye='+
    idPersonne+'&IdDirection='+this.idDirection+'&Token='+localStorage.getItem('nabysy_token');
    if (this.idService > 0){
      apiUrl=environment.endPoint+'employe_action.php?Action=AFFECTER_EMPLOYE&IdEmploye='+
      idPersonne+'&IdService='+this.idService+'&Token='+localStorage.getItem('nabysy_token');
    }

    // this.url=environment.endPoint+'service_action.php?Action=GET_SERVICE&IdDirection='+this.direction.ID;
      console.log(apiUrl);
      this.readAPI(apiUrl)
      .subscribe((reponseApi) =>{
        console.log(reponseApi);
        if(reponseApi['OK']!== '0'){
          console.log('Affectation IdEmploye '+idPersonne+' ...OK');
          // this.modalctrl.dismiss(data,'create');

          if (afficherTost){
      this.presentToast('Affectation IdEmploye '+idPersonne+' ...OK');
      // Extra
          }
          return true;
        }else{
          console.log('Affectation IdEmploye '+idPersonne+' ...Erreur');
          return false ;
        }
      });
}  async presentToast(a){
    const toast = await this.toastctrl.create({
      message:a,
      duration: 1500,
      position: 'middle'
    });
    toast.present();
  }

  readAPI(url: string){
    console.log(url);
    return this.http.get(url);
  }
  removeRow(index){
    this.data.splice(index, 1);
  }
  editRow(employe: any){
    console.log(employe);
    this.modalctrl.create({
      component: CrudEmployePage,
      componentProps:{ employe }
    })
    .then(modal => modal.present());
  }
  nextPage(){
    this.page++;
    this.loadAffectation();
  }

  prevPage(){
    this.page--;
    this.loadAffectation();
  }
  goFirst(){
    this.page= 0;
    this.loadAffectation();
  }
  goLast(){
    this.page = this.totalPages - 1;
    this.loadAffectation();
  }
  closeModal(){
    this.modalctrl.dismiss(null, 'closed');

  }
  _openSideNav(){
    this.menu.enable(true,'menu-content');
    this.menu.open('menu-content');
  }
  userdetails(userDetail: any){
    this.popupModalService.presentAffectationModal(userDetail);
  }
  doRefresh(event){
    this.loadAffectation();
    event.target.complete();
  }
}
