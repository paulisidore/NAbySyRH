/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-var */
/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController, ModalController } from '@ionic/angular';
import { CrudDirectionPage } from 'src/app/CRUD/crud-direction/crud-direction.page';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-direction',
  templateUrl: './direction.page.html',
  styleUrls: ['./direction.page.scss'],
})
export class DirectionPage implements OnInit {
  // dt1: any;
  listeDirections: any;
  url: string ;

  searchTerm: string;

 activeEdit= false;

  constructor(private router: Router,  private modalctrl: ModalController,private alertctrl: AlertController,
    private menu: MenuController, private http: HttpClient,private loadingService: LoadingService,) {
      this.refreshDirection();

     }

  ngOnInit() {
  }
  // &IDDirectionParent=0
  refreshDirection(){
    this.loadingService.presentLoading();
    this.readAPI(environment.endPoint+'direction_action.php?Action=GET_DIRECTION&IdDirectionParent=0&Token='+
      localStorage.getItem('nabysy_token'))
    .subscribe((Listes) =>{
      console.log(Listes);
      //  this.dt1=Listes['0'];

      this.listeDirections=Listes ;
      console.log(this.listeDirections);
      this.loadingService.dismiss();
    });
  }
  readAPI(url: string){
    return this.http.get(url);

  }

  features: any[]=[
    // {id: 1, name: 'SIEGE', src: 'assets/city-hall.png', background: 'rgba(27, 150, 181, 0.1)', page:this.router.navigate(['../'])},
    {id: 1, name: 'SIEGE', src: 'assets/city-hall.png', background: 'rgba(27, 150, 181, 0.1)', page:''},

  ];
  transaction: any[]= [
    {id: 1, vendor: 'Rapport du 21 septembre......', image: '', amount: 'Service comptable',time: 'le 22/09/2021 3:00PM'},
  ];

  getDirection(id: ''){
    this.url= environment.endPoint+'direction_action.php?Action=GET_DIRECTION&IdDirection='+id+'&Token='+
    localStorage.getItem('nabysy_token');
    return this.http.get(this.url);
  }

  goToServices(directionParent){
    this.router.navigate(['/liste-services'],{
      queryParams:directionParent
    });
  }
  toggleActiveEdit(){
    this.activeEdit = !this.activeEdit;
  }
  _openSideNav(){
    this.menu.enable(true,'menu-content');
    this.menu.open('menu-content');
  }

  AddDirection(){
    this.modalctrl.create({
      component: CrudDirectionPage
    }).
    then(modal =>{
      modal.present();
      return modal.onDidDismiss();
    }).then(({data, role})=> {
      console.log(data);
      console.log(role);
      if(role === 'create'){
        var NewIdDirection=data["Extra"];
        this.getDirection(NewIdDirection).subscribe(async Newdata =>{
            this.listeDirections.push(Newdata[0]);
            //console.log(this.listeEmploye);
            this.refreshDirection();
        });
      }
    });
  }
  removeDirection(direction: any){
    this.alertctrl.create({
      header:"Suppresion",
      message:"voulez vous supprimer ?",
      buttons:[{
        text:'oui',
        handler:()=>{
          return new Promise (() =>{
            var headers = new Headers();
            headers.append("Accept", 'application/json');
            headers.append('Content-Type', 'application/json' );
            var apiUrl=environment.endPoint+'direction_action.php?Action=SUPPRIME_DIRECTION&IdDirection='+direction.ID+
            '&Token='+localStorage.getItem('nabysy_token');
            console.log(apiUrl);
            this.http.get(apiUrl).subscribe(async data =>{
              console.log(data);
              if(data['OK'] >0){
                 //this.router.navigate(['personnel']);
                 var Pos=this.listeDirections.indexOf(direction);
                 console.log(Pos);
                 if (Pos>-1){
                  this.listeDirections.splice(Pos,1);
                  this.refreshDirection();
                 }
              }else{
                console.log(data['OK']);
              }
            });
          });
        }
      },
       {text:'No'}
    ]
    }).then(alertE1 =>alertE1.present()) ;
  }


  updateDirection(direction){
    console.log(direction);
    this.modalctrl.create({
      component: CrudDirectionPage,
      componentProps:{ direction }
    })
    .then(modal => modal.present());
    this.refreshDirection();

  }
  doRefresh(event){
    this.refreshDirection();
    event.target.complete();
  }
}
