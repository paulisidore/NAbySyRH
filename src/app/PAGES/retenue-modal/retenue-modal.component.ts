/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ModalController, ToastController, IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PaiementService } from 'src/app/services/paiement.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-retenue-modal',
  templateUrl: './retenue-modal.component.html',
  styleUrls: ['./retenue-modal.component.scss'],
  imports: [IonicModule, FormsModule, CurrencyPipe, CommonModule],
})
export class RetenueModalComponent implements OnInit {
  @Input() listeEmployes: any[] = []; // Liste complète des employés
  @Input() employesPreselectionnes: any[] = []; // Employés déjà sélectionnés (optionnel)

  // Données du formulaire
  montant: number = null;
  motif = '';
  employesSelectionnes: any[] = [];

  // UI States
  selectAll: boolean = false;
  searchTerm: string = '';
  isSubmitting: boolean = false;

  // Validation
  montantError: string = '';
  motifError: string = '';

  constructor(
    private modalController: ModalController,
    private paiementService: PaiementService,
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
    const hasData = this.montant || this.motif || this.employesSelectionnes.length > 0;
    
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
      const tel: string = emp.EMPLOYE?.TEL?.toString() || '';      
      return nom.includes(term) || prenom.includes(term) || id.includes(term) || tel.includes(term);
    });
  }

  /**
   * Valide le formulaire
   */
  validateForm(): boolean {
    let isValid = true;
    this.montantError = '';
    this.motifError = '';

    // Validation du montant
    if (!this.montant || this.montant <= 0) {
      this.montantError = 'Le montant doit être supérieur à 0';
      isValid = false;
    }

    // Validation du motif
    if (!this.motif || this.motif.trim() === '') {
      this.motifError = 'Le motif est obligatoire';
      isValid = false;
    } else if (this.motif.trim().length < 5) {
      this.motifError = 'Le motif doit contenir au moins 5 caractères';
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
   * Soumet le formulaire pour ajouter la retenue
   */
  async onSubmit() {
    // Valider le formulaire
    if (!this.validateForm()) {
      return;
    }

    // Confirmation avant soumission
    const result = await Swal.fire({
      title: 'Confirmer l\'ajout de retenue',
      html: `
        <div style="text-align: left; padding: 10px;">
          <p><strong>Montant :</strong> ${this.montant.toLocaleString('fr-FR')} XOF</p>
          <p><strong>Motif :</strong> ${this.motif}</p>
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
      let response;
      
      if (this.employesSelectionnes.length === 1) {
        // Un seul employé
        const idEmploye = this.employesSelectionnes[0].IDEMPLOYE;
        response = await this.paiementService.addRetenuSalaireForOne(
          idEmploye,
          this.montant,
          this.motif
        );
      } else {
        // Plusieurs employés
        const listeIds = this.employesSelectionnes.map(emp => emp.IDEMPLOYE);
        response = await this.paiementService.addRetenuSalaireMultiple(
          listeIds as any,
          this.montant,
          this.motif
        );
      }

      // Vérifier la réponse
      if (response.OK > 0) {
        // Succès
        await Swal.fire({
          title: 'Retenue ajoutée !',
          html: `
            <div style="text-align: left; padding: 10px;">
              <p>La retenue a été ajoutée avec succès pour ${this.employesSelectionnes.length} employé(s)</p>
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
          montant: this.montant,
          motif: this.motif,
          employesSelectionnes: this.employesSelectionnes
        });
      } else {
        // Erreur de l'API
        throw new Error(response.TxErreur || 'Erreur lors de l\'ajout de la retenue');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la retenue:', error);
      
      await Swal.fire({
        title: 'Erreur',
        text: error.message || 'Une erreur est survenue lors de l\'ajout de la retenue',
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
   * Réinitialise le formulaire
   */
  resetForm() {
    this.montant = null;
    this.motif = '';
    this.employesSelectionnes = [];
    this.selectAll = false;
    this.searchTerm = '';
    this.montantError = '';
    this.motifError = '';
  }
}
