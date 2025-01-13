/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-const */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AlertController,
  IonDatetime,
  MenuController,
  ModalController,
} from '@ionic/angular';
import { EmployeService } from 'src/app/services/employe.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PopupModalService } from 'src/app/services/popup-modal.service';
import { environment } from 'src/environments/environment';
import { format, parseISO } from 'date-fns';
import { IonicSelectableComponent } from 'ionic-selectable';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-paiement-salaire',
  templateUrl: './paiement-salaire.page.html',
  styleUrls: ['./paiement-salaire.page.scss'],
})
export class PaiementSalairePage implements OnInit {
  @ViewChild(IonDatetime) datetime: IonDatetime;
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;

  // Pick Date
  today: any;
  /* age =0; */
  selectedDate = format(new Date(), 'yyyy-MM');
  selectedDate2 = format(new Date(), 'yyyy-MM-dd');
  modes = ['date', 'month', 'month-year', 'year'];
  selectedMode = 'date';
  showPicker = false;
  dateValue = format(new Date(), 'yyyy-MM-dd');
  dateValue2 = format(new Date(), 'yyyy-MM-dd');
  formattedString = '';
  formattedString2 = '';

  users = []; // Liste des employés chargée depuis le backend
  selectedEmployees = []; // Liste des employés sélectionnés
  filteredEmployees = []; // Liste des employés filtrés
  searchTerm = ''; // Terme de recherche
  searchText = '';
  filteredUsers = [...this.users]; // Initially all users are shown
  selectedMonth: string = format(new Date(), 'MM'); // Mois sélectionné
  selectedYear: string = format(new Date(), 'yyyy'); // Année sélectionnée
  id: any;
  listePrime: any;
  listeEmploye: any[];
  selectAll: boolean = false; // Indicateur de sélection "Select All"
  noteModePaiement: string;
  isProcessing = false;
  progress = 0;

  constructor(
    private http: HttpClient,
    private popupModalService: PopupModalService,
    private menu: MenuController,
    private modalctrl: ModalController,
    private service: EmployeService,
    private alertctrl: AlertController,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.setToday();
    this.today = new Date().getDate();
    this.loadEmploye();
    console.log(this.selectedMonth);
    console.log(this.selectedYear);
  }

  setToday() {
    this.dateValue = format(new Date(), 'yyyy-MM-dd');
    this.formattedString = format(
      parseISO(format(new Date(), 'yyyy-MM-dd') + 'T09:00:00.000Z'),
      ' yyyy-MMMM '
    );
  }
  dateChanged(value) {
    this.dateValue = value;
    this.formattedString = value;
    this.showPicker = false;
    this.selectedDate = value;
    this.selectedMonth = format(parseISO(this.selectedDate), 'MM');
    this.selectedYear = format(parseISO(this.selectedDate), 'yyyy');
  }
  dateChangedFin(value) {
    this.dateValue2 = value;
    this.formattedString2 = value;
    this.showPicker = false;
    this.selectedDate2 = value;
  }
  close() {
    this.datetime.cancel(true);
  }
  select() {
    this.datetime.confirm(true);
    // this.loadPaiement();
    console.log(this.selectedDate);
    this.selectedMonth = format(parseISO(this.selectedDate), 'MM');
    console.log(this.selectedMonth);
    this.selectedYear = format(parseISO(this.selectedDate), 'yyyy');
    console.log(this.selectedYear);
    this.loadEmploye();
  }
  effacedateDebut() {
    this.datetime.cancel(true);
    this.selectedDate = '';
    this.formattedString = '';
  }
  effacedateFin() {
    this.datetime.cancel(true);
    this.selectedDate2 = '';
    this.formattedString2 = '';
  }

  async validatePayment() {
    const token = localStorage.getItem('nabysy_token');
    if (!token) {
      console.error('Token not found');
      return; // Arrêter l'exécution si le token est absent
    }

    // Ouvrir une alerte pour demander la confirmation de l'utilisateur
    const alert = await this.alertctrl.create({
      header: 'Confirmation',
      message:
        'Voulez-vous effectuer le paiement des salaires des employés sélectionnés ?',
      buttons: [
        {
          text: 'Oui',
          handler: () => this.startPaymentProcess(token),
        },
        {
          text: 'Non',
          handler: () => {
            console.log('Action annulée');
          },
        },
      ],
    });

    await alert.present();
  }

  // Fonction pour démarrer le processus de paiement
  async startPaymentProcess(token: string) {
    this.isProcessing = true;
    this.progress = 0;

    const alert = await this.alertctrl.create({
      header: 'Traitement en cours',
      message: 'Paiement des salaires en cours...',
      buttons: [],
      backdropDismiss: false,
      cssClass: 'progress-alert',
    });

    await alert.present();

    const totalEmployees = this.selectedEmployees.length;
    let processedEmployees = 0;

    for (let i = 0; i < totalEmployees; i++) {
      const employee = this.selectedEmployees[i];

      if (employee.SALAIRE.SALAIRE_NET <= 0) {
        employee.status = 'paiement effectué'; // Statut automatique
        console.log(
          `Paiement automatique pour ${employee.EMPLOYE.PRENOM} ${employee.EMPLOYE.NOM} (Salaire Net <= 0)`
        );
        processedEmployees++;
        continue; // Passer à l'employé suivant
      }

      let IdEmploye = `&IDEMPLOYE=${employee.IDEMPLOYE}`;
      const apiUrl =
        environment.endPoint +
        'salaire_action.php?Action=PAIEMENT_SALAIRE&MOIS=' +
        this.selectedMonth +
        '&ANNEE=' +
        this.selectedYear +
        IdEmploye +
        '&NOTE_MODEPAIEMENT=' +
        this.noteModePaiement +
        '&Token=' +
        token;

      try {
        await this.http.get(apiUrl).toPromise();
        employee.status = 'succès'; // Paiement réussi
        console.log(
          `Paiement réussi pour ${employee.EMPLOYE.PRENOM} ${employee.EMPLOYE.NOM}`
        );
        processedEmployees++;
      } catch (error) {
        console.error(
          `Erreur de paiement pour ${employee.EMPLOYE.PRENOM} ${employee.EMPLOYE.NOM}:`,
          error
        );
        employee.status = 'échec'; // Paiement échoué
      }

      this.progress = processedEmployees / totalEmployees;
      alert.message = `Traitement de ${processedEmployees} sur ${totalEmployees} employés...`;
    }

    this.isProcessing = false;
    alert.message = `Paiement terminé. ${totalEmployees} employés traités.`;
    setTimeout(() => {
      alert.dismiss();
    }, 2000);
  }

  readAPI(url: string) {
    return this.http.get(url);
  }

  _openSideNav() {
    this.menu.enable(true, 'menu-content');
    this.menu.open('menu-content');
  }

  doRefresh(event) {
    this.loadEmploye();
    event.target.complete();
  }

  openFromCode() {
    this.selectComponent.open();
  }
  loadEmploye() {
    this.loadingService.presentLoading();
    const token = localStorage.getItem('nabysy_token');
    if (!token) {
      console.error('Token not found');
      return;
    }

    const URL =
      environment.endPoint +
      'salaire_action.php?Action=GET_BULLETIN_LIST&MOIS=' +
      this.selectedMonth +
      '&ANNEE=' +
      this.selectedYear +
      '&Token=' +
      token;

    console.log(URL);

    this.readAPI(URL).subscribe((listes: any) => {
      this.listeEmploye = listes.map((user) => ({
        ...user,
        selected: user.SALAIRE.SALAIRE_NET > 0, // Sélectionnable uniquement si salaire net > 0
        status: user.SALAIRE.SALAIRE_NET <= 0 ? 'paiement effectué' : '', // Statut initial
      }));

      this.users = [...this.listeEmploye];
      this.selectedEmployees = this.listeEmploye.filter(
        (user) => user.SALAIRE.SALAIRE_NET > 0
      );
      this.selectAll =
        this.selectedEmployees.length > 0 && !this.allCheckboxDisabled();
      this.loadingService.dismiss();
    });
  }

  // Confirmation de la sélection
  confirmSelection() {
    console.log('Employés sélectionnés:', this.selectedEmployees);
    // Vous pouvez envoyer ces données au backend pour un traitement
  }
  fixAriaHiddenIssue() {
    const focusedElement = document.activeElement as HTMLElement;
    if (!focusedElement) {
      return;
    }

    // Parcours des parents pour trouver ceux qui ont aria-hidden="true"
    let ancestorWithAriaHidden = focusedElement.closest('[aria-hidden="true"]');
    while (ancestorWithAriaHidden) {
      // Retirer aria-hidden
      ancestorWithAriaHidden.setAttribute('aria-hidden', 'false');
      ancestorWithAriaHidden = ancestorWithAriaHidden.parentElement?.closest(
        '[aria-hidden="true"]'
      );
    }
  }

  // Fonction de mise à jour de la sélection
  updateSelection(user: any) {
    if (user.SALAIRE.SALAIRE_NET <= 0) {
      return; // Ne rien faire si l'employé a un salaire net ≤ 0
    }

    if (user.selected) {
      if (!this.selectedEmployees.some((e) => e.IDEMPLOYE === user.IDEMPLOYE)) {
        this.selectedEmployees.push(user);
      }
    } else {
      this.selectedEmployees = this.selectedEmployees.filter(
        (e) => e.IDEMPLOYE !== user.IDEMPLOYE
      );
    }

    this.updateSelectAllState();
  }

  // Fonction pour gérer la sélection de tous les employés
  toggleSelectAll() {
    if (this.selectAll) {
      this.listeEmploye.forEach((user) => {
        if (user.SALAIRE.SALAIRE_NET > 0) {
          user.selected = true;
        }
      });
      this.selectedEmployees = this.listeEmploye.filter(
        (user) => user.SALAIRE.SALAIRE_NET > 0
      );
    } else {
      this.listeEmploye.forEach((user) => {
        user.selected = false;
      });
      this.selectedEmployees = [];
    }

    this.updateSelectAllState();
  }

  // Fonction pour mettre à jour l'état de "Select All"
  updateSelectAllState() {
    this.selectAll = this.listeEmploye
      .filter((user) => user.SALAIRE.SALAIRE_NET > 0)
      .every((user) => user.selected);
  }

  allCheckboxDisabled(): boolean {
    return this.listeEmploye.every((user) => user.SALAIRE.SALAIRE_NET <= 0);
  }
}
