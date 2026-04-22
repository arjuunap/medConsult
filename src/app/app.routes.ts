import { Routes } from '@angular/router';
// import { Login } from './login/login';
import { DrRegister } from './dr-register/dr-register';
import { PatientRegisterComponent } from './patient-register/patient-register';
import { Register } from './register/register';
export const routes: Routes = [
    { path: '', component: Register,pathMatch: 'full' },
    // { path: 'login', component: Login },
    { path: 'patient-register', component: PatientRegisterComponent },
];
