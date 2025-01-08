/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable no-trailing-spaces */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { Printer } from '@awesome-cordova-plugins/printer/ngx';
import {
  AlertController,
  IonDatetime,
  IonSlides,
  MenuController,
  ModalController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { environment } from 'src/environments/environment';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { format, parseISO } from 'date-fns';
import { PopupModalService } from 'src/app/services/popup-modal.service';

@Component({
  selector: 'app-list-salaires',
  templateUrl: './list-salaires.page.html',
  styleUrls: ['./list-salaires.page.scss'],
})
export class ListSalairesPage implements OnInit {
  listeSalaire: any;
  historySalaire: any;
  url: string;
  infoMensuel: any;
  id: number;
  id_H: number;
  afficheBulletin: boolean;
  sexe: any;
  sexeMx: boolean;
  sexeFn: boolean;
  sexeInc: boolean;
  nom: '';
  qualifiquation: '';
  periode: '';
  salaireBrut: '';
  totalRetenue: '';
  salaireNet: '';
  categorie: '';
  situationFa: '';
  nbTotalJour: '';
  nbheureApayer: '';
  totalHeureApayer: '';
  mois: '';
  adresse: '';
  partTrimf: '0';
  partIrpp: '0';
  periodePaie: '';
  dateEmbauche: '';
  gainPrime: any;
  ligneCotisation: any;
  SALAIRE_BRUT: '0';
  entreprise: '';
  adressEntr: '';
  contactEntre: '';
  emailEntre: '';
  phoneEntre: '';
  prenom: '';

  // ionic selectable************
  searchTerm: string;
  selected_user = null;
  selected: any;
  selected_H: any;
  users: any;
  toggle = true;
  idBoutiquePaie: number;
  idMethodePaie: number;

  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  @ViewChild('selectComponent2') selectComponent2: IonicSelectableComponent;

  listeEmploye: any;
  bulkEdit = false;

  //pdf make******************************
  pdfObj = null;
  items: any;
  items2: any;

  // Pick Date**********************
  @ViewChild(IonDatetime) datetime: IonDatetime;
  today: any;
  /* age =0; */
  //  selectedDate= format(new Date(),'yyyy-MM-dd');
  selectedDate = format(new Date(), 'yyyy');
  selectedDate2 = '';
  selectedDate3 = format(new Date(), 'yyyy-MM-dd');
  selectedMonth = format(new Date(), 'MM');
  selectedMode = 'date';
  showPicker = false;
  dateValue3 = format(new Date(), 'yyyy-MM-dd');
  dateValue2 = format(new Date(), 'yyyy-MM-dd');
  dateValue = format(new Date(), 'yyyy-MM-dd');
  formattedString = format(new Date(), 'MMMM, yyyy');
  showtof: boolean;
  tof: any;
  formattedString2 = '';
  formattedString3 = format(new Date(), 'dd MMMM yyyy');

  // Segments
  segmentList: Array<string> = [
    'PAIEMENT OU AVANCE SALAIRE',
    'HISTORIQUE DES SALAIRES',
  ];
  selectedSegment: string;
  slideList: Array<string> = ['Slide Segment 1', 'Slide Segment 2'];
  @ViewChild('slide') slide: IonSlides;

  constructor(
    private router: Router,
    private modalctrl: ModalController,
    private menu: MenuController,
    private http: HttpClient,
    private popupModalService: PopupModalService,
    private toastctrl: ToastController
  ) {}

  ngOnInit() {
    this.idBoutiquePaie = 0;
    this.idMethodePaie = 0;

    /* this.loadEmploye();
      this.loadSalary();
      this.loadHistorySalary(); */

    if (this.listeSalaire) {
      this.id = this.listeSalaire.IdEmploye;
      if (this.id > 0) {
        this.afficheBulletin = true;
      }
    } else {
      this.afficheBulletin = false;
    }
    if (this.listeEmploye) {
      this.listeEmploye.PHOTO_URL = this.tof;
      if (this.tof) {
        this.showtof = true;
      } else {
        this.showtof = false;
      }
    }

    console.log('Chargement des données...');
    this.loadEmploye();
   this.loadSalary();
   this.loadHistorySalary();
   this.loadInfoMensuel();
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

  loadEmploye() {
    this.readAPI(
      environment.endPoint +
        'employe_action.php?Action=GET_EMPLOYE&Token=' +
        localStorage.getItem('nabysy_token')
    ).subscribe((listes) => {
      console.log(listes);
      this.listeEmploye = listes;
      this.users = listes;
      console.log(this.listeEmploye);
    });
  }
  loadSalary() {
    let txEmploye = '';
    if (this.id > 0) {
      txEmploye = '&IDEMPLOYE=' + this.id;
    }
    this.readAPI(
      environment.endPoint +
        'salaire_action.php?Action=GET_BULLETIN' +
        txEmploye +
        '&ANNEE=' +
        this.selectedDate +
        '&MOIS=' +
        this.selectedMonth +
        '&Token=' +
        localStorage.getItem('nabysy_token')
    ).subscribe((listes) => {
      console.log(listes);
      //  this.dt1=Listes['0'];

      this.listeSalaire = listes;
      console.log(this.listeSalaire);
      if (this.listeSalaire) {
        this.nom = this.listeSalaire.BULLETIN_SALAIRE.NOMEMPLOYE;
        this.qualifiquation = this.listeSalaire.BULLETIN_SALAIRE.QUALIFICATION;
        this.periode = this.listeSalaire.BULLETIN_SALAIRE.PERIODE_DE_PAIE;
        this.adresse = this.listeSalaire.BULLETIN_SALAIRE.ADRESSEEMPLOYE;
        this.salaireBrut = this.listeSalaire.BULLETIN_SALAIRE.SALAIRE_BRUT;
        this.totalRetenue =
          this.listeSalaire.BULLETIN_SALAIRE.LIGNE_GAIN_PRIME.TOTAL_RETENU;
        this.salaireNet = this.listeSalaire.BULLETIN_SALAIRE.SALAIRE_NET;
        this.categorie = this.listeSalaire.BULLETIN_SALAIRE.CATEGORIE;
        this.situationFa = this.listeSalaire.BULLETIN_SALAIRE.SITUATION_FAMILLE;
        this.partTrimf = this.listeSalaire.BULLETIN_SALAIRE.PART_TRIMF;
        this.partIrpp = this.listeSalaire.BULLETIN_SALAIRE.PART_IRPP;
        this.periodePaie = this.listeSalaire.BULLETIN_SALAIRE.PERIODE_DE_PAIE;
        this.dateEmbauche = this.listeSalaire.BULLETIN_SALAIRE.DATE_EMBAUCHE;
        this.gainPrime = this.listeSalaire.BULLETIN_SALAIRE.LIGNE_GAIN_PRIME;
        this.SALAIRE_BRUT = this.listeSalaire.BULLETIN_SALAIRE.SALAIRE_BRUT;
        this.ligneCotisation =
          this.listeSalaire.BULLETIN_SALAIRE.LIGNE_COTISATION;
        this.entreprise = this.listeSalaire.BULLETIN_SALAIRE.NOM_ENTREPRISE;
        this.adressEntr = this.listeSalaire.BULLETIN_SALAIRE.ADR_ENTREPRISE;
        this.contactEntre =
          this.listeSalaire.BULLETIN_SALAIRE.CONTACT_ENTREPRISE;
        this.emailEntre = this.listeSalaire.BULLETIN_SALAIRE.EMAIL_ENTREPRISE;
        this.phoneEntre = this.listeSalaire.BULLETIN_SALAIRE.TEL_ENTREPRISE;
        this.prenom = this.listeSalaire.BULLETIN_SALAIRE.PRENOMEMPLOYE;
      }
      console.log(this.listeSalaire.BULLETIN_SALAIRE.LIGNE_GAIN_PRIME);
    });
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

  loadInfoMensuel() {
    this.readAPI(
      environment.endPoint +
        'salaire_action.php?Action=GET_INFOS_MENSUEL&Token=' +
        localStorage.getItem('nabysy_token')
    ).subscribe((listes) => {
      console.log(listes);
      //  this.dt1=Listes['0'];

      this.infoMensuel = listes;
      console.log(this.infoMensuel);
    });
    if (this.infoMensuel) {
      this.nbTotalJour = this.infoMensuel.NBTOTAL_JOUR;
      this.nbheureApayer = this.infoMensuel.NBHEURE_A_PAYER;
      this.totalHeureApayer = this.infoMensuel.TOTAL_HEURE_A_PAYER;
      this.mois = this.infoMensuel.MOIS;
    }
  }

  readAPI(url: string) {
    console.log(url);
    return this.http.get(url);
  }
  _openSideNav() {
    this.menu.enable(true, 'menu-content');
    this.menu.open('menu-content');
  }
  doRefresh(event) {
    this.loadSalary();
    event.target.complete();
  }
  getBulletin() {
    this.loadSalary();
  }

  openFromCode() {
    this.selectComponent.open();
  }
  clear() {
    this.selectComponent.clear();
    this.selectComponent.close();
    this.id === 0;
  }
  toggleItems() {
    this.selectComponent.toggleItems(this.toggle);
    this.toggle = !this.toggle;
    this.id === 0;
  }
  confirm() {
    this.selectComponent.confirm();
    this.selectComponent.close();
    console.log(this.selected);
    if (this.selected) {
      this.id = this.selected.ID;
    }
    this.loadSalary();
    this.bulkEdit = false;
  }
  bulletinBulkEdit() {
    if (this.selected) {
      this.bulkEdit = true;
      this.loadSalary();
    } else {
      this.bulkEdit = false;
      this.loadSalary();
    }
  }

  goToPrint(bulletin = this.loadSalary) {
    this.router.navigate(['/print-bulletin'], {
      queryParams: bulletin,
    });
  }
  suivant() {
    // this.id= this.selected.id+1;
    // this.loadSalary();
    console.log(this.selected);
  }

  // Date
  dateChanged(value) {
    this.dateValue = value;
    this.formattedString = format(parseISO(value), 'MMMM, yyyy');
    console.log(format(parseISO(value), 'yyyy-MM-dd'));
    this.showPicker = false;
    //  this.selectedDate=value;
    this.selectedDate = format(parseISO(value), 'yyyy');
    this.selectedMonth = format(parseISO(value), 'MM');
  }
  close() {
    this.datetime.cancel(true);
    this.loadSalary();
  }
  select() {
    this.datetime.confirm(true);
    this.loadSalary();
  }

  // ***************************AVANCE SUR SALAIRE**************************************************
  avanceSalaire(avance: any) {
    this.popupModalService.avanceSalaire(avance);
  }
  salairedetails(salaire: any) {
    this.popupModalService.presentModalsalaire(salaire);
  }
  // filter
  reverse = false;
  sort(key) {
    this.id = key;
    this.reverse = !this.reverse;
  }

  //****************************** * Print bulletin ************************************************

  getItems(): void {
    this.items = this.gainPrime;
    console.log(this.items);
  }

  buildTableBody(data: any, columns: any): any {
    const body = [];

    body.push(columns);
    if (data) {
      data.forEach(
        (row: {
          Libelle: any;
          Base: any;
          Taux: any;
          Gain: any;
          Retenu: any;
          COTISATION_PATRONALE_TAUX: any;
          COTISATION_PATRONALE_MONTANT: any;
        }) => {
          const dataRow = [];
          columns.forEach((column: { text: string }) => {
            if (column.text === 'LIBELLE RUBRIQUE') {
              dataRow.push(row.Libelle);
            } else if (column.text === 'Base') {
              dataRow.push(row.Base);
            } else if (column.text === 'Taux') {
              dataRow.push(row.Taux);
            } else if (column.text === 'Gain') {
              dataRow.push(row.Gain);
            } else if (column.text === 'Retenu') {
              dataRow.push(row.Retenu);
            } else if (column.text === 'TAUX') {
              dataRow.push(row.COTISATION_PATRONALE_TAUX);
            } else if (column.text === 'MONTANT') {
              dataRow.push(row.COTISATION_PATRONALE_MONTANT);
            }
          });
          body.push(dataRow);
        }
      );
    } else {
      const dataRow = [];
      dataRow.push('');
      dataRow.push('');
      dataRow.push('');
      dataRow.push('');
      dataRow.push('');
      dataRow.push('');
      body.push(dataRow);
    }

    return body;
  }

  table(data: any, columns: any[]): any {
    return {
      table: {
        widths: [150, 60, 40, 60, 50, 40, 56],
        headerRows: 1,
        body: this.buildTableBody(data, columns),
      },
      layout: {
        hLineWidth(i: number, node: { table: { body: string | any[] } }) {
          return i === 0 || i === node.table.body.length ? 0 : 1;
        },
        vLineWidth(i: number, node: { table: { widths: string | any[] } }) {
          return i === 0 || i === node.table.widths.length ? 2 : 1;
        },
        hLineColor(i: number, node: { table: { body: string | any[] } }) {
          return i === 0 || i === node.table.body.length ? 'black' : 'black';
        },
        vLineColor(i: number, node: { table: { widths: string | any[] } }) {
          return i === 0 || i === node.table.widths.length ? 'black' : 'black';
        },
      },
    };
  }
  // *****************cotisation**********************
  getItems2(): void {
    this.items2 = this.ligneCotisation;
    console.log(this.items2);
  }

  buildTableBody2(data: any, columns: any): any {
    const body = [];
    body.push(columns);

    data.forEach(
      (row: {
        Libelle: any;
        Base: any;
        Taux: any;
        Gain: any;
        Retenu: any;
        COTISATION_PATRONALE_TAUX: any;
        COTISATION_PATRONALE_MONTANT: any;
      }) => {
        const dataRow = [];
        columns.forEach((column: { text: string }) => {
          if (column.text === 'LIBELLE RUBRIQUE') {
            dataRow.push(row.Libelle);
          } else if (column.text === 'Base') {
            dataRow.push(row.Base);
          } else if (column.text === 'Taux') {
            dataRow.push(row.Taux);
          } else if (column.text === 'Gain') {
            dataRow.push(row.Gain);
          } else if (column.text === 'Retenu') {
            dataRow.push(row.Retenu);
          } else if (column.text === 'TAUX') {
            dataRow.push(row.COTISATION_PATRONALE_TAUX);
          } else if (column.text === 'MONTANT') {
            dataRow.push(row.COTISATION_PATRONALE_MONTANT);
          }
        });
        body.push(dataRow);
      }
    );
    return body;
  }

  table2(data: any, columns: any[]): any {
    return {
      table: {
        widths: [150, 60, 40, 60, 50, 40, 56],
        headerRows: 1,
        body: this.buildTableBody2(data, columns),
      },
      layout: {
        hLineWidth(i: number, node: { table: { body: string | any[] } }) {
          return i === 0 || i === node.table.body.length ? 0 : 0;
        },
        vLineWidth(i: number, node: { table: { widths: string | any[] } }) {
          return i === 0 || i === node.table.widths.length ? 2 : 1;
        },
        hLineColor(i: number, node: { table: { body: string | any[] } }) {
          return i === 0 || i === node.table.body.length ? 'black' : 'black';
        },
        vLineColor(i: number, node: { table: { widths: string | any[] } }) {
          return i === 0 || i === node.table.widths.length ? 'black' : 'black';
        },
      },
    };
  }

  downloadPdf() {
    this.loadSalary();

    this.getItems();

    this.getItems2();
    console.log(this.items2);

    const docDefinition = {
      content: [
        {
          columns: [
            {
              text: new Date().toString(),
              alignment: 'right',
            },

            /* {
                    text: new Date().toTimeString(),
                    alignment: 'right',
                  } */
          ],
        },

        {
          text: 'BULLETIN DE SALAIRE \n',
          style: 'header',
          alignment: 'center',
          fontSize: 20,
          bold: true,
        },
        { text: '                    ', style: 'header' },
        {
          style: 'tableExample',
          alignment: 'justify',

          table: {
            headerRows: 1,
            widths: [100, 58, 200, 125],
            heights: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 10],
            body: [
              [
                {
                  text: '',
                  style: 'header',
                  alignment: 'center',
                  border: [true, true, true, false],
                },
                { text: 'Adresse: ', border: [true, true, false, true] },
                {
                  text: this.adressEntr,
                  style: 'tableHeader',
                  alignment: 'left',
                  border: [false, true, true, true],
                },
                {
                  text: '',
                  style: 'header',
                  alignment: 'center',
                  border: [true, true, true, false],
                },
              ],
              [
                {
                  text: this.entreprise,
                  style: 'header',
                  alignment: 'center',
                  rowSpan: 3,
                  border: [true, false, true, true],
                },
                { text: 'Téléphone: ', border: [true, true, false, true] },
                {
                  text: this.phoneEntre,
                  style: 'tableHeader',
                  alignment: 'left',
                  border: [false, true, true, true],
                },
                {
                  text: 'BULLETIN DE PAIE',
                  style: 'header',
                  alignment: 'center',
                  rowSpan: 3,
                  border: [true, false, true, true],
                },
              ],
              [
                { text: '', style: 'tableHeader' },
                { text: 'Fax: ', border: [true, true, false, true] },
                {
                  text: this.contactEntre,
                  style: 'tableHeader',
                  alignment: 'left',
                  border: [false, true, true, true],
                },
                { text: '', style: 'tableHeader' },
              ],
              [
                { text: '', style: 'tableHeader', alignment: 'center' },
                { text: ' Email: ', border: [true, true, false, true] },
                {
                  text: this.emailEntre,
                  style: 'tableHeader',
                  border: [false, true, true, true],
                },
                { text: '', style: 'tableHeader' },
              ],
              [
                { text: 'CONVENTION\n COLLECTIVE', alignment: 'center' },
                {
                  text: 'PRENOM & NOM',
                  alignment: 'center',
                  bold: true,
                  colSpan: 2,
                },
                {},
                { text: 'ADRESSE', alignment: 'center' },
              ],
              [
                { text: this.qualifiquation, alignment: 'center' },
                {
                  text: this.prenom + ' ' + this.nom,
                  alignment: 'center',
                  bold: true,
                  colSpan: 2,
                },
                {},
                { text: this.adresse, alignment: 'center' },
              ],
              [
                {
                  text: '',
                  style: 'header',
                  fontsize: 40,
                  colSpan: 4,
                  border: [true, true, true, false],
                },
              ],
            ],
          },

          layout: {
            hLineWidth(i: number, node: { table: { body: string | any[] } }) {
              return i === 0 || i === node.table.body.length ? 2 : 1;
            },
            vLineWidth(i: number, node: { table: { widths: string | any[] } }) {
              return i === 0 || i === node.table.widths.length ? 2 : 1;
            },
            hLineColor(i: number, node: { table: { body: string | any[] } }) {
              return i === 0 || i === node.table.body.length
                ? 'black'
                : 'black';
            },
            vLineColor(i: number, node: { table: { widths: string | any[] } }) {
              return i === 0 || i === node.table.widths.length
                ? 'black'
                : 'black';
            },
          },
        },
        {
          style: 'tableExample',
          table: {
            widths: [100, 40, 50, 47, 47, 50, 56, 57],
            heights: ['auto', 'auto', 10],
            headerRows: 2,
            body: [
              [
                { text: 'QUALIFICATION', alignment: 'center', style: 'header' },
                { text: 'N° D\'ordre', alignment: 'center', fontSize: 10 },
                { text: 'Catégorie', alignment: 'center', fontSize: 10 },
                {
                  text: 'Situation\n Familiale',
                  alignment: 'center',
                  fontSize: 10,
                },
                { text: 'PART IRPP', alignment: 'center', fontSize: 10 },
                { text: 'PART\n TRIMF', alignment: 'center', fontSize: 10 },
                { text: 'Période de Paie', alignment: 'center', fontSize: 10 },
                { text: 'DATE D\'embauche', alignment: 'center', fontSize: 10 },
              ],
              [
                {
                  text: this.qualifiquation,
                  alignment: 'center',
                  style: 'header',
                },
                { text: '1', alignment: 'center', fontSize: 10 },
                { text: this.categorie, alignment: 'center', fontSize: 10 },
                { text: this.situationFa, alignment: 'center', fontSize: 10 },
                { text: this.partTrimf, alignment: 'center', fontSize: 10 },
                { text: this.partIrpp, alignment: 'center', fontSize: 10 },
                { text: this.periodePaie, alignment: 'center', fontSize: 10 },
                { text: this.dateEmbauche, alignment: 'center', fontSize: 10 },
              ],
              [
                {
                  text: '',
                  style: 'header',
                  fontsize: 40,
                  colSpan: 6,
                  border: [true, true, false, true],
                },
                {},
                {},
                {},
                {},
                {},
                {
                  text: 'COTISATIONS PATRONALES',
                  style: 'header',
                  bold: true,
                  alignment: 'right',
                  fontsize: 40,
                  colSpan: 2,
                  border: [false, true, true, true],
                },
                {},
              ],
            ],
          },
          layout: {
            hLineWidth(i: number, node: { table: { body: string | any[] } }) {
              return i === 0 || i === node.table.body.length ? 1 : 1;
            },
            vLineWidth(i: number, node: { table: { widths: string | any[] } }) {
              return i === 0 || i === node.table.widths.length ? 2 : 1;
            },
            hLineColor(i: number, node: { table: { body: string | any[] } }) {
              return i === 0 || i === node.table.body.length
                ? 'black'
                : 'black';
            },
            vLineColor(i: number, node: { table: { widths: string | any[] } }) {
              return i === 0 || i === node.table.widths.length
                ? 'black'
                : 'black';
            },
          },
        },

        this.table(this.items, [
          {
            text: 'LIBELLE RUBRIQUE',
            alignment: 'center',
            style: 'header',
            margin: [0, 5],
            fontSize: 10,
            border: [true, true, true, true],
          },
          {
            text: 'Base',
            alignment: 'center',
            style: 'header',
            margin: [0, 5],
            fontSize: 10,
            border: [true, true, true, true],
          },
          {
            text: 'Taux',
            alignment: 'center',
            style: 'header',
            margin: [0, 5],
            fontSize: 10,
            border: [true, true, true, true],
          },
          {
            text: 'Gain',
            alignment: 'center',
            style: 'header',
            margin: [0, 5],
            fontSize: 10,
            border: [true, true, true, true],
          },
          {
            text: 'Retenu',
            alignment: 'center',
            style: 'header',
            margin: [0, 5],
            fontSize: 10,
            border: [true, true, true, true],
          },
          {
            text: 'TAUX',
            alignment: 'center',
            style: 'header',
            margin: [0, 5],
            fontSize: 10,
            border: [true, true, true, true],
          },
          {
            text: 'MONTANT',
            alignment: 'center',
            style: 'header',
            margin: [0, 5],
            fontSize: 10,
            border: [true, true, true, true],
          },
        ]),

        {
          style: 'tableExample',
          table: {
            widths: [150, 60, 40, 60, 50, 40, 56],
            headerRows: 1,
            body: [
              [
                {
                  text: '**Salaire Brut** (1)',
                  alignment: 'center',
                  style: 'header',
                  margin: [0, 5],
                },
                {},
                {},
                {
                  text: this.SALAIRE_BRUT,
                  alignment: 'center',
                  margin: [0, 5],
                },
                {},
                {},
                {},
              ],
            ],
          },
          layout: {
            hLineWidth(i: number, node: { table: { body: string | any[] } }) {
              return i === 0 || i === node.table.body.length ? 2 : 1;
            },
            vLineWidth(i: number, node: { table: { widths: string | any[] } }) {
              return i === 0 || i === node.table.widths.length ? 2 : 1;
            },
            hLineColor(i: number, node: { table: { body: string | any[] } }) {
              return i === 0 || i === node.table.body.length
                ? 'black'
                : 'black';
            },
            vLineColor(i: number, node: { table: { widths: string | any[] } }) {
              return i === 0 || i === node.table.widths.length
                ? 'black'
                : 'black';
            },
          },
        },
        this.table2(this.items2, [
          {
            text: 'LIBELLE RUBRIQUE',
            alignment: 'center',
            style: 'header',
            margin: [0, 5],
            fontSize: 10,
          },
          {
            text: 'Base',
            alignment: 'center',
            style: 'header',
            margin: [0, 5],
            fontSize: 10,
          },
          {
            text: 'Taux',
            alignment: 'center',
            style: 'header',
            margin: [0, 5],
            fontSize: 10,
          },
          {
            text: 'Gain',
            alignment: 'center',
            style: 'header',
            margin: [0, 5],
            fontSize: 10,
          },
          {
            text: 'Retenu',
            alignment: 'center',
            style: 'header',
            margin: [0, 5],
            fontSize: 10,
          },
          {
            text: 'TAUX',
            alignment: 'center',
            style: 'header',
            margin: [0, 5],
            fontSize: 10,
          },
          {
            text: 'MONTANT',
            alignment: 'center',
            style: 'header',
            margin: [0, 5],
            fontSize: 10,
          },
        ]),
        {
          style: 'tableExample',
          table: {
            widths: [150, 60, 40, 60, 50, 40, 56],
            headerRows: 1,
            body: [
              [
                {
                  text: 'Total Cotisation Patronale',
                  alignment: 'center',
                  style: 'header',
                  margin: [0, 5],
                  border: [true, true, true, false],
                },
                { text: '', border: [true, true, true, false] },
                { text: '', border: [true, true, true, false] },
                {
                  text: '',
                  alignment: 'center',
                  margin: [0, 5],
                  border: [true, true, true, false],
                },
                { text: '', border: [true, true, true, false] },
                { text: '', border: [true, true, true, false] },
                {
                  text: this.listeSalaire.BULLETIN_SALAIRE
                    .TOTAL_COTISATION_PATRONALE,
                  border: [false, true, true, false],
                },
              ],
            ],
          },
          layout: {
            hLineWidth(i: number, node: { table: { body: string | any[] } }) {
              return i === 0 || i === node.table.body.length ? 2 : 0;
            },
            vLineWidth(i: number, node: { table: { widths: string | any[] } }) {
              return i === 0 || i === node.table.widths.length ? 2 : 1;
            },
            hLineColor(i: number, node: { table: { body: string | any[] } }) {
              return i === 0 || i === node.table.body.length
                ? 'black'
                : 'black';
            },
            vLineColor(i: number, node: { table: { widths: string | any[] } }) {
              return i === 0 || i === node.table.widths.length
                ? 'black'
                : 'black';
            },
          },
        },
        {
          style: 'tableExample',
          table: {
            widths: [150, 60, 40, 60, 50, 40, 56],
            headerRows: 1,
            body: [
              [
                {
                  text: '**Total des retenues** (2)',
                  alignment: 'center',
                  style: 'header',
                  margin: [0, 5],
                },
                {},
                {},
                { text: '', alignment: 'center', margin: [0, 5] },
                { text: this.listeSalaire.BULLETIN_SALAIRE.TOTAL_RETENU },
                { text: '', border: [true, false, true, false] },
                { text: '', border: [false, false, true, false] },
              ],
            ],
          },
          layout: {
            hLineWidth(i: number, node: { table: { body: string | any[] } }) {
              return i === 0 || i === node.table.body.length ? 2 : 1;
            },
            vLineWidth(i: number, node: { table: { widths: string | any[] } }) {
              return i === 0 || i === node.table.widths.length ? 2 : 1;
            },
            hLineColor(i: number, node: { table: { body: string | any[] } }) {
              return i === 0 || i === node.table.body.length
                ? 'black'
                : 'black';
            },
            vLineColor(i: number, node: { table: { widths: string | any[] } }) {
              return i === 0 || i === node.table.widths.length
                ? 'black'
                : 'black';
            },
          },
        },
        {
          style: 'tableExample',
          table: {
            widths: [150, 60, 40, 60, 50, 40, 56],
            headerRows: 1,
            body: [
              [
                {
                  text: '**Salaire Net** (3) = (1) - (2)',
                  alignment: 'center',
                  style: 'header',
                  margin: [0, 5],
                  border: [true, false, true, true],
                },
                {
                  text: this.listeSalaire.BULLETIN_SALAIRE.SALAIRE_NET,
                  border: [true, false, true, true],
                },
                { text: '', border: [true, false, true, true] },
                {
                  text: '',
                  alignment: 'center',
                  margin: [0, 5],
                  border: [true, false, true, true],
                },
                { text: '', border: [true, false, true, true] },
                { text: '', border: [true, false, true, true] },
                { text: '', border: [true, false, true, true] },
              ],
            ],
          },
          layout: {
            hLineWidth(i: number, node: { table: { body: string | any[] } }) {
              return i === 0 || i === node.table.body.length ? 2 : 1;
            },
            vLineWidth(i: number, node: { table: { widths: string | any[] } }) {
              return i === 0 || i === node.table.widths.length ? 2 : 1;
            },
            hLineColor(i: number, node: { table: { body: string | any[] } }) {
              return i === 0 || i === node.table.body.length
                ? 'black'
                : 'black';
            },
            vLineColor(i: number, node: { table: { widths: string | any[] } }) {
              return i === 0 || i === node.table.widths.length
                ? 'black'
                : 'black';
            },
          },
        },
      ],
      defaultStyle: {
        fontSize: 8,
      },
    };

    // download the PDF
    pdfMake.createPdf(docDefinition).download();
    console.log(this.items);
  }

  // ***********************
  userdetails(userDetail: any) {
    this.popupModalService.presentModalEmploye(userDetail);
  }
  async presentToast(a) {
    const toast = await this.toastctrl.create({
      message: a,
      duration: 3000,
      position: 'middle',
    });
    toast.present();
  }

  //Effectue le paiement avec l'API de la plate-forme de gestion KSSV

  payerSalaire(detailSalaireH: any) {
    const detailSalaire = detailSalaireH.BULLETIN_SALAIRE;
    const libelle =
      'SALAIRE ' +
      this.periode +
      ': ' +
      this.selected.Prenom +
      ' ' +
      this.selected.Nom;
    let montant = detailSalaire.SALAIRE_NET;
    if (montant <= 0) {
      montant = 0;
      return;
    }
    console.log('Infos DetailSalaire: ', detailSalaire);

    const param =
      '&IDBOUTIQUE=' +
      this.idBoutiquePaie +
      '&IDEMPLOYE=' +
      detailSalaire.IDEMPLOYE +
      '&LIBELLE=' +
      libelle +
      '&MONTANT=' +
      montant +
      '&ID_MODEPAIE=' +
      this.idMethodePaie;
    this.readAPI(
      environment.endPoint +
        'salaire_action.php?Action=PAIEMENT_SALAIRE&' +
        param +
        '&Token=' +
        localStorage.getItem('nabysy_token')
    ).subscribe((reponse: any) => {
      console.log(reponse);
      if (reponse.OK > 0) {
        this.loadSalary();
        this.presentToast('Paiement effectué.');
        const transaction = reponse.Contenue;
        this.pdfRecu(transaction);
      } else {
        this.presentToast('ERREUR: ' + reponse.TxErreur);
      }
    });
  }

  // Reçu paiement Salaire**
  pdfRecu(infoTransaction: any) {
    const docDef = {
      watermark: {
        text: 'NAbySy-RH',
        color: 'blue',
        opacity: 0.1,
        bold: false,
      },
      // a string or { width: number, height: number }
      pageSize: 'A4',

      pageOrientation: 'portrait',

      pageMargins: [20, 10, 40, 60],

      content: [
        {
          columns: [
            {
              text: new Date().toString(),
              alignment: 'right',
              margin: [5, 2, 0, 20],
            },
          ],
        },
        { text: 'Reçu', style: 'header', alignment: 'center' },
        {
          text: 'Reçu de ' + this.prenom + ' ' + this.nom,
          margin: [0, 10, 0, 10],
        },
        'Je, soussigné(e) ' +
          this.prenom +
          ' ' +
          this.nom +
          ', reconnais avoir reçu la somme de  ' +
          this.listeSalaire.BULLETIN_SALAIRE.SALAIRE_NET +
          ' FCFA. Cette somme a été reçu pour le solde du mois de: ' +
          this.periode,
        {
          text: 'Le paiement a été fait par__________________________.( espèce, chèque…). ',
          margin: [0, 20, 5, 10],
        },
        'Ce reçu confirme que le paiement a bien été effectuée.',
        { text: 'Signature', margin: [0, 500, 0, 0], alignment: 'right' },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableExample: {
          margin: [0, 5, 0, 15],
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black',
        },
      },
      defaultStyle: {
        // alignment: 'justify'
      },
    };

    this.pdfObj = pdfMake.createPdf(docDef).download();
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
