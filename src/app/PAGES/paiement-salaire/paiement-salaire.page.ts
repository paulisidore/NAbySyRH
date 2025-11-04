import { IKSSVTransactionSalaire, PaiementService } from './../../services/paiement.service';
/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-const */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
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
import { firstValueFrom } from 'rxjs';
import { IApiNotification } from 'src/app/services/apireponse-structure.service';
import { CommonKssvServiceService, xLBoutique } from 'src/app/services/common-kssv-service.service';

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
  selectAll: boolean = false; // État de la checkbox principale
  selectAllCheckBox: boolean = false;

  isProcessing = false;
  progress = 0;
  isLoading: boolean = false;

  // Nouvelle propriété pour le mode édition
  isEditMode: boolean = false;

  listeBoutiqueKSSV: xLBoutique[] = [];
  idBoutiqueAPayer: number = 0 ;

  constructor(
    private http: HttpClient,
    private popupModalService: PopupModalService,
    private menu: MenuController,
    private modalctrl: ModalController,
    private service: EmployeService,
    private alertctrl: AlertController,
    private loadingService: LoadingService,
    private paiementSrv: PaiementService,
    private kssvSrv: CommonKssvServiceService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.setToday();
    this.today = new Date().getDate();
    this.loadBoutiqueKSSV();
    this.loadEmploye();
    //console.log(this.selectedMonth);
    //console.log(this.selectedYear);
  }

  loadBoutiqueKSSV(){
    this.kssvSrv.getListeBoutiques().then((data: xLBoutique[]) => {
      this.listeBoutiqueKSSV = data;
      console.log('Liste Boutique reçus: ',this.listeBoutiqueKSSV);
    }).catch(err => {
      console.error('Erreur lors du chargement des boutiques KSSV', err);
    });
  }

  // Nouvelle méthode pour activer/désactiver le mode édition
  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      // Mode édition activé
      Swal.fire({
        icon: 'info',
        title: 'Mode édition activé',
        text: 'Vous pouvez maintenant modifier les montants des salaires nets',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      // Mode édition désactivé
      Swal.fire({
        icon: 'success',
        title: 'Mode édition désactivé',
        text: 'Les modifications ont été verrouillées',
        timer: 2000,
        showConfirmButton: false
      });
    }
  }

  // Nouvelle méthode pour gérer les changements de salaire
  onSalaryChange(user: any) {
    if (!this.isEditMode) {
      return;
    }

    // Valider que le montant est positif
    if (user.SALAIRE.SALAIRE_NET < 0) {
      user.SALAIRE.SALAIRE_NET = 0;
      Swal.fire({
        icon: 'warning',
        title: 'Montant invalide',
        text: 'Le salaire net ne peut pas être négatif',
        timer: 2000,
        showConfirmButton: false
      });
    }

    // Mettre à jour la sélection de l'employé
    if (user.SALAIRE.SALAIRE_NET <= 0) {
      user.selected = false;
      user.status = 'paiement effectué';
      this.selectedEmployees = this.selectedEmployees.filter(
        (e) => e.IDEMPLOYE !== user.IDEMPLOYE
      );
    } else {
      user.status = '';
      if (!this.selectedEmployees.some((e) => e.IDEMPLOYE === user.IDEMPLOYE)) {
        user.selected = true;
        this.selectedEmployees.push(user);
      }
    }

    // Mettre à jour l'état de la checkbox principale après un délai
    setTimeout(() => {
      this.updateSelectAllState();
    }, 0);
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

  async startPaymentProcess(token: string) {
    this.isProcessing = true;
    this.progress = 0;

    // Créer une alerte pour afficher la progression
    const alert = await this.alertctrl.create({
      header: 'Traitement en cours',
      message: 'Traitement de 0 sur ' + this.selectedEmployees.length + ' employés...',
      backdropDismiss: false,
    });

    await alert.present();

    let processedEmployees = 0;
    const totalEmployees = this.selectedEmployees.length;

    for (const employee of this.selectedEmployees) {
      if (employee.SALAIRE.SALAIRE_NET <= 0) {
        processedEmployees++;
        this.progress = processedEmployees / totalEmployees;
        continue; // Passer à l'employé suivant
      }
      let idBout=0;
      let txBout='';
      if(this.idBoutiqueAPayer>0){
        idBout = this.idBoutiqueAPayer ;
        txBout = '&IDBOUTIQUE='+idBout;
      }
      let IdEmploye = `&IDEMPLOYE=${employee.IDEMPLOYE}`;
      const noteModePaiement = employee.noteModePaiement || ''; // Utiliser la note de l'employé
      const apiUrl =
        environment.endPoint +
        'salaire_action.php?Action=PAIEMENT_SALAIRE&MOIS=' +
        this.selectedMonth +
        '&ANNEE=' +
        this.selectedYear +
        IdEmploye +
        '&NOTE_MODEPAIEMENT=' +
        encodeURIComponent(noteModePaiement) +
        txBout +
        '&Token=' +
        token;
      console.log(`Envoie du paiement de l'employé: ${employee.EMPLOYE.PRENOM} ${employee.EMPLOYE.NOM}`, employee);
      console.log('Montant:', -1*employee.SALAIRE.SALAIRE_NET);

      try {
        //await this.http.get(apiUrl).toPromise();
        const donnee = await firstValueFrom(this.http.get(apiUrl)) ;
        const repo: IApiNotification = donnee as IApiNotification;
        console.log('Réponse de l\'API:', repo);
        if(repo && repo.OK !== null && repo.OK >0){
          employee.status = 'succès'; // Paiement réussi
          console.log(
            `Paiement réussi pour ${employee.EMPLOYE.PRENOM} ${employee.EMPLOYE.NOM}`
          );
          //On cree le debit dans mouvement compte client de la Boutique Rattachée au lieu d'affectation de l'employé
          let trans: IKSSVTransactionSalaire = {montant: employee.SALAIRE.SALAIRE_NET,  libelle: `Salaire de `};
          trans.libelle += `${employee.EMPLOYE.PRENOM} ${employee.EMPLOYE.NOM} `;
          trans.libelle += `${this.selectedMonth}/${this.selectedYear}`;
          trans.modePayment = 'WAVE' ; // Mode de paiement par défaut
          trans.idBoutique = employee.EMPLOYE.IDBOUTIQUE;
          trans.montant = -1 * employee.SALAIRE.SALAIRE_NET; // Montant négatif pour un débit
          (await this.paiementSrv.saveTransaction(trans)).subscribe((kssvrep: IApiNotification) =>{
            if(kssvrep && kssvrep.OK !== null && kssvrep.OK >0){
              console.log(`Transaction enregistrée avec succès pour ${employee.EMPLOYE.PRENOM} ${employee.EMPLOYE.NOM}`);
            }else{
              console.error(`Erreur lors de l'enregistrement de la transaction pour ${employee.EMPLOYE.PRENOM}: ` + kssvrep.TxErreur);
            }
          });
        }else if(repo && repo.OK !== null && repo.OK<1){
          console.error(
            `Erreur de paiement pour ${employee.EMPLOYE.PRENOM} ${employee.EMPLOYE.NOM} :` , repo.Contenue
          );
          employee.status = 'échec'; // Paiement échoué
          employee.TxErreur = repo.TxErreur; // Stocker l'erreur pour affichage
          if(repo.Contenue){
            if(repo.Contenue.ERREUR){
              if(Array.isArray(repo.Contenue.ERREUR)){
                console.log('Liste des erreurs:', repo.Contenue.ERREUR);
                if(repo.Contenue.ERREUR.length > 0){
                  employee.TxErreur ='';
                }
                repo.Contenue.ERREUR.forEach((erreur) => {
                  employee.TxErreur += erreur.TxErreur + ' '; // Ajouter chaque erreur à TxErreur
                });
              }
            }
          }
        }else{
          employee.status = 'échec'; // Paiement échoué
          employee.TxErreur = repo.TxErreur; // Stocker l'erreur pour affichage
          console.error(
            `Erreur de paiement pour ${employee.EMPLOYE.PRENOM} ${employee.EMPLOYE.NOM} : Réponse inattendue: ` + donnee
          );
        }
      } catch (error) {
        console.error(
          `Erreur de paiement pour ${employee.EMPLOYE.PRENOM} ${employee.EMPLOYE.NOM}:`,
          error
        );
        employee.status = 'échec'; // Paiement échoué
        employee.TxErreur = `${error}`; // Stocker l'erreur pour affichage
      }
      processedEmployees++;
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
    const token = localStorage.getItem('nabysy_token');
    if (!token) {
      console.error('Token not found');
      return;
    }

    let txBout='';
    if(this.idBoutiqueAPayer>0){
      txBout='&IDBOUTIQUE='+this.idBoutiqueAPayer ;
    }
    const URL =
      environment.endPoint +
      'salaire_action.php?Action=GET_BULLETIN_LIST&MOIS=' +
      this.selectedMonth +
      '&ANNEE=' +
      this.selectedYear +
      txBout +
      '&Token=' +
      token;

    this.loadingService.presentLoading();
    this.isLoading = true;
    this.readAPI(URL).subscribe((listes: any) => {
      //console.log('Liste des employés:', listes);
      this.listeEmploye = listes.map((emp) => ({
        ...emp,
        selected: emp.SALAIRE.SALAIRE_NET > 0, // Sélectionnable uniquement si salaire net > 0
        status: emp.SALAIRE.SALAIRE_NET <= 0 ? 'paiement effectué' : '', // Statut initial
        TxErreur: '', // Initialiser le champ d'erreur
        noteModePaiement: '', // Initialiser la note de paiement individuelle
      }));

      this.users = [...this.listeEmploye];
      this.selectedEmployees = this.listeEmploye.filter(
        (emp) => emp.SALAIRE.SALAIRE_NET > 0
      );

      // Initialiser l'état de la checkbox principale
      setTimeout(() => {
        this.updateSelectAllState();
      }, 0);

      this.loadingService.dismiss();
      this.isLoading = false;
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
    //console.log('Mise à jour de la sélection pour l\'employé:', user);
    if (user.SALAIRE.SALAIRE_NET <= 0) {
      return; // Ne rien faire si l'employé a un salaire net ≤ 0
    }

    // Mettre à jour la liste des employés sélectionnés
    //console.log('Nb Emp. Selectionné: '+this.selectedEmployees.length);
    if (user.selected) {
      if (!this.selectedEmployees.some((e) => e.IDEMPLOYE === user.IDEMPLOYE)) {
        this.selectedEmployees.push(user);
      }
    } else {
      this.selectedEmployees = this.selectedEmployees.filter(
        (e) => e.IDEMPLOYE !== user.IDEMPLOYE
      );
      if(this.selectAllCheckBox){
        console.log('SelectBOX était VRAI il passera à FAUX');
        this.selectAllCheckBox=false;
      }
    }
    //console.log('Nb Emp. Selectionné: '+this.selectedEmployees.length);
    // Mettre à jour l'état de la checkbox principale après un délai

      setTimeout(() => {
          this.updateSelectAllState();
        }, 0);


  }

  // Gérer le changement de la checkbox "Tout sélectionner"
  onSelectAllChange(event: any) {
    const isChecked = event.detail.checked;

    if (isChecked) {
      // Sélectionner tous les employés éligibles
      this.listeEmploye.forEach((user) => {
        if (user.SALAIRE.SALAIRE_NET > 0) {
          user.selected = true;
        }
      });
      this.selectedEmployees = this.listeEmploye.filter(
        (emp) => emp.SALAIRE.SALAIRE_NET > 0
      );
    } else {
      // Désélectionner tous les employés
      this.listeEmploye.forEach((user) => {
        user.selected = false;
      });
      this.selectedEmployees = [];
    }
    this.selectAll = isChecked;
  }

  // Mettre à jour l'état de la checkbox principale
  updateSelectAllState() {
    const selectableEmployees = this.listeEmploye.filter((user) => user.SALAIRE.SALAIRE_NET > 0);
    const employeSelectionne = selectableEmployees.filter((user) => user.selected) ;
    const newSelectAllState = selectableEmployees.length > 0 && employeSelectionne.length === selectableEmployees.length ;
    // Ne mettre à jour que si l'état a vraiment changé
    if (this.selectAll !== newSelectAllState) {
      this.selectAll = newSelectAllState;
      this.cdr.detectChanges();
    }
  }

  allCheckboxDisabled(): boolean {
    return this.listeEmploye.every((user) => user.SALAIRE.SALAIRE_NET <= 0);
  }
  getTotalNetSalary(): number {
    return this.selectedEmployees.reduce((total, employee) => total + (employee.SALAIRE?.SALAIRE_NET || 0), 0);
  }
}
