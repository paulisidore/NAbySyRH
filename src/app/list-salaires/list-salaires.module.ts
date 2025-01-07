import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListSalairesPageRoutingModule } from './list-salaires-routing.module';

import { ListSalairesPage } from './list-salaires.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng2OrderModule } from 'ng2-order-pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListSalairesPageRoutingModule,
     IonicSelectableModule,
        Ng2SearchPipeModule,
        Ng2OrderModule,
        ReactiveFormsModule
  ],
  declarations: [ListSalairesPage]
})
export class ListSalairesPageModule {}
