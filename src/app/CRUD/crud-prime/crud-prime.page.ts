/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-crud-prime',
  templateUrl: './crud-prime.page.html',
  styleUrls: ['./crud-prime.page.scss'],
})
export class CrudPrimePage implements OnInit {
  @Input() employe: any;
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  isUpdate= false;
  IDEmp: string; ID: '';
  point: string;
  motif: string;

   // Employe
   selected_user= null;
   selected: any;
   users: any;
   listeEmploye: any;
   toggle= true;
   id: number;
  commentaire: '';
  origineTable: '';
  montantPrime: number;

  constructor(private modalctrl: ModalController,
    private http: HttpClient,
    private toastctrl: ToastController) {
      this.loadEmploye();
    }

  ngOnInit() {
    if (this.employe){
      this.IDEmp=this.employe.IdEmploye;
      this.ID=this.employe.ID;
      this.point= this.employe.NbPointAjoute;
      this.motif= this.employe.Motif;
      this.commentaire=this.employe.commentaire;
      this.origineTable=this.employe.origineTable;
      this.isUpdate = true;
      this.montantPrime=0;
      // PrenomEmploye
      // NomEmploye
    }
  }

  onSubmit(){
    if (this.point===''){
      this.presentToast('Veillez préciser le nombre de point.');
    }else if(this.motif===''){
      this.presentToast('Veillez préciser le motif.');
    }/* else if (this.telephone===''){
      this.presentToast('Veillez mettre le numéro SVP!!!!');
    } */else{
      return new Promise (() =>{
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json' );
        let txIdEmp= '';
        let txId= '';
        let txMontantPrime='';
        if (this.employe){
          txIdEmp='&IdEmploye='+this.IDEmp ;
          txId='&ID='+this.ID ;
        }if(this.selected){
          txIdEmp='&IDEMPLOYE='+this.id;
        }
        if(this.montantPrime && this.montantPrime>0){
          txMontantPrime='&MONTANTPRIME='+this.montantPrime;
        }

        const apiUrl=environment.endPoint+'performance_action.php?Action=ADD_PERFORMANCE&NBPOINT='+this.point+'&MOTIF='+this.motif+
        '&commentaire='+this.commentaire+txIdEmp+txId+txMontantPrime+'&Token='+environment.tokenUser;
        // ---------------
        console.log(apiUrl);
        this.http.get(apiUrl).subscribe(async data =>{
          console.log(data);
          if(data['OK']!== '0'){
            // this.router.navigate(['/personnel']);
            this.modalctrl.dismiss(data,'create');
          }

        });
      });
    }
  }
  async presentToast(a){
    const toast = await this.toastctrl.create({
      message:a,
      duration: 1500,
      position: 'top'
    });
    toast.present();
  }
  closeModal(){
    this.modalctrl.dismiss(null, 'closed');

  }
  // ionic selectable
  loadEmploye(){
    this.readAPI(environment.endPoint+'employe_action.php?Action=GET_EMPLOYE&Token='+environment.tokenUser)
    .subscribe((listes) =>{
      // console.log(Listes);
      this.listeEmploye=listes ;
      this.users=listes;
      console.log(this.listeEmploye);
    });
  }
  readAPI(url: string){
    console.log(url);
    return this.http.get(url);

  }

  clear(){
    this.selectComponent.clear();
    this.selectComponent.close();
    this.id=0;
    console.log(this.id);
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
  }

}
