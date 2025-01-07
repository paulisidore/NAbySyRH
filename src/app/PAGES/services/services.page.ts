/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/dot-notation */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, MenuController, ModalController } from '@ionic/angular';
import { CrudAffectationPage } from 'src/app/CRUD/crud-affectation/crud-affectation.page';
import { CrudEmployePage } from 'src/app/CRUD/crud-employe/crud-employe.page';
import { EmployeService } from 'src/app/services/employe.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PopupModalService } from 'src/app/services/popup-modal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {
  detailService: any;
  listeEmploye: any;

  url: string ;
  nabyData={
    id:'',
    prenom: '',
    nom:'',
    fonction: '',
    sexe: '',
    adresse:'',
    telephone:'',
    idDirection:'',
  };

  searchTerm: string;
  bulkEdit= false;


  constructor(private router: Router,private route: ActivatedRoute,
    private menu: MenuController,private loadingService: LoadingService,
    private http: HttpClient, private alertctrl: AlertController,private popupModalService: PopupModalService,
    private modalctrl: ModalController, private service: EmployeService) {
      this.refreshServices();

     }

  ngOnInit() {
  }

  readAPI(url: string){
    console.log(url);
    return this.http.get(url);

  }

refreshServices(){
  this.loadingService.presentLoading();
  this.route.queryParams.subscribe(res =>{
    console.log(res);
    this.detailService=res;
    console.log(this.detailService);
    let txZone='';
    if (this.detailService.ID>0){
      txZone='&IdService='+this.detailService.ID ;
    }else if(this.detailService.IdDirection>0){
      txZone='&IdDirection='+this.detailService.IdDirection ;
    }
    this.url=environment.endPoint+'employe_action.php?Action=GET_EMPLOYE'+txZone+'&Token='+localStorage.getItem('nabysy_token');

    this.readAPI(this.url)
    .subscribe((data) =>{
      this.listeEmploye=data ;
      console.log(data);
      console.log(data['0']);
       this.nabyData.id=data['"Id"'];
      this.nabyData.prenom=data['"Prenom"'];
      this.nabyData.nom=data['"Nom"'];
      this.nabyData.fonction=data['"Fonction"'];
      this.nabyData.sexe=data['"Sexe"'];
      this.nabyData.adresse=data['"Adresse"'];
      this.nabyData.telephone=data['"Tel"'];
      this.nabyData.idDirection=data['"IdDirection"'];
    });
  });
}

  addaffectation(){
    this.modalctrl.create({
      component: CrudAffectationPage,
      cssClass: 'crud-affectation',
    }).
    then(modal =>{
      modal.present();
      return modal.onDidDismiss();
    }).then(({data, role})=> {
      console.log(data);
      console.log(role);
      if(role === 'create'){
        // eslint-disable-next-line no-var
        const newIdEmploye=data['Extra'];
        this.service.get(newIdEmploye).subscribe(async newdata =>{
            this.listeEmploye.push(newdata[0]);
            console.log(this.listeEmploye);
          });
          this.refreshServices();
      }
      this.refreshServices();
    });
    // this.refreshServices();
  }
  removeEmploye(employe: any){
    this.alertctrl.create({
      header:'Suppresion',
      message:'voulez vous supprimer '+employe.Prenom+' '+employe.Nom+' du '+this.detailService.Nom+' ?',
      buttons:[{
        text:'oui',
        handler:()=>new Promise (() =>{
            const headers = new Headers();
            headers.append('Accept', 'application/json');
            headers.append('Content-Type', 'application/json' );
            const apiUrl=environment.endPoint+'employe_action.php?Action=SAVE_EMPLOYE&IdEmploye='+
            employe.ID+'&IdDirection=0&IdService=0&Token='+localStorage.getItem('nabysy_token');
            console.log(apiUrl);
            this.http.get(apiUrl).subscribe(async data =>{
              console.log(data);
              if(data['OK'] >0){
                 //this.router.navigate(['personnel']);
                 const pos=this.listeEmploye.indexOf(employe);
                 console.log(pos);
                 if (pos>-1){
                  this.listeEmploye.splice(pos,1);
                 }
              }else{
                console.log(data['OK']);
              }
            });
          })
      },
       {text:'No'}
    ]
    }).then(alertE1 =>alertE1.present()) ;



  }
  userdetails(userDetail: any){
    this.popupModalService.presentModalEmploye(userDetail);
  }


  updateEmploye(employe){
    this.router.navigate(['/crud-employe'],{
      queryParams:employe
    });

  }
  _openSideNav(){
    this.menu.enable(true,'menu-content');
    this.menu.open('menu-content');
  }
  closeMenu(){
    this.menu.close('menu-content');
  }
  doRefresh(event){
    this.refreshServices();
    event.target.complete();
  }
}
