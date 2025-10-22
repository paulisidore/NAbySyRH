/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-demande-avance-modal',
  templateUrl: './demande-avance-modal.component.html',
  styleUrls: ['./demande-avance-modal.component.scss'],
})
export class DemandeAvanceModalComponent  implements OnInit {
  @Input() modeEdition = false;
  @Input() demandeId = '';
  @Input() motifInitial = '';
  @Input() montantInitial = 0;

  demandeForm: FormGroup;
  constructor( private modalController: ModalController,
    private formBuilder: FormBuilder) {
      this.demandeForm = this.formBuilder.group({
        motif: ['', [Validators.required, Validators.minLength(3)]],
        montant: ['', [Validators.required, Validators.min(1)]]
      });
    }

  ngOnInit() {
    if (this.modeEdition) {
      this.demandeForm.patchValue({
        motif: this.motifInitial,
        montant: this.montantInitial
      });
    }
  }

  get titreModal(): string {
    return this.modeEdition ? 'Modifier la Demande d\'Avance' : 'Demande d\'Avance';
  }

  get texteBouton(): string {
    return this.modeEdition ? 'Modifier' : 'Valider';
  }

   annuler() {
    this.modalController.dismiss(null, 'cancel');
  }

  valider() {
    if (this.demandeForm.valid) {
      const data = {
        motif: this.demandeForm.value.motif,
        montant: parseFloat(this.demandeForm.value.montant)
      };
      this.modalController.dismiss(data, 'confirm');
    }
  }

}
