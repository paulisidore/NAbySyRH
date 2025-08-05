import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { IApiNotification } from 'src/app/services/apireponse-structure.service';
import { LoadingService } from 'src/app/services/loading.service';
import { IKSSVTransactionSalaire, PaiementService } from 'src/app/services/paiement.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-paiementen-vrac',
  templateUrl: './paiementen-vrac.page.html',
  styleUrls: ['./paiementen-vrac.page.scss'],
})
export class PaiementenVracPage implements OnInit {

  isProcessing = false;
  progress = 0;

  constructor(private menu: MenuController,private alertctrl: AlertController,
      private loadingService: LoadingService,
      private http: HttpClient,
      private paiementSrv: PaiementService,) { }

  ngOnInit() {
  }

async validatePayment(tableau: any[] = []) {
    console.log('Pret a envoyer: ', tableau);
    const token = localStorage.getItem('nabysy_token');
    if (!token) {
      console.error('Token not found');
      return; // Arrêter l'exécution si le token est absent
    }

    // Ouvrir une alerte pour demander la confirmation de l'utilisateur
    const alert = await this.alertctrl.create({
      header: 'Confirmation',
      message:
        'Voulez-vous effectuer l\' envoie d\'un paiement à '+tableau.length+' contact(s) ?',
      buttons: [
        {
          text: 'Oui',
          handler: () => this.startPaymentProcess(tableau, token),
        },
        {
          text: 'Non',
          handler: () => {
            console.log('Action annulée');
          },
        },
      ],
    });

    await alert.present();
  }

  // Fonction pour démarrer le processus de paiement
  async startPaymentProcess(listeSelectionee: any[], token: string) {
    this.isProcessing = true;
    this.progress = 0;

    const alert = await this.alertctrl.create({
      header: 'Traitement en cours',
      message: 'Paiement en cours...',
      buttons: [],
      backdropDismiss: false,
      cssClass: 'progress-alert',
    });

    await alert.present();

    const totalEmployees = listeSelectionee.length;
    let processedEmployees = 0;

    for (let i = 0; i < totalEmployees; i++) {
      const employee: any = listeSelectionee[i];
      if (Number(employee.montant) <= 0) {
        employee.status = 'paiement effectué'; // Statut automatique
        console.log(
          `Paiement impossible pour ${employee.indicatif} ${employee.nom} (Montant Net <= 0)`
        );
        processedEmployees++;
        continue; // Passer à l'employé suivant
      }

      //let IdEmploye = `&IDEMPLOYE=${employee.IDEMPLOYE}`;
      const apiUrl =
        environment.endPoint +
        'salaire_action.php?Action=PAIEMENT_SALAIRE&MOIS=' +
        '&NOTE_MODEPAIEMENT=' +
        employee.motif +
        '&Token=' +
        token;
      console.log(`Envoie du paiement de l'employé: ${employee.nom}`, employee);
      console.log('Montant:', -1*employee.montant);

      try {
        //await this.http.get(apiUrl).toPromise();
        const donnee = await firstValueFrom(this.http.get(apiUrl)) ;
        const repo: IApiNotification = donnee as IApiNotification;
        console.log('Réponse de l\'API:', repo);
        if(repo && repo.OK !== null && repo.OK >0){
          employee.status = 'succès'; // Paiement réussi
          console.log(
            `Paiement réussi pour ${employee.nom}`
          );
          //On cree le debit dans mouvement compte client de la Boutique Rattachée au lieu d'affectation de l'employé
          const trans: IKSSVTransactionSalaire = {montant: Number(employee.montant),  libelle: employee.nom + ': ' + employee.motif};
          trans.modePayment = 'WAVE' ; // Mode de paiement par défaut
          trans.idBoutique = 0 ;//Depot ?;
          trans.montant = -1 * Number(employee.montant); // Montant négatif pour un débit
          (await this.paiementSrv.saveTransaction(trans)).subscribe((kssvrep: IApiNotification) =>{
            if(kssvrep && kssvrep.OK !== null && kssvrep.OK >0){
              console.log(`Transaction enregistrée avec succès pour ${employee.nom}`);
            }else{
              console.error(`Erreur lors de l'enregistrement de la transaction pour ${employee.nom}: ` + kssvrep.TxErreur);
            }
          });
        }else if(repo && repo.OK !== null && repo.OK<1){
          console.error(
            `Erreur de paiement pour ${employee.nom} :` , repo.Contenue
          );
          employee.status = 'échec'; // Paiement échoué
          employee.TxErreur = repo.TxErreur; // Stocker l'erreur pour affichage
          if(repo.Contenue){
            if(repo.Contenue.ERREUR){
              if(Array.isArray(repo.Contenue.ERREUR)){
                console.log('Liste des erreurs:', repo.Contenue.ERREUR);
                if(repo.Contenue.ERREUR.length > 0){
                  employee.TxErreur ='';
                }
                repo.Contenue.ERREUR.forEach((erreur) => {
                  employee.TxErreur += erreur.TxErreur + ' '; // Ajouter chaque erreur à TxErreur
                });
              }
            }
          }
        }else{
          employee.status = 'échec'; // Paiement échoué
          employee.TxErreur = repo.TxErreur; // Stocker l'erreur pour affichage
          console.error(
            `Erreur de paiement pour ${employee.nom} : Réponse inattendue: ` + donnee
          );
        }
      } catch (error) {
        console.error(
          `Erreur de paiement pour ${employee.nom}:`,
          error
        );
        employee.status = 'échec'; // Paiement échoué
        employee.TxErreur = `${error}`; // Stocker l'erreur pour affichage
      }
      processedEmployees++;
      this.progress = processedEmployees / totalEmployees;
      alert.message = `Traitement de ${processedEmployees} sur ${totalEmployees} employés...`;
    }

    this.isProcessing = false;
    alert.message = `Paiement terminé. ${totalEmployees} employés traités.`;
    setTimeout(() => {
      alert.dismiss();
    }, 2000);
  }

  readAPI(url: string) {
    return this.http.get(url);
  }

  doRefresh(event) {
    event.target.complete();
  }
  _openSideNav() {
    this.menu.enable(true, 'menu-content');
    this.menu.open('menu-content');
  }

}
