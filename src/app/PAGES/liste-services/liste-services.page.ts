/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/dot-notation */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonSlides, MenuController, ModalController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Observable } from 'rxjs';
import { CrudAffectationPage } from 'src/app/CRUD/crud-affectation/crud-affectation.page';
import { CrudServicePage } from 'src/app/CRUD/crud-service/crud-service.page';
import { CrudSousDirectionPage } from 'src/app/CRUD/crud-sous-direction/crud-sous-direction.page';
import { EmployeService } from 'src/app/services/employe.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PopupModalService } from 'src/app/services/popup-modal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-liste-services',
  templateUrl: './liste-services.page.html',
  styleUrls: ['./liste-services.page.scss'],
})
export class ListeServicesPage implements OnInit {
  segmentList: Array<string> = ['Sous-direction', 'Services', 'Employés'];
  selectedSegment: string;
  slideList: Array<string> = [
    'Slide Segment 1',
    'Slide Segment 2',
    'Slide Segment 3',
  ];
  activeEditsousDirection= false;
  activeEditService= false;
  activeEditEmploye= false;

  @ViewChild('slide') slide: IonSlides;
  direction: any;
  listeService: any;
  url: string ;

   // ionic selectable************
   searchTerm: string;
   selected_user= null;
   selected: any;
   users: any;
   toggle= true;
   id: number;
   @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
   listeEmploye: any;
   listeDirections: any;
  listeSousDirections: any;

  constructor(private router: Router,private route: ActivatedRoute, private modalctrl: ModalController,
    private menu: MenuController,private service: EmployeService,private alertctrl: AlertController,private loadingService: LoadingService,
    private http: HttpClient,private popupModalService: PopupModalService){
     this.refreshServices();
     this.loadEmploye();
     this.refreshDirection();
     this.refreshSousDirection();
     this.selectedSegment = this.segmentList[0];
    }

  ngOnInit() {
    if(this.id){
      this.id=this.direction.ID;
    }

  }
  loadEmploye(){
   /*  this.readAPI(environment.endPoint+'employe_action.php?Action=GET_EMPLOYE&Token='+environment.tokenUser)
    .subscribe((listes) =>{
      // console.log(Listes);
      this.listeEmploye=listes ;
      console.log(this.listeEmploye);
    }); */
    this.loadingService.presentLoading();
    this.route.queryParams.subscribe(res =>{
      console.log(res);
      this.direction=res;
      this.id=this.direction.ID;
      this.url=environment.endPoint+'employe_action.php?Action=GET_EMPLOYE&IdDirection='+this.id+'&Token='+
      localStorage.getItem('nabysy_token');

      this.readAPI(this.url)
      .subscribe((data) =>{
        this.listeEmploye=data ;
        console.log(data);
        this.loadingService.dismiss();
      });
    });
  }
  refreshDirection(){
    this.loadingService.presentLoading();
    this.readAPI(environment.endPoint+'direction_action.php?Action=GET_DIRECTION')
    .subscribe((Listes) =>{
      console.log(Listes);
      //  this.dt1=Listes['0'];

      this.listeDirections=Listes ;
      this.users=Listes;
      console.log(this.listeDirections);
    });
  }
  refreshSousDirection(){
    this.loadingService.presentLoading();
    this.route.queryParams.subscribe(res =>{
      console.log(res);
      this.direction=res;
      this.id=this.direction.ID;
      this.url=environment.endPoint+'direction_action.php?Action=GET_DIRECTION&IdDirectionParent='+this.id;

      this.readAPI(this.url)
      .subscribe((data) =>{
        this.listeSousDirections=data ;
        console.log(data);
        this.loadingService.dismiss();
        if (this.listeSousDirections.length >0){
          console.log('Il y a '+this.listeSousDirections.length+' sous-direction pour la direction '+this.direction.Nom);
        }else{
          console.log('Il y a aucune sous-direction pour la direction '+this.direction.Nom);
        }
      });
    });
  }
  refreshServices(){
    this.loadingService.presentLoading();
    this.route.queryParams.subscribe(res =>{
      console.log(res);
      this.direction=res;
      this.id=this.direction.ID;
      this.url=environment.endPoint+'service_action.php?Action=GET_SERVICE&IdDirection='+this.id;

      this.readAPI(this.url)
      .subscribe((data) =>{
        this.listeService=data ;
        console.log(data);
        this.loadingService.dismiss();
      });
    });
  }
  readAPI(url: string){
    return this.http.get(url);

  }
  goToFicheServices(ficheService){
    this.router.navigate(['/services'],{
      queryParams:ficheService
    });
  }
  goToListeServices(ficheService){
    this.router.navigate(['/liste-services'],{
      queryParams:ficheService
    });
  }
  userdetails(userDetail: any){
    this.popupModalService.presentModalEmploye(userDetail);
  }
  _openSideNav(){
    this.menu.enable(true,'menu-content');
    this.menu.open('menu-content');
  }
  getService(id: ''){
    this.url= environment.endPoint+'service_action.php?Action=GET_SERVICE&IdService='+id+'&Token='+localStorage.getItem('nabysy_token');
    return this.http.get(this.url);
  }

   addService(){
    this.modalctrl.create({
      component: CrudServicePage,
      componentProps: {serviceInfo: [], directionInfo: this.direction }
    }).
    then(modal =>{
      modal.present();
      return modal.onDidDismiss();
    }).then(({data, role})=> {
      console.log(data);
      console.log(role);
      if(role === 'create'){
        const newIdService=data.Extra;
        this.getService(newIdService).subscribe(async newdata =>{
          this.listeService.push(newdata[0]);
          this.refreshServices();
            console.log(this.listeService);

        });
      }
    });
  }
  addSousDirection(){
    this.modalctrl.create({
      component: CrudSousDirectionPage,
      componentProps: {serviceInfo: [], directionInfo: this.direction }
    }).
    then(modal =>{
      modal.present();
      return modal.onDidDismiss();
    }).then(({data, role})=> {
      console.log(data);
      console.log(role);
      if(role === 'create'){
        const newIdService=data.Extra;
        this.getService(newIdService).subscribe(async newdata =>{
          if (newdata){
            this.listeService.push(newdata[0]);
            console.log(this.listeService);
          }
          this.refreshDirection();
          this.refreshSousDirection();
          //this.refreshServices();
        });
      }
    });
  }

  removeService(serviceInfo: any){
    this.alertctrl.create({
      header:'Suppresion',
      message:'voulez vous supprimer ?',
      buttons:[{
        text:'oui',
        handler:()=>new Promise (() =>{
            const headers = new Headers();
            headers.append('Accept', 'application/json');
            headers.append('Content-Type', 'application/json' );
            const apiUrl=environment.endPoint+'service_action.php?Action=SUPPRIME_SERVICE&IdService='+serviceInfo.ID+
            '&Token='+localStorage.getItem('nabysy_token');
            console.log(apiUrl);
            this.http.get(apiUrl).subscribe(async data =>{
              console.log(data);
              if(data['OK'] >0){
                this.refreshServices();
                 //this.router.navigate(['personnel']);
                 const pos=this.listeService.indexOf(serviceInfo);
                 console.log(pos);
                 if (pos>-1){
                  this.listeService.splice(pos,1);

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

  updateService(service: any){
    console.log(service);
    this.modalctrl.create({
      component: CrudServicePage,
      componentProps:{ serviceInfo: service , directionInfo: this.direction }
    }).
    then(modal  =>{
      modal.present();
      return modal.onDidDismiss();
    }).then(({data, role})=> {
        console.log(data);
        console.log(role);
        if(role === 'create'){
          const idEdit=data.Extra;
          this.getService(idEdit).subscribe(async newdata =>{
              // this.listeService.push(newdata[0]);
              console.log(this.listeService);
              this.refreshServices();
          });
        }
      });
  }
  updateSousDirection(service: any){
    console.log(service);
    this.modalctrl.create({
      component: CrudSousDirectionPage,
      componentProps:{ sousdirectionInfo: service , directionInfo: this.direction }
    }).
    then(modal  =>{
      modal.present();
      return modal.onDidDismiss();
    }).then(({data, role})=> {
        console.log(data);
        console.log(role);
        if(role === 'create'){
          const idEdit=data.Extra;
          this.getService(idEdit).subscribe(async newdata =>{
              // this.listeService.push(newdata[0]);
              console.log(this.listeService);
              this.refreshServices();
          });
        }
      });
  }
  doRefresh(event){
    this.refreshAllinfos();
    event.target.complete();
  }

  refreshAllinfos(){
    this.refreshDirection();
    this.refreshSousDirection();
    this.refreshServices();
  }


  //ionic selectable
  openFromCode(){
    this.selectComponent.open();
  }
  clear(){
    this.selectComponent.clear();
    this.selectComponent.close();

  }
  toggleItems(){
    this.selectComponent.toggleItems(this.toggle);
    this.toggle= !this.toggle;

  }
  confirm(){
    this.selectComponent.confirm();
    this.selectComponent.close();
    console.log(this.selected);
    if(this.selected){
      this.id=this.selected.ID;

    }
    console.log(this.selected);
    this.goToListeServices(this.selected);

  }
  _segmentSelected(item: string, index: number) {
    this.slide.slideTo(index);
  }

  _ionSlideDidChange(event: any) {
    this.slide.getActiveIndex().then((index) => {
      this.selectedSegment = this.segmentList[index];
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
           this.loadEmploye();
          this.refreshDirection();
          this.refreshSousDirection();
      }
          this.refreshServices();
          this.loadEmploye();
          this.refreshDirection();
          this.refreshSousDirection();
    });
    // this.refreshServices();
  }
  updateEmploye(userDetail){
    this.router.navigate(['/crud-employe'],{
      queryParams:userDetail
    });
  }
  removeEmploye(employe: any){
    this.alertctrl.create({
      header:'Suppresion',
      message:'voulez vous supprimer '+employe.Prenom+' '+employe.Nom+' du '+this.direction.Nom+' ?',
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
                this.loadEmploye();
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
  toggleActiveEdit(){
    this.activeEditsousDirection = !this.activeEditsousDirection;
  }
  toggleActiveEdit2(){
    this.activeEditService = !this.activeEditService;
  }
  toggleActiveEdit3(){
    this.activeEditEmploye = !this.activeEditEmploye;
  }
}
