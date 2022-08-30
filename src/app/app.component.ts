import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  userInfo: any ;
  userName: string ;
  nomEmploye: string;
  prenomEmploye: string;
  photoUrl: string;
  employeFonction: string;
  constructor(private router: Router,private menu: MenuController) {
    this.userName=environment.userName ;
    if (environment.employeConnecte){
      this.userInfo=environment.employeConnecte ;
      this.nomEmploye=environment.employeConnecte.Nom ;
      this.prenomEmploye=environment.employeConnecte.Prenom ;
      this.photoUrl=environment.employeConnecte.PHOTO_URL ;
      this.employeFonction=environment.employeConnecte.Fonction ;
    }else{
      this.nomEmploye='' ;
      this.prenomEmploye='' ;
      this.photoUrl='' ;
      this.employeFonction='';
    }
    //console.log(this);
  }

  loadUserInfos(){
    this.userName=environment.userName ;
    if (environment.employeConnecte){
      this.userInfo=environment.employeConnecte ;
      this.nomEmploye=environment.employeConnecte.Nom ;
      this.prenomEmploye=environment.employeConnecte.Prenom ;
      this.photoUrl=environment.employeConnecte.PHOTO_URL ;
      this.employeFonction=environment.employeConnecte.Fonction ;
    }else{
      this.nomEmploye='' ;
      this.prenomEmploye='' ;
      this.photoUrl='' ;
      this.employeFonction='';
    }
    //console.log(this.userInfo);
  }

  menuOpened() {
    //code to execute when menu ha opened
    if (environment.employeConnecte){
      this.nomEmploye=environment.employeConnecte.Nom ;
      this.prenomEmploye=environment.employeConnecte.Prenom ;
      this.photoUrl=environment.employeConnecte.PHOTO_URL ;
      this.employeFonction=environment.employeConnecte.Fonction ;
      this.userInfo=environment.employeConnecte ;
    }
    //console.log(this.userInfo);
  }

  closeMenu(){
    if (environment.employeConnecte){
      this.nomEmploye=environment.employeConnecte.Nom ;
      this.prenomEmploye=environment.employeConnecte.Prenom ;
      this.photoUrl=environment.employeConnecte.PHOTO_URL ;
      this.employeFonction=environment.employeConnecte.Fonction ;
      this.userInfo=environment.employeConnecte ;
      //console.log(this.userInfo);
    }
    this.menu.close('menu-content');
  }

}
