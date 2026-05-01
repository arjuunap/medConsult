import { Routes } from '@angular/router';
import { PatientRegisterComponent } from './patient-register/patient-register';
import { Register } from './register/register';
import { Userlogin } from './userlogin/userlogin';
import { LayoutComponent } from './patients-side/layout/layout';
import { Drcard } from './patients-side/drcard/drcard';
import { HomeComponent } from './patients-side/home/home';
import { Drprofile } from './patients-side/drprofile/drprofile';
import { Schedul } from './patients-side/schedul/schedul';
import { Settings } from './patients-side/settings/settings';
import { HealthVital } from './health-vital/health-vital';
import { DrRegister } from './dr-register/dr-register';
import { LabResultSubmissionComponent } from './lab-result-form/lab-result-form';
import { VitalsDetailComponent } from './show-vitals/show-vitals';
import { VitalsEditComponent } from './edit-vitals/edit-vitals';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Userlogin },
  { path: 'register', component: Register },
  { path: 'patient-register', component: PatientRegisterComponent },
  { path: 'dr-register', component: DrRegister },
  { path: 'lab-result', component: LabResultSubmissionComponent },



  {
    path: 'layout',
    component: LayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'doctors', component: Drcard },
      { path: 'drprofile/:id', component: Drprofile },
      { path: 'schedule/:id', component: Schedul },
      { path: 'settings', component: Settings },
      { path: 'show-vitals', component: VitalsDetailComponent },
      { path: 'edit-vitals/:vitalId', component: VitalsEditComponent },
      //   { path: 'chat', component: ChatComponent },

      { path: '', redirectTo: 'home', pathMatch: 'full' } // default child
    ]
  },
  { path: 'health-vital', component: HealthVital }

];
