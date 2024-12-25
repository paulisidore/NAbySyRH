import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaiementSalairePageRoutingModule } from './paiement-salaire-routing.module';

import { PaiementSalairePage } from './paiement-salaire.page';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaiementSalairePageRoutingModule,
    ReactiveFormsModule,
    IonicSelectableModule,
    Ng2SearchPipeModule,
    Ng2OrderModule,
  ],
  declarations: [PaiementSalairePage],
})
export class PaiementSalairePageModule {}
