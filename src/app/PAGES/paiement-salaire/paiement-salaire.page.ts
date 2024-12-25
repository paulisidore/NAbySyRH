/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-const */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonDatetime,
  MenuController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { PopupModalService } from 'src/app/services/popup-modal.service';
import { environment } from 'src/environments/environment';
import { format, parseISO } from 'date-fns';
import { IonicSelectableComponent } from 'ionic-selectable';

@Component({
  selector: 'app-paiement-salaire',
  templateUrl: './paiement-salaire.page.html',
  styleUrls: ['./paiement-salaire.page.scss'],
})
export class PaiementSalairePage implements OnInit {
  historySalaire: any;
  selected_H: any;
  users: any;
  id_H: number;

  dateValue2 = format(new Date(), 'yyyy-MM-dd');
  dateValue3 = format(new Date(), 'yyyy-MM-dd');
  showPicker = false;
  formattedString2 = '';
  formattedString3 = format(new Date(), 'dd MMMM yyyy');

  selectedDate2 = '';
  selectedDate3 = format(new Date(), 'yyyy-MM-dd');
  @ViewChild(IonDatetime) datetime: IonDatetime;
  @ViewChild('selectComponent2') selectComponent2: IonicSelectableComponent;
  toggle = true;

  constructor(
    private router: Router,
    private modalctrl: ModalController,
    private menu: MenuController,
    private http: HttpClient,
    private popupModalService: PopupModalService,
    private toastctrl: ToastController
  ) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  salairedetails(salaire: any) {
    this.popupModalService.presentModalsalaire(salaire);
  }

  loadHistorySalary() {
    let txEmploye = '';
    if (this.id_H > 0) {
      txEmploye = '&IDEMPLOYE=' + this.id_H;
    }
    this.readAPI(
      environment.endPoint +
        'salaire_action.php?Action=GET_SALAIRE' +
        txEmploye +
        '&DATEDEBUT=' +
        this.selectedDate2 +
        '&DATEFIN=' +
        this.selectedDate3 +
        '&Token=' +
        localStorage.getItem('nabysy_token')
    ).subscribe((listes) => {
      console.log(listes);
      this.historySalaire = listes;
    });
  }
  readAPI(url: string) {
    console.log(url);
    return this.http.get(url);
  }

  // Historique salaire
  dateChangedHistory(value) {
    this.dateValue2 = value;
    this.formattedString2 = format(parseISO(value), 'dd MMMM yyyy');
    console.log(format(parseISO(value), 'yyyy-MM-dd'));
    this.showPicker = false;
    //  this.selectedDate=value;
    this.selectedDate2 = value;
  }
  dateChangedHistoryEnd(value) {
    this.dateValue3 = value;
    this.formattedString3 = format(parseISO(value), 'dd MMMM yyyy');
    console.log(format(parseISO(value), 'yyyy-MM-dd'));
    this.showPicker = false;
    //  this.selectedDate=value;
    this.selectedDate3 = value;
  }
  effacedateDebut() {
    this.datetime.cancel(true);
    this.selectedDate2 = '';
    this.formattedString2 = '';
    this.loadHistorySalary();
  }
  effacedateFin() {
    this.datetime.cancel(true);
    this.selectedDate3 = '';
    this.formattedString3 = '';
    this.loadHistorySalary();
  }
  close_H() {
    this.datetime.cancel(true);
    this.loadHistorySalary();
  }
  select_H() {
    this.datetime.confirm(true);
    this.loadHistorySalary();
  }

  // Select employe
  clear_H() {
    this.selectComponent2.clear();
    this.selectComponent2.close();
    this.id_H === 0;
  }
  toggleItems_H() {
    this.selectComponent2.toggleItems(this.toggle);
    this.toggle = !this.toggle;
    this.id_H === 0;
  }
  confirm_H() {
    this.selectComponent2.confirm();
    this.selectComponent2.close();
    console.log(this.selected_H);
    if (this.selected_H) {
      this.id_H = this.selected_H.ID;
    }
    this.loadHistorySalary();
  }
}
