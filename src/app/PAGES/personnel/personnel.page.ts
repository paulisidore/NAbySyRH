/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/dot-notation */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  IonSlides,
  MenuController,
  ModalController,
} from '@ionic/angular';
import { CrudEmployePage } from 'src/app/CRUD/crud-employe/crud-employe.page';
import { DetailEmployePage } from 'src/app/DETAIL/detail-employe/detail-employe.page';
import { EmployeService } from 'src/app/services/employe.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PopupModalService } from 'src/app/services/popup-modal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-personnel',
  templateUrl: './personnel.page.html',
  styleUrls: ['./personnel.page.scss'],
})
export class PersonnelPage implements OnInit {
  listeEmploye: any;

  searchTerm: string;
  bulkEdit = false;

  sortDirection = 0;
  sortKey = null;

  // Segments
  segmentList: Array<string> = ['Détails', 'Icônes'];
  selectedSegment: string;
  slideList: Array<string> = ['Slide Segment 1', 'Slide Segment 2'];

  @ViewChild('slide') slide: IonSlides;

  constructor(
    private router: Router,
    private popupModalService: PopupModalService,
    private menu: MenuController,
    private http: HttpClient,
    private alertctrl: AlertController,
    // eslint-disable-next-line max-len
    private modalctrl: ModalController,
    private loadingService: LoadingService,
    private modalCtrl: ModalController
  ) {
    this.selectedSegment = this.segmentList[0];
    this.refreshPerson();
    this.sort();
  }

  ngOnInit() {
    // this.refreshPerson();
    this.sort();
  }

  //Segment
  _segmentSelected(item: string, index: number) {
    this.slide.slideTo(index);
  }

  _ionSlideDidChange(event: any) {
    this.slide.getActiveIndex().then((index) => {
      this.selectedSegment = this.segmentList[index];
    });
  }

  //load API
  refreshPerson() {
    this.loadingService.presentLoading();
    this.readAPI(
      environment.endPoint +
        'employe_action.php?Action=GET_EMPLOYE&Token=' +
        localStorage.getItem('nabysy_token')
    ).subscribe((listes) => {
      this.loadingService.dismiss();
      // console.log(Listes);
      this.listeEmploye = listes;
      console.log(this.listeEmploye);
      this.loadingService.dismiss();
    });
    this.sort();
  }

  readAPI(url: string) {
    return this.http.get(url);
  }
  goToServices(directionParent) {
    this.router.navigate(['/liste-services'], {
      queryParams: directionParent,
    });
  }
  adddirection() {
    this.router.navigate(['crud-direction']);
  }
  removeEmploye(employe: any) {
    this.alertctrl
      .create({
        header: 'Suppresion',
        message:
          'voulez vous supprimer ' +
          employe.Prenom +
          ' ' +
          employe.Nom +
          ' de la liste du personnel de votre structure ?',
        buttons: [
          {
            text: 'oui',
            handler: () =>
              new Promise(() => {
                const headers = new Headers();
                headers.append('Accept', 'application/json');
                headers.append('Content-Type', 'application/json');
                const apiUrl =
                  environment.endPoint +
                  'employe_action.php?Action=SUPPRIME_EMPLOYE&IdEmploye=' +
                  employe.ID +
                  '&Token=' +
                  localStorage.getItem('nabysy_token');
                console.log(apiUrl);
                this.http.get(apiUrl).subscribe(async (data) => {
                  console.log(data);
                  if (data['OK'] > 0) {
                    //this.router.navigate(['personnel']);
                    const pos = this.listeEmploye.indexOf(employe);
                    console.log(pos);
                    if (pos > -1) {
                      this.listeEmploye.splice(pos, 1);
                      this.refreshPerson();
                    }
                  } else {
                    console.log(data['OK']);
                  }
                });
              }),
          },
          { text: 'NON' },
        ],
      })
      .then((alertE1) => alertE1.present());
  }

  addEmploye() {
    this.router.navigateByUrl('/crud-employe');
  }

  _openSideNav() {
    this.menu.enable(true, 'menu-content');
    this.menu.open('menu-content');
  }
  userdetails(userDetail: any) {
    this.popupModalService.presentModalEmploye(userDetail);
  }

  doRefresh(event) {
    this.refreshPerson();
    event.target.complete();
  }
  removeVarious() {
    this.bulkEdit = true;
  }
  save() {
    this.bulkEdit = false;
  }
  sortBy(key) {
    this.sortKey = key;
    this.sortDirection++;
  }
  sort() {
    if (this.sortDirection === 1) {
      this.listeEmploye = this.listeEmploye.sort((a, b) => {
        console.log('a: ', a);
        const valA = a[this.sortKey];
        const valB = b[this.sortKey];
        return valA.localeCompare(valB);
      });
    } else if (this.sortDirection === 2) {
      this.listeEmploye = this.listeEmploye.sort((a, b) => {
        const valA = a[this.sortKey];
        const valB = b[this.sortKey];
        return valB.localeCompare(valA);
      });
    } else {
      this.sortDirection = 0;
      this.sortKey = null;
    }
  }
  updateEmploye(userDetail) {
    this.router.navigate(['/crud-employe'], {
      queryParams: userDetail,
    });
  }
}
