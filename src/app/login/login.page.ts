/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { NabysyGlobalServiceService } from '../services/nabysy-global-service.service';
import { UserInfosServiceService } from '../user-infos-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';
  IdEmploye: '';


  constructor(
    private router: Router,
    private toasctrl: ToastController,
    private alertctrl: AlertController,
    private loadingctrl: LoadingController,
   private http: HttpClient,
    private navctrl: NavController,
    private infosUserSrv: UserInfosServiceService,
    private nabysyGSrv: NabysyGlobalServiceService,
    private route: ActivatedRoute,
  ) {
    environment.appInfo={ID:1,Nom:'Paul & Aïcha Machinerie',Adresse:'Dakar',IdResponsable:0,Tel:'+221 33 836 14 77',Email:'',Contact:''} ;
    //console.log(environment.appInfo);
    this.route.queryParams.subscribe(
      params =>{
        console.log("Parametre distant recus: ", params);
        if(params.enc_user){
          let dUser=window.atob(params.enc_user);
          console.log("User recus: ", dUser);
          environment.userName=dUser;
          this.username=dUser;
        }
        if(params.enc_pwd){
          let dPwd=window.atob(params.enc_pwd);
          //console.log("Pwd recus: ", dPwd);
          environment.passWord=dPwd;
          this.password=dPwd ;
        }

      }
    );
    console.log('Chargement des données...');
    nabysyGSrv.loadAppInfosFromAPI().then(
      ()=>{
        if(environment.userName !=='' && environment.passWord !==""){
          console.log('Auto-Login...');
          this.proseslogin();
        }
      }
    );
   }

  ngOnInit() {
  }

  async proseslogin(){
    if (this.username !== '' && this.password !== '') {
      const body = {
        login: this.username,
        password: this.password,
        aksi: 'Login'
      };
      console.log('Connexion en cour .. vers '+environment.endPoint);
      const headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json' );
      const apiUrl=environment.endPoint+'auth.php?Login='+this.username+'&Password='+this.password;
      //console.log(apiUrl);
      environment.userName=this.username ;
      environment.passWord=this.password ;
      this.http.get(apiUrl).subscribe(async data => {
       console.log(data['Extra']);
       if (data['OK'] !== 0) {
          // environment.tokenUser=data['Extra'] ;
          localStorage.setItem('nabysy_token',data['Extra']);
          //Recup info de l'utilisateur connecté
          await this.getInfosUtilisateur();

       }else{
          environment.userName='' ;
          environment.passWord='' ;
          const toast = await this.toasctrl.create({
            message: 'Username or password invalid',
            duration: 2000,
            position: 'top'
          });
          toast.present();
       }
     });
    } else {
      const toast = await this.toasctrl.create({
        message: 'Vérifiez votre connexion svp.',
        duration: 2000,
        position: 'top'
      });
      toast.present();
    }

    this.username = '';
    this.password = '';

    // Info Utilisateur

      return new Promise (() =>{


      });
  };

  getInfosUtilisateur(){
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json' );
    // eslint-disable-next-line max-len
    const apiUrl=environment.endPoint+'nabysy_action.php?Action=GET_INFOS_USER&User='+environment.userName+'&Password='+environment.passWord;
    console.log(apiUrl);

    this.http.get(apiUrl).subscribe( data => {
      //console.log(data);
      if (data) {
        environment.employeConnecte =data ;
        console.log(environment);
        this.infosUserSrv.getUserProfile().subscribe(userData => {
          environment.userProfile=userData;
          delete environment.userProfile.PASSWORD ;
          console.log(environment.userProfile);
          console.log('Ouverture du Menu Principal');
          this.router.navigate(['/home']);
        });
      //toast.present();
      }else{
        environment.employeConnecte=null;
      }
    });

  }
}
