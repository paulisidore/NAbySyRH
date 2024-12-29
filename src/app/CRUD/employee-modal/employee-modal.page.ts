import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-employee-modal',
  templateUrl: './employee-modal.page.html',
  styleUrls: ['./employee-modal.page.scss'],
})
export class EmployeeModalPage implements OnInit {
  users = []; // Liste complète des employés
  filteredUsers = []; // Liste filtrée des employés
  searchText = ''; // Texte de recherche
  selectedEmployees = []; // Liste des employés sélectionnés

  constructor(
    private modalController: ModalController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Appeler loadEmploye() pour récupérer les employés lors de l'initialisation
    this.loadEmploye();
  }
  readAPI(url: string) {
    return this.http.get(url);
  }
  // Charger la liste des employés (méthode à appeler)
  loadEmploye() {
    const token = localStorage.getItem('nabysy_token');
    if (!token) {
      console.error('Token not found');
      return;
    }

    // Requête API pour récupérer la liste des employés
    this.readAPI(
      environment.endPoint +
        'employe_action.php?Action=GET_EMPLOYE&Token=' +
        token
    ).subscribe((listes: any) => {
      this.users = listes; // Liste des employés
      this.filteredUsers = [...this.users]; // Initialisation de la liste filtrée

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
}
