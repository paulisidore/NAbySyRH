/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quote-props */
/* eslint-disable max-len */
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  userName: '',
  passWord: '',
  appInfo: null,
  userProfile: null,
  //endPoint:'https://kssv.homeip.net/nabysyrhrs/',
  //endPoint: 'https://cloud-549579568.onetsolutions.network/nabysyrhrs/',
  endPoint:'https://technoweb.homeip.net/nabysyrhrs/',
  //endPoint: 'https://groupe-pam.net/nabysyrhrs/',
  employeConnecte: null,
  tokenUser:'',
  nabysyGS: {"messagingEndpoint":"https://technoweb.homeip.net/app/web/nabysy/relationclient_action.php",
              "mainEndpoint":"https://technoweb.homeip.net/app/web/nabysy/",
              "fidelityEndpoint":"https://technoweb.homeip.net/gs_api.php" },

  };

  /*
  * For easier debugging in development mode, you can import the following file
  * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
  *
  * This import should be commented out in production mode because it will have a negative impact
  * on performance if an error is thrown.
  */
   import 'zone.js/dist/zone-error';  // Included with Angular CLI.

