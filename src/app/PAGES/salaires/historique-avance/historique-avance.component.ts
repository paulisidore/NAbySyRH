/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

import autoTable from 'jspdf-autotable';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { PaiementService } from 'src/app/services/paiement.service';
import { DemandeAvanceModalComponent } from '../demande-avance-modal/demande-avance-modal.component';
import { environment } from 'src/environments/environment';

interface DemandeAvance {
  ID: string;
  DateDemande: string;
  DateReponse: string;
  IdEmploye: string;
  Montant: string;
  Motif: string;
  Etat: string;
  MotifReponse: string;
  NOM: string;
  PRENOM: string;
}

@Component({
  selector: 'app-historique-avance',
  templateUrl: './historique-avance.component.html',
  styleUrls: ['./historique-avance.component.scss'],
})
export class HistoriqueAvanceComponent implements OnInit {
  demandes: DemandeAvance[] = [];
  demandesFiltrees: DemandeAvance[] = [];
  
  // Pagination
  itemsPerPage = 10;
  currentPage = 1;
  totalPages = 1;
  paginatedItems: DemandeAvance[] = [];
  
  // Filtres
  filtres = {
    recherche: '',
    etat: '',
    dateDebut: '',
    dateFin: ''
  };

  // Options de pagination
  paginationOptions = [5, 10, 20, 50];

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private modalController: ModalController,
    private paiementSvc: PaiementService
  ) {}

  ngOnInit() {
    this.chargerDemandes();
  }

  get statistiques() {
    const acceptees = this.demandes.filter(d => d.Etat === 'DEMANDE_ACCEPTE');
    const rejetees = this.demandes.filter(d => d.Etat === 'DEMANDE_REJETER');
    
    return {
      total: this.demandes.length,
      enAttente: this.demandes.filter(d => d.Etat === 'DEMANDE_EN_ATTENTE').length,
      acceptees: acceptees.length,
      rejetees: rejetees.length,
      montantTotal: this.demandes.reduce((sum, d) => sum + parseFloat(d.Montant || '0'), 0),
      montantAccepte: acceptees.reduce((sum, d) => sum + parseFloat(d.Montant || '0'), 0),
      montantRejete: rejetees.reduce((sum, d) => sum + parseFloat(d.Montant || '0'), 0)
    };
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

// Vérifier si l'utilisateur a les droits d'administration (niveau >= 4)
  get estAdministrateur(): boolean {
    return environment.userProfile && 
           environment.userProfile.NIVEAUACCES && 
           parseInt(environment.userProfile.NIVEAUACCES, 10) >= 4;
  }

  // Vérifier si l'utilisateur peut valider/rejeter une demande
  peutValiderOuRejeter(demande: DemandeAvance): boolean {
    return this.estAdministrateur && demande.Etat === 'DEMANDE_EN_ATTENTE';
  }


  async chargerDemandes() {
    try {
      const response = await this.paiementSvc.getHistoriqueDemande();

      if (response.OK) {
        this.demandes = response.Contenue;
        this.appliquerFiltres();
        await this.afficherToast(`${this.demandes.length} demande(s) chargée(s)`, 'success');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error);
      await this.afficherToast('Erreur lors du chargement', 'danger');
    }
  }

  async ajouterNouvelleDemande() {    
    const modal = await this.modalController.create({
      component: DemandeAvanceModalComponent,
      cssClass: 'demande-avance-modal'
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      await this.traiterNouvelleDemande(data.montant, data.motif);
    }
  }

  async traiterNouvelleDemande(montant: number, motif: string) {
    try {
      const response = await this.paiementSvc.envoieDemandeAvance(montant, motif);

      if (response.OK) {
        await this.afficherToast('Demande créée avec succès', 'success');
        await this.chargerDemandes();
      } else {
        await this.afficherToast('Erreur lors de la création', 'danger');
      }
    } catch (error) {
      await this.afficherToast('Erreur lors de l\'envoi', 'danger');
      console.error('Erreur:', error);
    }
  }

  async modifierDemande(demande: DemandeAvance) {
    if (demande.Etat !== 'DEMANDE_EN_ATTENTE') {
      await this.afficherToast('Seules les demandes en attente peuvent être modifiées', 'warning');
      return;
    }
    
    const modal = await this.modalController.create({
      component: DemandeAvanceModalComponent,
      cssClass: 'demande-avance-modal',
      componentProps: {
        modeEdition: true,
        demandeId: demande.ID,
        motifInitial: demande.Motif,
        montantInitial: parseFloat(demande.Montant)
      }
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      await this.traiterModificationDemande(demande.ID, data.montant, data.motif);
    }
  }

  async traiterModificationDemande(id: string, montant: number, motif: string) {
    try {
      const response = await this.paiementSvc.editDemandeAvance(id, montant, motif);
      
      if (response.OK) {
        await this.afficherToast('Demande modifiée avec succès', 'success');
        await this.chargerDemandes();
      } else {
        await this.afficherToast('Erreur: ' + response.TxErreur, 'danger');
      }
    } catch (error) {
      await this.afficherToast('Erreur lors de la modification', 'danger');
      console.error('Erreur:', error);
    }
  }

  async confirmerSuppression(demande: DemandeAvance) {
    if (demande.Etat !== 'DEMANDE_EN_ATTENTE') {
      await this.afficherToast('Seules les demandes en attente peuvent être supprimées', 'warning');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmer la suppression',
      message: `Êtes-vous sûr de vouloir supprimer cette demande de ${demande.Montant} FCFA pour "${demande.Motif}" ?`,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Supprimer',
          cssClass: 'danger',
          handler: () => {
            this.supprimerDemande(demande.ID);
          }
        }
      ]
    });

    await alert.present();
  }

  async supprimerDemande(id: string) {
    try {
      const response = await this.paiementSvc.deleteDemandeAvance(id);

      if (response.OK) {
        await this.afficherToast('Demande supprimée avec succès', 'success');
        await this.chargerDemandes();
      } else {
        await this.afficherToast('Erreur: ' + response.TxErreur, 'danger');
      }
    } catch (error) {
      await this.afficherToast('Erreur lors de la suppression', 'danger');
      console.error('Erreur:', error);
    }
  }

  async confirmerValidation(demande: DemandeAvance) {
    if (!this.peutValiderOuRejeter(demande)) {
      await this.afficherToast('Vous n\'avez pas les droits pour valider cette demande', 'warning');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Valider la demande',
      message: `Voulez-vous valider cette demande de ${demande.Montant} FCFA pour "${demande.Motif}" de ${demande.PRENOM} ${demande.NOM} ?`,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Valider',
          cssClass: 'success',
          handler: () => {
            this.validerDemande(demande.ID);
          }
        }
      ]
    });

    await alert.present();
  }

  async validerDemande(id: string) {
    try {
      // Remplacez par votre méthode API réelle
      const response = await this.paiementSvc.validDemandeAvance(id);

      if (response.OK) {
        await this.afficherToast('Demande validée avec succès', 'success');
        await this.chargerDemandes();
      } else {
        await this.afficherToast('Erreur: ' + response.TxErreur, 'danger');
      }
    } catch (error) {
      await this.afficherToast('Erreur lors de la validation', 'danger');
      console.error('Erreur:', error);
    }
  }

  async confirmerRejet(demande: DemandeAvance) {
    if (!this.peutValiderOuRejeter(demande)) {
      await this.afficherToast('Vous n\'avez pas les droits pour rejeter cette demande', 'warning');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Rejeter la demande',
      message: `Voulez-vous rejeter cette demande de ${demande.Montant} FCFA pour "${demande.Motif}" de ${demande.PRENOM} ${demande.NOM} ?`,
      inputs: [
        {
          name: 'motifRejet',
          type: 'textarea',
          placeholder: 'Motif du rejet (optionnel)',
          attributes: {
            rows: 3
          }
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Rejeter',
          cssClass: 'danger',
          handler: (data) => {
            this.rejeterDemande(demande.ID, data.motifRejet || '');
          }
        }
      ]
    });

    await alert.present();
  }

  async rejeterDemande(id: string, motifRejet: string) {
    try {
      // Remplacez par votre méthode API réelle
      const response = await this.paiementSvc.rejectDemandeAvance(id, motifRejet);

      if (response.OK) {
        await this.afficherToast('Demande rejetée avec succès', 'success');
        await this.chargerDemandes();
      } else {
        await this.afficherToast('Erreur: ' + response.TxErreur, 'danger');
      }
    } catch (error) {
      await this.afficherToast('Erreur lors du rejet', 'danger');
      console.error('Erreur:', error);
    }
  }

  peutModifierOuSupprimer(demande: DemandeAvance): boolean {
    return demande.Etat === 'DEMANDE_EN_ATTENTE';
  }

  async afficherToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    await toast.present();
  }

  appliquerFiltres() {
    this.demandesFiltrees = this.demandes.filter(demande => {
      const rechercheMatch = !this.filtres.recherche || 
        demande.Motif.toLowerCase().includes(this.filtres.recherche.toLowerCase()) ||
        demande.NOM.toLowerCase().includes(this.filtres.recherche.toLowerCase()) ||
        demande.PRENOM.toLowerCase().includes(this.filtres.recherche.toLowerCase()) ||
        demande.Montant.includes(this.filtres.recherche);

      const etatMatch = !this.filtres.etat || demande.Etat === this.filtres.etat;

      const dateDebutMatch = !this.filtres.dateDebut || 
        new Date(demande.DateDemande) >= new Date(this.filtres.dateDebut);

      const dateFinMatch = !this.filtres.dateFin || 
        new Date(demande.DateDemande) <= new Date(this.filtres.dateFin);

      return rechercheMatch && etatMatch && dateDebutMatch && dateFinMatch;
    });

    this.totalPages = Math.ceil(this.demandesFiltrees.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedItems();
  }

  updatePaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedItems = this.demandesFiltrees.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePaginatedItems();
  }

  onItemsPerPageChange() {
    this.totalPages = Math.ceil(this.demandesFiltrees.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedItems();
  }

  reinitialiserFiltres() {
    this.filtres = {
      recherche: '',
      etat: '',
      dateDebut: '',
      dateFin: ''
    };
    this.appliquerFiltres();
  }

  getEtatColor(etat: string): string {
    switch (etat) {
      case 'DEMANDE_ACCEPTE':
        return 'success';
      case 'DEMANDE_REJETER':
        return 'danger';
      case 'DEMANDE_EN_ATTENTE':
        return 'warning';
      default:
        return 'medium';
    }
  }

  getEtatLibelle(etat: string): string {
    switch (etat) {
      case 'DEMANDE_ACCEPTE':
        return 'Acceptée';
      case 'DEMANDE_REJETER':
        return 'Rejetée';
      case 'DEMANDE_EN_ATTENTE':
        return 'En attente';
      default:
        return etat;
    }
  }

  exporterPDF() {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Historique des Demandes d\'Avance', 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Date d'export: ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);

    const tableData = this.demandesFiltrees.map(d => [
      d.DateDemande,
      `${d.PRENOM} ${d.NOM}`,
      d.Motif,
      `${d.Montant} FCFA`,
      this.getEtatLibelle(d.Etat)
    ]);

    autoTable(doc, {
      head: [['Date', 'Employé', 'Motif', 'Montant', 'Statut']],
      body: tableData,
      startY: 35,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [255, 193, 7] }
    });

    doc.save(`historique-avances-${new Date().getTime()}.pdf`);
  }

  exporterCSV() {
    const headers = ['Date Demande', 'Employé', 'Motif', 'Montant', 'Statut'];
    const csvData = this.demandesFiltrees.map(d => [
      d.DateDemande,
      `${d.PRENOM} ${d.NOM}`,
      d.Motif,
      d.Montant,
      this.getEtatLibelle(d.Etat)
    ]);

    let csv = headers.join(';') + '\n';
    csvData.forEach(row => {
      csv += row.join(';') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `historique-avances-${new Date().getTime()}.csv`;
    link.click();
  }

  exporterExcel() {
    const worksheet = XLSX.utils.json_to_sheet(
      this.demandesFiltrees.map(d => ({
        'Date Demande': d.DateDemande,
        'Date Réponse': d.DateReponse,
        'Employé': `${d.PRENOM} ${d.NOM}`,
        'Motif': d.Motif,
        'Montant': d.Montant,
        'Statut': this.getEtatLibelle(d.Etat),
        'Motif Réponse': d.MotifReponse
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Demandes Avance');
    XLSX.writeFile(workbook, `historique-avances-${new Date().getTime()}.xlsx`);
  }
}
