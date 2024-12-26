/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-const */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonDatetime, MenuController, ModalController } from '@ionic/angular';
import { EmployeService } from 'src/app/services/employe.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PopupModalService } from 'src/app/services/popup-modal.service';
import { environment } from 'src/environments/environment';
import { format, parseISO } from 'date-fns';
import { IonicSelectableComponent } from 'ionic-selectable';
import { CrudPrimePage } from 'src/app/CRUD/crud-prime/crud-prime.page';

@Component({
  selector: 'app-paiement-salaire',
  templateUrl: './paiement-salaire.page.html',
  styleUrls: ['./paiement-salaire.page.scss'],
})
export class PaiementSalairePage implements OnInit {
  @ViewChild(IonDatetime) datetime: IonDatetime;
   @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
   listePrime: any;
   bulkEdit= false;
   sortDirection= 0;
   sortKey= null;

   // Employe
   selected_user= null;
   selected: any;
   users: any;
   listeEmploye: any;
   toggle= true;
   id: number;



   // Pick Date
    today: any;
  /* age =0; */
   selectedDate= '';
   selectedDate2= format(new Date(),'yyyy-MM-dd');
   modes = ['date', 'month', 'month-year','year'];
   selectedMode= 'date';
   showPicker = false;
   dateValue= format(new Date(),'yyyy-MM-dd');
   dateValue2= format(new Date(),'yyyy-MM-dd');
   formattedString= '';
   formattedString2= '';


   constructor(private http: HttpClient,private router: Router,private popupModalService: PopupModalService,
     private menu: MenuController, private modalctrl: ModalController,  private service: EmployeService,
     private alertctrl: AlertController,
     private loadingService: LoadingService) {
       // this.confirm();
       this.setToday();
       this.today = new Date().getDate();
       this.loadEmploye();
       this.loadPrime();

   }

   ngOnInit() {

   }

   setToday(){
     // this.formattedString= format(parseISO(format(new Date(), 'yyyy-MM-dd')+ 'T09:00:00.000Z'), 'HH:mm, MMM d, yyyy');
     // this.formattedString= format(parseISO(format(new Date(), 'yyyy-MM-dd')+ 'T09:00:00.000Z'), ' yyyy-MM-d ');
     this.formattedString2= format(parseISO(format(new Date(), 'yyyy-MM-dd')+ 'T09:00:00.000Z'), ' yyyy-MM-dd ');
     }
     dateChanged(value){
       this.dateValue= value;
      this.formattedString= value;
      this.showPicker= false;
      this.selectedDate=value;
      }
      dateChangedFin(value){
       this.dateValue2= value;
      this.formattedString2=value ;
      this.showPicker= false;
      this.selectedDate2=value;
      }
      close(){
        this.datetime.cancel(true);
       this.loadPrime();
      }
      select(){
        this.datetime.confirm(true);
       this.loadPrime();
      }
      effacedateDebut(){
       this.datetime.cancel(true);
       this.selectedDate= '';
       this.formattedString= '';
       this.loadPrime();
     }
     effacedateFin(){
       this.datetime.cancel(true);
       this.selectedDate2= '';
       this.formattedString2= '';
       this.loadPrime();
     }
   loadPrime(){
     let IdEmploye='';
     if(this.id){
       IdEmploye ='&IDEMPLOYE='+this.id ;
       console.log(IdEmploye);
     }
     this.loadingService.presentLoading();
     this.readAPI(environment.endPoint+'performance_action.php?Action=GET_PERFORMANCE&ORDRE=TOTAL_PERFORMANCE&DATEDEPART='+
     this.selectedDate+'&DATEFIN='+this.selectedDate2+IdEmploye+'&Token='+environment.tokenUser)
     .subscribe((listes) =>{
       this.loadingService.dismiss();
       // console.log(Listes);
       this.listePrime=listes ;
       console.log(this.listePrime);
     });
     this.sort();

   }
   readAPI(url: string){
     return this.http.get(url);

   }
   loadEmploye(){
     this.readAPI(environment.endPoint+'employe_action.php?Action=GET_EMPLOYE&Token='+environment.tokenUser)
     .subscribe((listes) =>{
       // console.log(Listes);
       this.listeEmploye=listes ;
       this.users=listes;
       /* this.users.ID=listes['"ID"'];
           this.users.Nom=listes['"Nom"'];
           this.users.Adresse=listes['"Adresse"'];
           this.users.Telephone=listes['"Tel"']; */
       console.log(this.listeEmploye);
     });
   }
   addPrime(){
     this.modalctrl.create({
       component: CrudPrimePage
     }).
     then(modal =>{
       modal.present();
       return modal.onDidDismiss();
     }).then(({data, role})=> {
       console.log(data);
       console.log(role);
       if(role === 'create'){
         const newPrime=data.Extra;
         this.service.getPrime(newPrime).subscribe(async newdata =>{
             this.listePrime.push(newdata[0]);
             //console.log(this.listeEmploye);
             this.loadPrime();
         });
       }
     });
     this.loadPrime();
   }
   removePrime(employe: any){
     this.alertctrl.create({
       header:'Suppresion',
       message:'voulez vous supprimer ?',
       buttons:[{
         text:'oui',
         handler:()=>new Promise (() =>{
             const headers = new Headers();
             headers.append('Accept', 'application/json');
             headers.append('Content-Type', 'application/json' );
             const apiUrl=environment.endPoint+'performance_action.php?Action=SUPPRIME_PERFORMANCE&IDPERFORMANCE='+
             employe.ID+'&Token='+environment.tokenUser;
             console.log(apiUrl);
             this.http.get(apiUrl).subscribe(async data =>{
               console.log(data);
               if(data['OK']>0){
                  //this.router.navigate(['personnel']);
                  const pos=this.listePrime.indexOf(employe);
                  console.log(pos);
                  if (pos>-1){
                   this.listePrime.splice(pos,1);
                   // this.refreshPerson();
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

   updatePrime(employe: any){
     console.log(employe);
     this.modalctrl.create({
       component: CrudPrimePage,
       componentProps:{ employe }
     })
     .then(modal => modal.present());
     this.loadPrime();

   }
   _openSideNav(){
     this.menu.enable(true,'menu-content');
     this.menu.open('menu-content');
   }
   primedetails(userDetail: any){
     this.popupModalService.presentModalPrime(userDetail);
   }
   doRefresh(event){
      this.loadPrime();
      this.loadEmploye();
     event.target.complete();
   }
   removeVarious(){
     this.bulkEdit=true;
   }
   save(){
     this.bulkEdit=false;
   }

   sortBy(key){
     this.sortKey= key;
     this.sortDirection++;
   }
   sort(){
     if (this.sortDirection === 1){
       this.listePrime = this.listePrime.sort((a, b) =>{
         console.log('a: ', a);
         const valA = a[this.sortKey];
         const valB = b[this.sortKey];
         return valA.localeCompare(valB);
       });
     }else if (this.sortDirection === 2){
       this.listePrime = this.listePrime.sort((a, b) =>{
         const valA = a[this.sortKey];
         const valB = b[this.sortKey];
         return valB.localeCompare(valA);
       });
     }else{
       this.sortDirection= 0;
       this.sortKey= null;
     }

   }
   openFromCode(){
     this.selectComponent.open();
   }
   clear(){
     this.selectComponent.clear();
     this.selectComponent.close();
     this.id=0;
     console.log(this.id);
     this.loadPrime();
   }
   toggleItems(){
     this.selectComponent.toggleItems(this.toggle);
     this.toggle= !this.toggle;

   }
   confirm(){
     this.selectComponent.confirm();
     this.selectComponent.close();
     this.id=0;
     console.log(this.selected);
     if(this.selected){
       this.id=this.selected.ID;

     }
     this.loadPrime();

   }
}
