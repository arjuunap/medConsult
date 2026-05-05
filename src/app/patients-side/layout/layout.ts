import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { HomeComponent } from '../home/home';
import { Drcard } from '../drcard/drcard';
import { Drprofile } from '../drprofile/drprofile';
import { DoctorService } from '../../services/doctor';
import { AuthService } from '../../services/authServices/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive,HomeComponent, Drcard, Drprofile],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class LayoutComponent {
  constructor(private doctorService: DoctorService, private authService: AuthService,
              private router: Router
  ) {}
  // logout() {
  //   localStorage.removeItem('token');
  //   window.location.href = '/login';
  // }
   logout() {

    this.authService.logout();
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if(!token) {
      this.router.navigate(['/login']);
        }
  }
  
}