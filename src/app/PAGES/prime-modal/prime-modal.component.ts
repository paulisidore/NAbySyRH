/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-prime-modal',
  templateUrl: './prime-modal.component.html',
  styleUrls: ['./prime-modal.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PrimeModalComponent implements OnInit {
  @Input() listeEmployes: any[] = []; // Liste complète des employés
  @Input() employesPreselectionnes: any[] = []; // Employés déjà sélectionnés (optionnel)

  // Données du formulaire
  nbPoint: number = null;
  motif: string = '';
  commentaire: string = '';
  montantPrime: number = null;
  employesSelectionnes: any[] = [];
  
  // UI States
  selectAll: boolean = false;
  searchTerm: string = '';
  isSubmitting: boolean = false;

  // Validation
  nbPointError: string = '';
  motifError: string = '';
  montantPrimeError: string = '';

  constructor(
    private modalController: ModalController,
    private http: HttpClient,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Présélectionner les employés si fournis
    if (this.employesPreselectionnes && this.employesPreselectionnes.length > 0) {
      this.employesSelectionnes = [...this.employesPreselectionnes];
      this.updateSelectAllState();
    }
  }

  /**
   * Ferme le modal avec confirmation si des données ont été saisies
   */
  async dismiss(data?: any) {
    // Vérifier si des données ont été saisies
    const hasData = this.nbPoint || this.motif || this.commentaire || 
                     this.montantPrime || this.employesSelectionnes.length > 0;
    
    if (hasData && !data) {
      // Demander confirmation avant de fermer
      const result = await Swal.fire({
        title: 'Annuler la saisie ?',
        text: 'Les données saisies seront perdues',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, annuler',
        cancelButtonText: 'Non, continuer',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        customClass: {
          container: 'swal-ionic-container',
          popup: 'swal-ionic-popup',
          title: 'swal-ionic-title',
          htmlContainer: 'swal-ionic-html',
          confirmButton: 'swal-ionic-confirm',
          cancelButton: 'swal-ionic-cancel'
        },
        heightAuto: false,
        backdrop: true,
        allowOutsideClick: false
      });

      if (result.isConfirmed) {
        await this.modalController.dismiss(data);
      }
    } else {
      await this.modalController.dismiss(data);
    }
  }

  /**
   * Gère la sélection/désélection de tous les employés
   */
  onSelectAllChange(event: any) {
    this.selectAll = event.detail.checked;
    
    if (this.selectAll) {
      // Sélectionner tous les employés
      this.employesSelectionnes = [...this.listeEmployes];
    } else {
      // Désélectionner tous
      this.employesSelectionnes = [];
    }
    
    this.cdr.detectChanges();
  }

  /**
   * Gère la sélection individuelle d'un employé
   */
  onEmployeSelect(employe: any, event: any) {
    if (event.detail.checked) {
      // Ajouter à la sélection
      if (!this.employesSelectionnes.find(e => e.IDEMPLOYE === employe.IDEMPLOYE)) {
        this.employesSelectionnes.push(employe);
      }
    } else {
      // Retirer de la sélection
      this.employesSelectionnes = this.employesSelectionnes.filter(
        e => e.IDEMPLOYE !== employe.IDEMPLOYE
      );
    }
    
    this.updateSelectAllState();
  }

  /**
   * Vérifie si un employé est sélectionné
   */
  isEmployeSelected(employe: any): boolean {
    return this.employesSelectionnes.some(e => e.IDEMPLOYE === employe.IDEMPLOYE);
  }

  /**
   * Met à jour l'état du checkbox "Tout sélectionner"
   */
  updateSelectAllState() {
    this.selectAll = this.listeEmployes.length > 0 && 
                     this.employesSelectionnes.length === this.listeEmployes.length;
  }

  /**
   * Filtre les employés selon le terme de recherche
   */
  get employesFiltres() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      return this.listeEmployes;
    }
    
    const term = this.searchTerm.toLowerCase();
    return this.listeEmployes.filter(emp => {
      const nom = emp.EMPLOYE?.NOM?.toLowerCase() || '';
      const prenom = emp.EMPLOYE?.PRENOM?.toLowerCase() || '';
      const id = emp.IDEMPLOYE?.toString() || '';
      const tel = emp.EMPLOYE?.TEL?.toString() || '';
      
      return nom.includes(term) || prenom.includes(term) || id.includes(term) || tel.includes(term);
    });
  }

  /**
   * Valide le formulaire
   */
  validateForm(): boolean {
    let isValid = true;
    this.nbPointError = '';
    this.motifError = '';
    this.montantPrimeError = '';

    // Validation du nombre de points
    if (!this.nbPoint || this.nbPoint <= 0) {
      this.nbPointError = 'Le nombre de points doit être supérieur à 0';
      isValid = false;
    }

    // Validation du motif
    if (!this.motif || this.motif.trim() === '') {
      this.motifError = 'Le motif est obligatoire';
      isValid = false;
    } else if (this.motif.trim().length < 3) {
      this.motifError = 'Le motif doit contenir au moins 3 caractères';
      isValid = false;
    }

    // Validation du montant (optionnel mais doit être positif si renseigné)
    if (this.montantPrime !== null && this.montantPrime < 0) {
      this.montantPrimeError = 'Le montant doit être positif ou zéro';
      isValid = false;
    }

    // Validation de la sélection d'employés
    if (this.employesSelectionnes.length === 0) {
      Swal.fire({
        title: 'Aucun employé sélectionné',
        text: 'Veuillez sélectionner au moins un employé',
        icon: 'warning',
        confirmButtonText: 'OK',
        customClass: {
          container: 'swal-ionic-container',
          popup: 'swal-ionic-popup',
          title: 'swal-ionic-title',
          confirmButton: 'swal-ionic-confirm'
        },
        heightAuto: false,
        backdrop: true
      });
      isValid = false;
    }

    return isValid;
  }

  /**
   * Soumet le formulaire pour ajouter la prime
   */
  async onSubmit() {
    // Valider le formulaire
    if (!this.validateForm()) {
      return;
    }

    // Confirmation avant soumission
    const result = await Swal.fire({
      title: 'Confirmer l\'ajout de prime',
      html: `
        <div style="text-align: left; padding: 10px;">
          <p><strong>Nombre de points :</strong> ${this.nbPoint}</p>
          <p><strong>Motif :</strong> ${this.motif}</p>
          ${this.commentaire ? `<p><strong>Commentaire :</strong> ${this.commentaire}</p>` : ''}
          ${this.montantPrime ? `<p><strong>Montant :</strong> ${this.montantPrime.toLocaleString('fr-FR')} XOF</p>` : ''}
          <p><strong>Nombre d'employés :</strong> ${this.employesSelectionnes.length}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      customClass: {
        container: 'swal-ionic-container',
        popup: 'swal-ionic-popup',
        title: 'swal-ionic-title',
        htmlContainer: 'swal-ionic-html',
        confirmButton: 'swal-ionic-confirm',
        cancelButton: 'swal-ionic-cancel'
      },
      heightAuto: false,
      backdrop: true,
      allowOutsideClick: false
    });

    if (!result.isConfirmed) {
      return;
    }

    // Désactiver le bouton pendant le traitement
    this.isSubmitting = true;

    try {
      // Traiter chaque employé individuellement
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (const employe of this.employesSelectionnes) {
        try {
          const response = await this.addPrimeForEmployee(employe.IDEMPLOYE);
          
          if (response && response.OK !== '0') {
            successCount++;
          } else {
            errorCount++;
            errors.push(`${employe.EMPLOYE?.PRENOM} ${employe.EMPLOYE?.NOM}: ${response.TxErreur || 'Erreur inconnue'}`);
          }
        } catch (error) {
          errorCount++;
          errors.push(`${employe.EMPLOYE?.PRENOM} ${employe.EMPLOYE?.NOM}: ${error.message || 'Erreur réseau'}`);
        }
      }

      // Afficher le résultat
      if (errorCount === 0) {
        // Tous les ajouts ont réussi
        await Swal.fire({
          title: 'Primes ajoutées !',
          html: `
            <div style="text-align: left; padding: 10px;">
              <p>✓ ${successCount} prime(s) ajoutée(s) avec succès</p>
            </div>
          `,
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 3000,
          customClass: {
            container: 'swal-ionic-container',
            popup: 'swal-ionic-popup',
            title: 'swal-ionic-title',
            htmlContainer: 'swal-ionic-html',
            confirmButton: 'swal-ionic-confirm'
          },
          heightAuto: false,
          backdrop: true
        });

        // Fermer le modal et retourner les données
        await this.modalController.dismiss({
          success: true,
          successCount,
          errorCount,
          nbPoint: this.nbPoint,
          motif: this.motif,
          montantPrime: this.montantPrime,
          employesSelectionnes: this.employesSelectionnes
        });
      } else {
        // Certains ajouts ont échoué
        await Swal.fire({
          title: 'Ajout terminé avec erreurs',
          html: `
            <div style="text-align: left; padding: 10px;">
              <p><strong>✓ ${successCount} prime(s) ajoutée(s)</strong></p>
              <p style="color: red;"><strong>✗ ${errorCount} erreur(s)</strong></p>
              ${errors.length > 0 ? `<hr><p style="font-size: 12px; max-height: 150px; overflow-y: auto;">${errors.join('<br>')}</p>` : ''}
            </div>
          `,
          icon: 'warning',
          confirmButtonText: 'OK',
          customClass: {
            container: 'swal-ionic-container',
            popup: 'swal-ionic-popup',
            title: 'swal-ionic-title',
            htmlContainer: 'swal-ionic-html',
            confirmButton: 'swal-ionic-confirm'
          },
          heightAuto: false,
          backdrop: true
        });

        // Fermer quand même si au moins un ajout a réussi
        if (successCount > 0) {
          await this.modalController.dismiss({
            success: true,
            successCount,
            errorCount,
            errors
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout des primes:', error);
      
      await Swal.fire({
        title: 'Erreur',
        text: error.message || 'Une erreur est survenue lors de l\'ajout des primes',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          container: 'swal-ionic-container',
          popup: 'swal-ionic-popup',
          title: 'swal-ionic-title',
          confirmButton: 'swal-ionic-confirm'
        },
        heightAuto: false,
        backdrop: true
      });
    } finally {
      this.isSubmitting = false;
    }
  }

  /**
   * Ajoute une prime pour un employé spécifique
   */
  private addPrimeForEmployee(idEmploye: number | string): Promise<any> {
    return new Promise((resolve, reject) => {
      let txMontantPrime = '';
      if (this.montantPrime && this.montantPrime > 0) {
        txMontantPrime = '&MONTANTPRIME=' + this.montantPrime;
      }

      const apiUrl = environment.endPoint + 
                     'performance_action.php?Action=ADD_PERFORMANCE' +
                     '&NBPOINT=' + this.nbPoint +
                     '&MOTIF=' + encodeURIComponent(this.motif) +
                     '&commentaire=' + encodeURIComponent(this.commentaire || '') +
                     '&IDEMPLOYE=' + idEmploye +
                     txMontantPrime +
                     '&Token=' + environment.tokenUser;

      console.log('API Prime:', apiUrl);

      this.http.get(apiUrl).subscribe(
        {
          next: (response) => {
            console.log('Réponse API Prime:', response);
            resolve(response);
          },
          error: (error) => {
            console.error('Erreur API Prime:', error);
            reject(error);
          }
        }
      );
    });
  }

  /**
   * Réinitialise le formulaire
   */
  resetForm() {
    this.nbPoint = null;
    this.motif = '';
    this.commentaire = '';
    this.montantPrime = null;
    this.employesSelectionnes = [];
    this.selectAll = false;
    this.searchTerm = '';
    this.nbPointError = '';
    this.motifError = '';
    this.montantPrimeError = '';
  }
}
