import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaiementenVracPageRoutingModule } from './paiementen-vrac-routing.module';

import { PaiementenVracPage } from './paiementen-vrac.page';
import { EditableTableComponent } from 'src/app/components/editable-table/editable-table.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTableModule,
    PaiementenVracPageRoutingModule,
  ],
  declarations: [PaiementenVracPage, EditableTableComponent]
})
export class PaiementenVracPageModule {}
