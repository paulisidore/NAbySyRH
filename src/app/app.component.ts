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
  userInfo: any ; fonction: '';
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

  closeMenu(logOutSession: boolean = false){
    if (environment.employeConnecte){
      if (logOutSession){
        console.log('Fermeture de session.');
        this.nomEmploye=environment.employeConnecte.Nom ;
        this.prenomEmploye=environment.employeConnecte.Prenom ;
        this.photoUrl=environment.employeConnecte.PHOTO_URL ;
        this.employeFonction=environment.employeConnecte.Fonction ;
        this.userInfo=environment.employeConnecte ;
        localStorage.removeItem('nabysy_token');
      }
    }
    this.menu.close('menu-content');
  }

}
