/* eslint-disable @typescript-eslint/naming-convention */
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, MenuController, ToastController } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { IonicSelectableModule } from 'ionic-selectable';
import { Printer, PrintOptions } from '@awesome-cordova-plugins/printer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { PDFGenerator} from '@ionic-native/pdf-generator/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
// import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';

import { registerLocaleData } from '@angular/common';
import * as fr from '@angular/common/locales/fr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InertDirective } from './services/inert.directive';
import { PaiementSalairePage } from './PAGES/paiement-salaire/paiement-salaire.page';

import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [AppComponent,  InertDirective,],
  imports: [BrowserModule,IonicModule.forRoot(),
    HttpClientModule, AppRoutingModule, IonicSelectableModule,FormsModule,ReactiveFormsModule],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR'},
    ToastController,
    MenuController,
    Printer,
    File,
    FileOpener,
    PhotoViewer,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy}, PDFGenerator],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(){
    registerLocaleData(fr.default);
  }
}
