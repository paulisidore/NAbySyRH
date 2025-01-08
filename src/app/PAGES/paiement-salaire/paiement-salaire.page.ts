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
  dateValue = format(new Date(), 'yyyy-MMMM');
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
    // this.formattedString= format(parseISO(format(new Date(), 'yyyy-MM-dd')+ 'T09:00:00.000Z'), 'HH:mm, MMM d, yyyy');
    // this.formattedString= format(parseISO(format(new Date(), 'yyyy-MM-dd')+ 'T09:00:00.000Z'), ' yyyy-MM-d ');
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

  /* validatePayment() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Success!',
          text: 'Vos paiements ont bien été effectués.',
          icon: 'success',
        });
        console.log(
          'Employés sélectionnés pour le paiement :',
          this.selectedEmployees
        );
        console.log(this.selectedMonth);
        console.log(this.selectedYear);
        console.log(this.noteModePaiement);
        let IdEmploye = '';
        if (this.id) {
          IdEmploye = '&IDEMPLOYE=' + this.id;
          console.log(IdEmploye);
        }
        this.loadingService.presentLoading();
        this.readAPI(
          environment.endPoint +
            'salaire_action.php?Action=PAIEMENT_SALAIRE&MOIS=' +
            this.selectedMonth +
            '&ANNEE=' +
            this.selectedYear +
            IdEmploye +
            '&NOTE_MODEPAIEMENT=' +
            this.noteModePaiement +
            '&Token=' +
            environment.tokenUser
        ).subscribe((listes) => {
          this.loadingService.dismiss();
          // console.log(Listes);
          this.listePrime = listes;
          console.log(this.listePrime);
        });
      }
    });
  } */

  /* validatePayment() {
    const token = localStorage.getItem('nabysy_token');
    if (!token) {
      console.error('Token not found');
      return; // Arrêter l'exécution si le token est absent
    }
    let IdEmploye = '';
    if (this.id) {
      IdEmploye = '&IDEMPLOYE=' + this.id;
      console.log(IdEmploye);
    }
    this.alertctrl
      .create({
        header: 'Suppresion',
        message:
          'voulez vous effectuer le paiement des salaires des employés ?',
        buttons: [
          {
            text: 'oui',
            handler: () =>
              new Promise(() => {
                this.loadingService.presentLoading();
                const headers = new Headers();
                headers.append('Accept', 'application/json');
                headers.append('Content-Type', 'application/json');
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
                console.log(apiUrl);
                this.http.get(apiUrl).subscribe((listes) => {
                  this.loadingService.dismiss();
                  // console.log(Listes);
                  this.listePrime = listes;
                  console.log(this.listePrime);
                });
              }),
          },
          { text: 'NON' },
        ],
      })
      .then((alertE1) => alertE1.present());
  } */

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
    this.isProcessing = true; // Le traitement commence
    this.progress = 0; // Initialiser la progression à 0%

    // Afficher un alert avec la barre de progression
    const alert = await this.alertctrl.create({
      header: 'Traitement en cours',
      message: 'Paiement des salaires en cours...',
      buttons: [],
      backdropDismiss: false, // Empêcher la fermeture de l'alerte pendant le traitement
      cssClass: 'progress-alert',
    });

    await alert.present();

    // Nombre total d'employés sélectionnés
    const totalEmployees = this.selectedEmployees.length;
    let processedEmployees = 0; // Compteur des employés traités

    // Simuler un traitement pour chaque employé
    for (let i = 0; i < totalEmployees; i++) {
      const employee = this.selectedEmployees[i];
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
        await this.http.get(apiUrl).toPromise(); // Attendre la réponse de l'API
        processedEmployees++; // Incrémenter le compteur des employés traités

        // Mettre à jour la barre de progression
        this.progress = processedEmployees / totalEmployees;

        // Mettre à jour le message de l'alerte avec la progression
        alert.message = `Traitement de ${processedEmployees} sur ${totalEmployees} employés (${processedEmployees}/${totalEmployees})...`;

        // Mettre à jour la barre de progression dans l'alerte
        const progressBar = alert.querySelector('ion-progress-bar');
        if (progressBar) {
          progressBar.setAttribute('value', this.progress.toString());
        }
      } catch (error) {
        console.error('Erreur de paiement:', error);
        break; // Sortir de la boucle si une erreur se produit
      }
    }

    // Fermer l'alerte lorsque tous les employés sont traités
    this.isProcessing = false;
    alert.message = `Tous les paiements ont été effectués avec succès (${totalEmployees}/${totalEmployees})!`;
    this.progress = 1;
    setTimeout(() => {
      alert.dismiss(); // Fermer l'alerte après 2 secondes
    }, 2000);
  }

  readAPI(url: string) {
    return this.http.get(url);
  }
  loadEmploye() {
    this.loadingService.presentLoading();
    // Vérification du token dans le localStorage
    const token = localStorage.getItem('nabysy_token');
    if (!token) {
      console.error('Token not found');
      return; // Arrêter l'exécution si le token est absent
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
      // Traitement des données renvoyées par l'API
      this.listeEmploye = listes; // Liste complète des employés
      this.users = listes; // Utilisation de cette liste pour la recherche et le filtrage

      console.log(this.users);
      console.log(this.listeEmploye);
      this.loadingService.dismiss();

      // Ajouter la propriété `selected` à chaque employé pour la gestion de la sélection
      this.listeEmploye = this.listeEmploye.map((user) => ({
        ...user,
        selected: true, // Par défaut, tous les employés ne sont pas sélectionnés
      }));

      this.selectedEmployees = [...this.listeEmploye]; // Ajouter tous les employés à la sélection par défaut
      this.selectAll = true; // Activer "Select All" par défaut
    });
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

  // Fonction de filtrage des employés
  filterEmployees() {
    if (this.searchTerm.trim() === '') {
      this.filteredEmployees = [...this.listeEmploye]; // Afficher tous les employés si aucune recherche
    } else {
      this.filteredEmployees = this.listeEmploye.filter((user: any) =>
        `${user.EMPLOYE.PRENOM} ${user.EMPLOYE.NOM} ${user.SALAIRE.SALAIRE_BRUT} ${user.SALAIRE.SALAIRE_NET}`
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
      );
    }
  }

  // Fonction de mise à jour de la sélection
  updateSelection(user: any) {
    if (user.selected) {
      // Ajouter à la sélection si ce n'est pas déjà dans la liste
      if (!this.selectedEmployees.some((e) => e.IDEMPLOYE === user.IDEMPLOYE)) {
        this.selectedEmployees.push(user);
      }
    } else {
      // Retirer de la sélection
      this.selectedEmployees = this.selectedEmployees.filter(
        (e) => e.IDEMPLOYE !== user.IDEMPLOYE
      );
    }

    // Mettre à jour l'état de "Select All" en fonction de la sélection
    this.updateSelectAllState();
  }

  // Fonction pour gérer la sélection de tous les employés
  toggleSelectAll() {
    if (this.selectAll) {
      // Si "Select All" est activé, sélectionner tous les employés
      this.listeEmploye.forEach((user) => {
        user.selected = true;
      });
      this.selectedEmployees = [...this.listeEmploye]; // Ajouter tous les employés à la liste des sélectionnés
    } else {
      // Si "Select All" est désactivé, désélectionner tous les employés
      this.listeEmploye.forEach((user) => {
        user.selected = false;
      });
      this.selectedEmployees = []; // Vider la liste des employés sélectionnés
    }

    // Mettre à jour l'état de "Select All" après avoir sélectionné/désélectionné tous les employés
    this.updateSelectAllState();
  }

  // Fonction pour mettre à jour l'état de "Select All"
  updateSelectAllState() {
    // Si tous les employés sont sélectionnés, activer "Select All"
    // this.selectAll = this.listeEmploye.every((user) => user.selected);
    if (this.listeEmploye.length !== this.selectedEmployees.length) {
      this.selectAll = false;
    } else {
      this.selectAll = true;
    }

    // Si un employé est désélectionné, désactiver "Select All"
    /* if (this.listeEmploye.some((user) => !user.selected)) {
      this.selectAll = false;
    } */
  }

  // Ouvrir le modal et transmettre les employés déjà sélectionnés
  /* async openEmployeeModal() {
    const modal = await this.modalctrl.create({
      component: EmployeeModalPage,
      componentProps: {
        selectedEmployees: this.selectedEmployees, // Passer les employés sélectionnés au modal
        month: this.selectedMonth, // Passer le mois au modal
        year: this.selectedYear, // Passer l'année au modal
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.selectedEmployees = result.data; // Mettre à jour la sélection des employés
        // this.saveSelectedEmployees(); // Sauvegarder dans le localStorage
      }
    });

    await modal.present();
  } */
}
