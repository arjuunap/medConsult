import { Routes } from '@angular/router';
import { PatientRegisterComponent } from './components/patient-register/patient-register';
import { Register } from './components/register/register';
import { Userlogin } from './components/userlogin/userlogin';
import { LayoutComponent } from './components/patients-side/layout/layout';
import { Drcard } from './components/patients-side/drcard/drcard';
import { HomeComponent } from './components/patients-side/home/home';
import { Drprofile } from './components/patients-side/drprofile/drprofile';
import { Schedul } from './components/patients-side/schedul/schedul';
import { Settings } from './components/patients-side/settings/settings';
import { HealthVital } from './components/health-vital/health-vital';
import { DrRegister } from './components/dr-register/dr-register';
import { LabResultSubmissionComponent } from './components/lab-result-form/lab-result-form';
import { VitalsDetailComponent } from './components/show-vitals/show-vitals';
import { VitalsEditComponent } from './components/edit-vitals/edit-vitals';
import { Alllabresults } from './components/patients-side/alllabresults/alllabresults'
import { authGuard } from './guards/auth-guard';
import { AuthSucessComponent } from './components/auth-sucess-component/auth-sucess-component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Userlogin },
  { path: 'register', component: Register },
  { path: 'patient-register', component: PatientRegisterComponent },
  { path: 'dr-register', component: DrRegister },
  { path: 'lab-result', component: LabResultSubmissionComponent },
  {path : 'oauth-success', component : AuthSucessComponent},


  {
    path: 'layout',
    component: LayoutComponent,
    canActivate: [authGuard], 
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'doctors', component: Drcard },
      { path: 'drprofile/:id', component: Drprofile },
      { path: 'schedule/:id', component: Schedul },
      { path: 'settings', component: Settings },
      { path: 'show-vitals', component: VitalsDetailComponent },
      { path: 'edit-vitals/:vitalId', component: VitalsEditComponent },
      {path : 'lab-results',component : Alllabresults},
      {path : 'add-vitals/:patientId', component : HealthVital},
      { path: '', redirectTo: 'home', pathMatch: 'full' } 
    ]
  },
  

];
