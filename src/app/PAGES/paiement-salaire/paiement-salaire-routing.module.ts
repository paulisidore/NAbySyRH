import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaiementSalairePage } from './paiement-salaire.page';

const routes: Routes = [
  {
    path: '',
    component: PaiementSalairePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaiementSalairePageRoutingModule {}
