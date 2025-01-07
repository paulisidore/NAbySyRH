import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListSalairesPage } from './list-salaires.page';

const routes: Routes = [
  {
    path: '',
    component: ListSalairesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListSalairesPageRoutingModule {}
