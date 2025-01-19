import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./PAGES/home/home.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard],
  },
  /*  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  }, */
  {
    path: 'personnel',
    loadChildren: () =>
      import('./PAGES/personnel/personnel.module').then(
        (m) => m.PersonnelPageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'absence',
    loadChildren: () =>
      import('./PAGES/absence/absence.module').then((m) => m.AbsencePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'affectation',
    loadChildren: () =>
      import('./PAGES/affectation/affectation.module').then(
        (m) => m.AffectationPageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'direction',
    loadChildren: () =>
      import('./PAGES/direction/direction.module').then(
        (m) => m.DirectionPageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'liste-services',
    loadChildren: () =>
      import('./PAGES/liste-services/liste-services.module').then(
        (m) => m.ListeServicesPageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'services',
    loadChildren: () =>
      import('./PAGES/services/services.module').then(
        (m) => m.ServicesPageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'administration',
    loadChildren: () =>
      import('./PAGES/administration/administration.module').then(
        (m) => m.AdministrationPageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'prime',
    loadChildren: () =>
      import('./PAGES/prime/prime.module').then((m) => m.PrimePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'salaires',
    loadChildren: () =>
      import('./PAGES/salaires/salaires.module').then(
        (m) => m.SalairesPageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'crud-absence',
    loadChildren: () =>
      import('./CRUD/crud-absence/crud-absence.module').then(
        (m) => m.CrudAbsencePageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'crud-affectation',
    loadChildren: () =>
      import('./CRUD/crud-affectation/crud-affectation.module').then(
        (m) => m.CrudAffectationPageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'crud-direction',
    loadChildren: () =>
      import('./CRUD/crud-direction/crud-direction.module').then(
        (m) => m.CrudDirectionPageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'crud-employe',
    loadChildren: () =>
      import('./CRUD/crud-employe/crud-employe.module').then(
        (m) => m.CrudEmployePageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'crud-service',
    loadChildren: () =>
      import('./CRUD/crud-service/crud-service.module').then(
        (m) => m.CrudServicePageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'detail-absence',
    loadChildren: () =>
      import('./DETAIL/detail-absence/detail-absence.module').then(
        (m) => m.DetailAbsencePageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'detail-affectation',
    loadChildren: () =>
      import('./DETAIL/detail-affectation/detail-affectation.module').then(
        (m) => m.DetailAffectationPageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'detail-employe',
    loadChildren: () =>
      import('./DETAIL/detail-employe/detail-employe.module').then(
        (m) => m.DetailEmployePageModule
      ),
      canActivate: [AuthGuard],
  },

  {
    path: 'print-bulletin2',
    loadChildren: () =>
      import('./PAGES/print-bulletin2/print-bulletin2.module').then(
        (m) => m.PrintBulletin2PageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'crud-prime',
    loadChildren: () =>
      import('./CRUD/crud-prime/crud-prime.module').then(
        (m) => m.CrudPrimePageModule
      ),
      canActivate: [AuthGuard],
  },

  /* {
    path: 'photoviewer',
    loadChildren: () => import('./DETAIL/photoviewer/photoviewer.module').then( m => m.PhotoviewerPageModule)
  }, */
  {
    path: 'crud-sous-direction',
    loadChildren: () =>
      import('./CRUD/crud-sous-direction/crud-sous-direction.module').then(
        (m) => m.CrudSousDirectionPageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'detail-prime',
    loadChildren: () =>
      import('./DETAIL/detail-prime/detail-prime.module').then(
        (m) => m.DetailPrimePageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'photoviewer',
    loadChildren: () =>
      import('./DETAIL/photoviewer/photoviewer.module').then(
        (m) => m.PhotoviewerPageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'avance',
    loadChildren: () =>
      import('./CRUD/avance/avance.module').then((m) => m.AvancePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'detail-salaire',
    loadChildren: () =>
      import('./DETAIL/detail-salaire/detail-salaire.module').then(
        (m) => m.DetailSalairePageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'contrat',
    loadChildren: () =>
      import('./DETAIL/contrat/contrat.module').then(
        (m) => m.ContratPageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'credit',
    loadChildren: () =>
      import('./PAGES/credit/credit.module').then((m) => m.CreditPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'crud-credit',
    loadChildren: () =>
      import('./CRUD/crud-credit/crud-credit.module').then(
        (m) => m.CrudCreditPageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'detail-credit',
    loadChildren: () =>
      import('./DETAIL/detail-credit/detail-credit.module').then(
        (m) => m.DetailCreditPageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'crud-contrat',
    loadChildren: () =>
      import('./CRUD/crud-contrat/crud-contrat.module').then(
        (m) => m.CrudContratPageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'acces-users',
    loadChildren: () =>
      import('./CRUD/acces-users/acces-users.module').then(
        (m) => m.AccesUsersPageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'niveau-acces',
    loadChildren: () =>
      import('./CRUD/niveau-acces/niveau-acces.module').then(
        (m) => m.NiveauAccesPageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'paiement-salaire',
    loadChildren: () =>
      import('./PAGES/paiement-salaire/paiement-salaire.module').then(
        (m) => m.PaiementSalairePageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'employee-modal',
    loadChildren: () =>
      import('./CRUD/employee-modal/employee-modal.module').then(
        (m) => m.EmployeeModalPageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'list-salaires',
    loadChildren: () => import('./list-salaires/list-salaires.module').then( m => m.ListSalairesPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'error',
    loadChildren: () => import('./error/error.module').then( m => m.ErrorPageModule)
  },
  {
    path: '**',
    redirectTo: 'error', // Rediriger toutes les routes inconnues vers la page d'erreur
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
