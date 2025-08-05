import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-editable-table',
  templateUrl: './editable-table.component.html',
  styleUrls: ['./editable-table.component.scss'],

})
export class EditableTableComponent {
  form: FormGroup;
  dataSource = new MatTableDataSource<FormGroup>([]);
  @ViewChild(MatTable) table: MatTable<any>;

  @Output() validerTableau: EventEmitter<any[]> = new EventEmitter();

  isLoading = false;
  loadingProgress=0;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      rows: this.fb.array([])
    });

    this.addRow(); // ajouter une ligne par défaut
  }

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  addRow(maLigne: XEnvoiePaieInfo = null) {
    let ligne = {
      nom: [''],
      indicatif: ['221'],
      tel: [''],
      montant: [''],
      motif: ['']
    } ;

    if(maLigne !== null){
      ligne  = {
        nom: [maLigne.nom],
        indicatif: [''+maLigne.indicatif],
        tel: [maLigne.tel],
        montant: [''+maLigne.montant],
        motif: [maLigne.motif]
      } ;
      //ligne = maLigne ;
    }

    const row = this.fb.group(ligne);

    this.rows.push(row);
    this.dataSource.data = this.rows.controls as FormGroup[]; // 🔁 maj dataSource
    this.table?.renderRows(); // 🔁 force le rafraîchissement
  }

  removeRow(index: number) {
    this.rows.removeAt(index);
    this.table?.renderRows(); // 🔁 force le rafraîchissement
  }

  onSubmit() {
    console.log(this.form.value);
    const liste: any[] = [];
    const rows = this.form.value.rows ;
    rows.forEach(line => {
      liste.push(line);
    });
    console.log('Liste: ', liste);
    this.validerTableau.emit(liste);
  }

  onLastFieldBlur(index: number): void {
    // Si c’est la dernière ligne, on ajoute une nouvelle
    if (index === this.rows.length - 1) {
      this.addRow();
       // attendre que la ligne soit rendue
      setTimeout(() => {
        const nIndex =this.rows.length -1 ;
        const selId: string ='name-input-' + nIndex ;
        const nextInput: HTMLElement | null = document.getElementById(selId);
        console.log('Envoie du focus vers ', nextInput);
        nextInput?.focus();
      }, 0);
    }
  }

  importFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {return;}

    const file = input.files[0];
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'csv') {
      this.importCSV(file);
    } else if (extension === 'xlsx' || extension === 'xls') {
      this.importExcel(file);
    } else {
      alert('Format de fichier non pris en charge.');
    }
  }

  importCSV(file: File) {
    //console.log('Import de fichier CSV ', file);
    const reader = new FileReader();
    //Entente: Nom; Telephone; Montant; Motif
    reader.onload = () => {
      const text = reader.result as string;

      const lines = text.split(/\r?\n/);
      const headers = lines[0].split(';');

      this.loadingProgress = lines.length ;
      this.isLoading=true;
      this.rows.clear();

      for (let i = 1; i < lines.length; i++) {
        const index=i-1;
        const row = lines[index].split(';');
        if (row.length < 3) {continue;}
        let vmotif ='';

        if (row.length >= 4) {
          vmotif = row[3];
        }

        if (row[2].trim() !=='' && Number(row[1]) !== 0 && Number(row[2]) >0 ){
          const info: XEnvoiePaieInfo = {
            nom: row[0],
            indicatif: 221,
            tel: row[1],
            montant: Number(row[2]),
            motif: vmotif.trim(),
          };
          //const [nom, indicatif, tel, montant, motif] = [ row[0], '221', row[1], row[2], vmotif  ];
          this.addRow(info);
        }
      }
      this.isLoading=false;
    };

    reader.readAsText(file);
  }

  importExcel(file: File) {
    //console.log('Import de fichier Excel ', file);
    const reader = new FileReader();

    reader.onload = () => {
      const data = new Uint8Array(reader.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const lignes: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      console.log('Ligne Excel' , lignes);

      this.loadingProgress = lignes.length ;
      this.isLoading=true;
      this.rows.clear();
      // Skip header row
      for (let i = 1; i <= lignes.length; i++) {
         const index=i-1;
        const row = lignes[index];
        console.log('Ligne Excel: ', row) ;
        if (row.length < 3) {continue;}
        let vmotif ='';

        if (row.length >= 4) {
          vmotif = row[3];
        }
        if (row[2] !=='' && Number(row[1]) !== 0 && Number(row[2]) >0 ){
          const info: XEnvoiePaieInfo = {
            nom: row[0],
            indicatif: 221,
            tel: row[1],
            montant: Number(row[2]),
            motif: vmotif.trim(),
          };
          //const [nom, indicatif, tel, montant, motif] = [ row[0], '221', row[1], row[2], vmotif  ];
          this.addRow(info) ;
        }
      }
      this.isLoading=false;
    };

    reader.readAsArrayBuffer(file);
  }

  prepareRowToAdd(nomdest: string, indicPays: any='221', telephone: string='',mt: string = '0', motifenvoie: any =''){
    const [nom, indicatif, tel, montant, motif] = [nomdest, indicPays, telephone, mt, motifenvoie  ];
    const info: XEnvoiePaieInfo = {
      nom: nom.trim(),
      indicatif: indicatif.trim(),
      tel: tel.trim(),
      montant: Number(montant),
      motif: motif.trim(),
    };
    return info;
  }
}

export class XEnvoiePaieInfo {
  //[nom, indicatif, tel, montant, motif]
  nom: string ;
  indicatif:  221;
  tel: any;
  montant = 0;
  motif = '';
}
