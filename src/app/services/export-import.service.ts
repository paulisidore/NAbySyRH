/* eslint-disable eol-last */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable quote-props */
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class ExportImportService {

  constructor() { }

  /**
   * Exporte les données au format Excel
   */
  exportToExcel(data: any[], fileName: string = 'salaires_export'): void {
    try {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const workbook: XLSX.WorkBook = {
        Sheets: { 'Salaires': worksheet },
        SheetNames: ['Salaires']
      };
      // eslint-disable-next-line no-trailing-spaces
      
      // Ajuster la largeur des colonnes
      const maxWidth = data.reduce((w, r) => Math.max(w, r.PRENOM?.length || 10), 10);
      worksheet['!cols'] = [
        { wch: 10 }, // ID
        { wch: maxWidth + 5 }, // PRENOM
        { wch: maxWidth + 5 }, // NOM
        { wch: 15 }, // SALAIRE_BRUT
        { wch: 15 }, // SALAIRE_NET
        { wch: 15 }, // TOTAL_RETENU
        { wch: 30 }, // NOTE
        { wch: 15 }  // STATUT
      ];

      XLSX.writeFile(workbook, `${fileName}_${this.getDateString()}.xlsx`);
    } catch (error) {
      console.error('Erreur lors de l\'export Excel:', error);
      throw new Error('Impossible d\'exporter en Excel');
    }
  }

  /**
   * Exporte les données au format CSV
   */
  exportToCSV(data: any[], fileName: string = 'salaires_export'): void {
    try {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${fileName}_${this.getDateString()}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erreur lors de l\'export CSV:', error);
      throw new Error('Impossible d\'exporter en CSV');
    }
  }

  /**
   * Exporte les données au format PDF
   */
  exportToPDF(data: any[], fileName: string = 'salaires_export', periode: string = ''): void {
    try {
      const doc = new jsPDF('l', 'mm', 'a4'); // Format paysage
      
      // En-tête du document
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text('Liste des Paiements de Salaires', 14, 15);
      
      if (periode) {
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Période: ${periode}`, 14, 22);
      }
      
      // Date de génération
      doc.setFontSize(10);
      doc.text(`Généré le: ${new Date().toLocaleString('fr-FR')}`, 14, 28);
      
      // Préparer les données pour le tableau
      const tableData = data.map(item => [
        item.IDEMPLOYE || '',
        item.PRENOM || '',
        item.NOM || '',
        this.formatCurrency(item.SALAIRE_BRUT),
        this.formatCurrency(item.SALAIRE_NET),
        this.formatCurrency(item.TOTAL_RETENU),
        item.NOTE || '',
        item.STATUT || 'En attente'
      ]);
      
      // Calculer les totaux
      const totalNet = data.reduce((sum, item) => sum + (parseFloat(item.SALAIRE_NET) || 0), 0);
      const totalRetenu = data.reduce((sum, item) => sum + (parseFloat(item.TOTAL_RETENU) || 0), 0);
      
      // Générer le tableau
      autoTable(doc, {
        startY: 35,
        head: [['ID', 'Prénom', 'Nom', 'Salaire Brut', 'Salaire Net', 'Total Retenu', 'Note', 'Statut']],
        body: tableData,
        foot: [['', '', 'TOTAUX:', '', this.formatCurrency(totalNet), this.formatCurrency(totalRetenu), '', '']],
        theme: 'grid',
        headStyles: {
          fillColor: [63, 81, 181],
          textColor: 255,
          fontSize: 10,
          fontStyle: 'bold',
          halign: 'center'
        },
        footStyles: {
          fillColor: [240, 240, 240],
          textColor: 40,
          fontSize: 10,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 9
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 15 },
          1: { cellWidth: 30 },
          2: { cellWidth: 30 },
          3: { halign: 'right', cellWidth: 25 },
          4: { halign: 'right', cellWidth: 25 },
          5: { halign: 'right', cellWidth: 25 },
          6: { cellWidth: 50 },
          7: { halign: 'center', cellWidth: 25 }
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { top: 35 }
      });
      
      // Ajouter le nombre total d'employés
      const finalY = (doc as any).lastAutoTable.finalY || 35;
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);
      doc.text(`Nombre total d'employés: ${data.length}`, 14, finalY + 10);
      
      // Sauvegarder le PDF
      doc.save(`${fileName}_${this.getDateString()}.pdf`);
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      throw new Error('Impossible d\'exporter en PDF');
    }
  }

  /**
   * Importe des données depuis un fichier Excel ou CSV
   */
  async importFromFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        
        reader.onload = (e: any) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Lire la première feuille
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // Convertir en JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
            
            // Valider et transformer les données
            const validatedData = this.validateImportData(jsonData);
            
            resolve(validatedData);
          } catch (error) {
            console.error('Erreur lors du traitement du fichier:', error);
            reject(new Error('Format de fichier invalide'));
          }
        };
        
        reader.onerror = () => {
          reject(new Error('Erreur lors de la lecture du fichier'));
        };
        
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error('Erreur lors de l\'import:', error);
        reject(error);
      }
    });
  }

  /**
   * Valide et normalise les données importées
   */
  private validateImportData(data: any[]): any[] {
    const validatedData: any[] = [];
    const errors: string[] = [];
    
    data.forEach((row, index) => {
      const lineNumber = index + 2; // +2 car ligne 1 = en-têtes et index commence à 0
      
      // Vérifier que l'ID existe
      const idEmploye = row['IDEMPLOYE'] || row['ID'] || row['Id'];
      if (!idEmploye) {
        errors.push(`Ligne ${lineNumber}: ID employé manquant`);
        return;
      }
      
      // Construire l'objet validé
      const validatedRow: any = {
        IDEMPLOYE: parseInt(idEmploye, 10),
        SALAIRE_NET: null,
        NOTE: null
      };
      
      // Valider et convertir le salaire net si présent
      const salaireNet = row['SALAIRE_NET'] || row['SALAIRE NET'] || row['Salaire Net'];
      if (salaireNet !== undefined && salaireNet !== null && salaireNet !== '') {
        const parsedSalaire = this.parseNumber(salaireNet);
        if (parsedSalaire !== null && parsedSalaire >= 0) {
          validatedRow.SALAIRE_NET = parsedSalaire;
        } else {
          errors.push(`Ligne ${lineNumber}: Salaire net invalide (${salaireNet})`);
        }
      }
      
      // Récupérer la note si présente
      const note = row['NOTE'] || row['Note'] || row['NOTE_PAIEMENT'] || row['Note de Paiement'];
      if (note !== undefined && note !== null && note !== '') {
        validatedRow.NOTE = String(note).trim();
      }
      
      validatedData.push(validatedRow);
    });
    
    if (errors.length > 0) {
      console.warn('Avertissements lors de l\'import:', errors);
    }
    
    return validatedData;
  }

  /**
   * Parse un nombre depuis différents formats
   */
  private parseNumber(value: any): number | null {
    if (typeof value === 'number') {
      return value;
    }
    
    if (typeof value === 'string') {
      // Nettoyer la chaîne (enlever espaces, symboles de devise, etc.)
      const cleaned = value.replace(/[^\d,.-]/g, '').replace(',', '.');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? null : parsed;
    }
    
    return null;
  }

  /**
   * Formate un nombre en devise
   */
  private formatCurrency(value: any): string {
    const num = parseFloat(value) || 0;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  }

  /**
   * Retourne la date actuelle formatée pour les noms de fichiers
   */
  private getDateString(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `${year}${month}${day}_${hours}${minutes}`;
  }

  /**
   * Prépare les données pour l'export (transforme le format de listeEmploye)
   */
  prepareExportData(employees: any[]): any[] {
    return employees.map(emp => ({
      IDEMPLOYE: emp.IDEMPLOYE,
      PRENOM: emp.EMPLOYE?.PRENOM || '',
      NOM: emp.EMPLOYE?.NOM || '',
      SALAIRE_BRUT: emp.SALAIRE?.SALAIRE_BRUT || 0,
      SALAIRE_NET: emp.SALAIRE?.SALAIRE_NET || 0,
      TOTAL_RETENU: emp.SALAIRE?.TOTAL_RETENU || 0,
      NOTE: emp.noteModePaiement || '',
      STATUT: emp.status || 'En attente'
    }));
  }
}