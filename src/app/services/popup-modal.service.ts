/* eslint-disable @typescript-eslint/dot-notation */
import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EmployePage } from '../CRUD/employe/employe.page';
import { DetailAbsencePage } from '../DETAIL/detail-absence/detail-absence.page';
import { DetailAffectationPage } from '../DETAIL/detail-affectation/detail-affectation.page';
import { DetailEmployePage } from '../DETAIL/detail-employe/detail-employe.page';

/* Prise en charge des Photos */
import { PhotoService } from 'src/app/services/photo.service';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { PhotoviewerPage } from '../DETAIL/photoviewer/photoviewer.page';
import { PrintBulletinPage } from '../PAGES/avance/print-bulletin.page';
/* --------------------------------------------------------------------- */

@Injectable({
  providedIn: 'root'
})
export class PopupModalService {

  constructor( private modalCtrl: ModalController , private photoService: PhotoService) { }

  async presentAffectationModal(userDetail: any){
    const modal = await this.modalCtrl.create({
      component: DetailAffectationPage,
      cssClass: 'detail-affectation',
      componentProps:{
        data: userDetail,
      }

    });
    return await modal.present();
  }

  async presentModalPhoto(userDetail: any){
    const modal = await this.modalCtrl.create({
      component: PhotoviewerPage,
      cssClass: 'my-custom-modal-css',
      componentProps:{
        data: userDetail,
      }

    });
    return await modal.present();
  }

  async presentModalEmploye(userDetail: any){
    const modal = await this.modalCtrl.create({
      component: DetailEmployePage,
      componentProps:{
        data: userDetail,
      }

    });
    /* modal.onDidDismiss()
      .then((data) => {
        const user = data['data']; // Here's your selected user!
        const user2 = data; // Here's your selected user!
        console.log(user);
        console.log(user2);

    }); */
    return await modal.present();
  }


  dismiss(){
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }
  async presentModalAbsence(absenceDetail: any){
    const modal = await this.modalCtrl.create({
      component: DetailAbsencePage,
      componentProps:{
        data: absenceDetail,
      }

    });
    return await modal.present();
  }
  async avanceSalaire(avance: any){
    const modal = await this.modalCtrl.create({
      component: PrintBulletinPage,
      componentProps:{
        data: avance,
      }

    });
    return await modal.present();
  }

}
