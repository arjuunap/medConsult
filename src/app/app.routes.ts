import { Routes } from '@angular/router';
// Auth feature imports
import { PatientRegisterComponent } from './features/patients/components/patient-register/patient-register';
import { Register } from './features/auth/components/register/register';
import { Userlogin } from './features/auth/components/userlogin/userlogin';
import { AuthSucessComponent } from './features/auth/components/auth-success-component/auth-sucess-component';

// Dashboard feature imports
import { LayoutComponent } from './features/dashboard/components/patients-side/layout/layout';
import { Drcard } from './features/dashboard/components/patients-side/drcard/drcard';
import { HomeComponent } from './features/dashboard/components/patients-side/home/home';
import { Drprofile } from './features/dashboard/components/patients-side/drprofile/drprofile';

import { Settings } from './features/dashboard/components/patients-side/settings/settings';
import { Alllabresults } from './features/dashboard/components/patients-side/alllabresults/alllabresults';

// Patients feature imports
import { HealthVital } from './features/patients/components/health-vital/health-vital';
import { LabResultSubmissionComponent } from './features/patients/components/lab-result-form/lab-result-form';
import { VitalsDetailComponent } from './features/patients/components/show-vitals/show-vitals';
import { VitalsEditComponent } from './features/patients/components/edit-vitals/edit-vitals';

// Doctors feature imports
import { DrRegister } from './features/doctors/components/dr-register/dr-register';

// Core imports
import { authGuard } from './core/guards/auth-guard';
import { Labresultlist } from './features/patients/components/labresultlist/labresultlist';
import { Appointment } from './features/dashboard/components/patients-side/appointments/appointment';
import { Schedul } from './features/dashboard/components/patients-side/schedul/schedul';
import { Drschedul } from './features/doctors/components/dr-schedules/drschedul';
import { Addschedule } from './features/doctors/components/addschedule/addschedule';
import { ProfileComponent } from './features/dashboard/components/patients-side/profile/profile';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Userlogin },
  { path: 'register', component: Register },
  { path: 'patient-register', component: PatientRegisterComponent },
  { path: 'dr-register', component: DrRegister },
  {path : 'oauth-success', component : AuthSucessComponent},


  {
    path: 'layout',
    component: LayoutComponent,
    canActivate: [authGuard], 
    children: [
      { path: 'home', component: HomeComponent },
      {path : 'profile', component : ProfileComponent},
      { path: 'doctors', component: Drcard },
      { path: 'drprofile/:id', component: Drprofile },
      { path: 'schedule/:id', component: Schedul },
      { path: 'settings', component: Settings },
      { path: 'show-vitals', component: VitalsDetailComponent },
      { path: 'edit-vitals/:vitalId', component: VitalsEditComponent },
      {path : 'add-lab-result', component : LabResultSubmissionComponent},
      {path : 'lab-results',component : Alllabresults},
      {path : 'all-lab-results/:patientId',component :Labresultlist },
      {path : 'add-vitals', component : HealthVital},
      {path : 'appointments', component : Appointment},
      {path : 'schedules',component : Drschedul},
      {path : 'add-schedule', component : Addschedule},
      { path: '', redirectTo: 'home', pathMatch: 'full' } 
    ]
  },
  

];
