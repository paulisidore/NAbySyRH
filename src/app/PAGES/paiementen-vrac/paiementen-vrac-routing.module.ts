import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaiementenVracPage } from './paiementen-vrac.page';

const routes: Routes = [
  {
    path: '',
    component: PaiementenVracPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaiementenVracPageRoutingModule {}
