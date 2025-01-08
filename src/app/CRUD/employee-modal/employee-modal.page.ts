/* eslint-disable @typescript-eslint/no-inferrable-types */
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-employee-modal',
  templateUrl: './employee-modal.page.html',
  styleUrls: ['./employee-modal.page.scss'],
})
export class EmployeeModalPage implements OnInit {
  @Input() selectedMonth: string;
  users = []; // Liste complète des employés
  filteredUsers = []; // Liste filtrée des employés
  searchText = ''; // Texte de recherche
  selectedEmployees = []; // Liste des employés sélectionnés
  selectedYear: '';
  selectAllChecked: boolean = false; // Indicateur pour "Select All"

  constructor(
    private modalController: ModalController,
    private http: HttpClient,
    private navParams: NavParams, private loadingService: LoadingService
  ) {}

  ngOnInit() {
    // Appeler loadEmploye() pour récupérer les employés lors de l'initialisation
    // Récupérer les données du mois, année et employés sélectionnés
    /*    this.selectedMonth = this.selectedMonth;
     this.selectedYear = this.selectedYear; */
    this.selectedMonth = this.navParams.get('month');
    this.selectedYear = this.navParams.get('year');
    console.log('Month:', this.selectedMonth);
    console.log('Year:', this.selectedYear);
    this.loadEmploye();
  }
  readAPI(url: string) {
    return this.http.get(url);
  }
  // Charger la liste des employés (méthode à appeler)
  loadEmploye() {
    this.loadingService.presentLoading();
    const token = localStorage.getItem('nabysy_token');
    if (!token) {
      console.error('Token not found');
      return;
    }

    // Requête API pour récupérer la liste des employés
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
      this.users = listes; // Liste des employés
      this.filteredUsers = [...this.users]; // Initialisation de la liste filtrée
      console.log(listes);
      this.loadingService.dismiss();
      // Marquer les employés déjà sélectionnés
      for (const user of this.users) {
        user.selected = this.selectedEmployees.some(
          (selected) => selected.id === user.id
        );
      }
    });
  }

  // Filtrer les employés selon le texte de recherche
  filterUsers() {
    if (this.searchText.trim() === '') {
      this.filteredUsers = [...this.users]; // Afficher tous les employés si aucune recherche
    } else {
      this.filteredUsers = this.users.filter((user) =>
        `${user.Prenom} ${user.Nom} ${user.Fonction} ${user.DIRECTION}`
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
      );
    }
  }

  // Mettre à jour la sélection des employés
  updateSelection(user: any) {
    if (user.selected) {
      this.selectedEmployees.push(user); // Ajouter à la sélection
    } else {
      this.selectedEmployees = this.selectedEmployees.filter(
        (e) => e.id !== user.id
      ); // Retirer de la sélection
    }
  }

  // Confirmer la sélection et fermer le modal
  confirmSelection() {
    this.modalController.dismiss(this.selectedEmployees); // Renvoie la sélection d'employés au parent
  }

  // Fermer le modal sans aucune sélection
  dismiss() {
    this.modalController.dismiss();
  }
  // Fonction pour "Sélectionner tout"
  selectAll() {
    this.filteredUsers.forEach(user => {
      user.selected = true; // Sélectionner tous les utilisateurs
    });
    this.selectedEmployees = [...this.filteredUsers]; // Ajouter tous les employés à la liste des sélectionnés
    this.selectAllChecked = true; // Marquer "Select All" comme sélectionné
  }

  // Fonction pour inverser la sélection du "Select All"
  toggleSelectAll() {
    if (this.selectAllChecked) {
      this.selectAll(); // Si "Select All" est activé, on sélectionne tous les utilisateurs
    } else {
      this.filteredUsers.forEach(user => {
        user.selected = false; // Désélectionner tous les utilisateurs
      });
      this.selectedEmployees = []; // Vider la liste des sélectionnés
    }
  }
}
