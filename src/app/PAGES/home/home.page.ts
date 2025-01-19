/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from 'src/app/services/loading.service';
import { NabysyGlobalServiceService } from 'src/app/services/nabysy-global-service.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  nomEmploye: string = '';
  prenomEmploye: string = '';
  employeFonction: string = '';
  photoUrl: string = '';
  listeRapports: any[] = [];

  features: any[] = [
    { id: 1, name: 'ADMINISTRATION', src: 'assets/office (1).png', background: 'rgba(27, 150, 181, 0.1)', page: '/administration' },
    { id: 2, name: 'PERSONNEL', src: 'assets/man.png', background: 'rgba(106, 100, 255, 0.1)', page: '/personnel' },
    { id: 3, name: 'AFFECTATION', src: 'assets/send.png', background: 'rgba(255, 196, 9, 0.1)', page: '/affectation' },
    { id: 4, name: 'SALAIRE', src: 'assets/salary.png', background: 'rgba(27, 150, 181, 0.1)', page: '/list-salaires' },
    { id: 5, name: 'Paiement', src: 'assets/salary.png', background: 'rgba(27, 150, 181, 0.1)', page: '/paiement-salaire' },
    { id: 6, name: 'PRIME', src: 'assets/indemnity.png', background: 'rgba(27, 150, 181, 0.1)', page: '/prime' },
    { id: 7, name: 'CALENDRIER ABSENCE', src: 'assets/schedule.png', background: 'rgba(27, 150, 181, 0.1)', page: '/absence' },
  ];

  transaction: any[] = [
    { id: 1, vendor: 'Rapport du 21 septembre......', image: '', amount: 'Service comptable', time: 'le 22/09/2021 3:00PM' },
    { id: 2, vendor: 'Rapport du 09 Octobre........', image: '', amount: 'Service comptable', time: 'le 14/10/2021 4:00PM' },
    { id: 3, vendor: 'Rapport du 11 Octobre........', image: '', amount: 'Service comptable', time: 'le 20/10/2021 4:00PM' },
    { id: 4, vendor: 'Rapport du 13 Octobre........', image: '', amount: 'Service comptable', time: 'le 21/10/2021 4:00PM' },
  ];

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private menu: MenuController,
    public nbService: NabysyGlobalServiceService,
    private http: HttpClient
  ) {
    console.log('Constructeur HomePage');
    if (environment.employeConnecte) {
      this.setEmployeInfos(environment.employeConnecte);
    } else {
      this.getInfosUtilisateur();
    }
    this.rapportRecent();
  }

  ngOnInit(): void {
    console.log('ngOnInit pour HomePage');
    if (!environment.employeConnecte) {
      this.getInfosUtilisateur();
    }
  }

  admin() {
    this.router.navigateByUrl('/administration');
  }

  _openSideNav() {
    this.menu.enable(true, 'menu-content');
    this.menu.open('menu-content');
  }

  private setEmployeInfos(employe: any) {
    if (employe) {
      this.nomEmploye = employe.Nom;
      this.prenomEmploye = employe.Prenom;
      this.employeFonction = employe.Fonction;
      this.photoUrl = employe.PHOTO_URL;
      console.log('Employé connecté:', employe);
    } else {
      console.warn('Aucune information d\'employé disponible');
    }
  }

  getInfosUtilisateur() {
    console.log('getInfosUtilisateur du HomePage');
    const apiUrl = `${environment.endPoint}nabysy_action.php?Action=GET_INFOS_USER&User=${environment.userName}&Password=${environment.passWord}`;
    console.log('API URL:', apiUrl);

    this.http.get(apiUrl).subscribe(
      (data: any) => {
        if (data) {
          environment.employeConnecte = data;
          this.setEmployeInfos(data);
        } else {
          console.warn('Aucune donnée utilisateur récupérée');
          environment.employeConnecte = null;
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des informations utilisateur:', error);
      }
    );
  }

  rapportRecent() {
    console.log('Chargement des rapports récents...');
    this.loadingService.presentLoading();
    const apiUrl = `${environment.endPoint}rs_action.php?Action=GET_RAPPORT_RS&Token=${localStorage.getItem('nabysy_token')}`;

    this.readAPI(apiUrl).subscribe(
      (listes: any) => {
        this.listeRapports = listes || [];
        console.log('Rapports récents récupérés:', this.listeRapports);
      },
      (error) => {
        console.error('Erreur lors de la récupération des rapports récents:', error);
      }
    );
  }

  readAPI(url: string) {
    console.log('Requête API:', url);
    return this.http.get(url);
  }
}
