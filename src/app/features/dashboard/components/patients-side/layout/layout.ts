import { Component,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { HomeComponent } from '../home/home';
import { Drcard } from '../drcard/drcard';
import { Drprofile } from '../drprofile/drprofile';
import { DoctorService } from '../../../../../core/services/doctorServices/doctor';
import { AuthService } from '../../../../../core/services/authServices/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, HomeComponent, Drcard, Drprofile],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class LayoutComponent {
  constructor(private doctorService: DoctorService, private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }
  // logout() {
  //   localStorage.removeItem('token');
  //   window.location.href = '/login';

  sidebarOpen = false;

toggleSidebar() {
  this.sidebarOpen = !this.sidebarOpen;
}

closeSidebar() {
  this.sidebarOpen = false;
}
  // }
  logout() {

    this.authService.logout();
  }
  role: string | null = '';
  user: any = {};
 goToProfile() {
    this.router.navigate(['layout/profile']);
  }
  ngOnInit(): void {

    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
    }

    this.authService.UserDetails().subscribe({
      next: (res) => {
        this.user = res; 

        this.role = res.role;
        this.cd.detectChanges();
        

        console.log('User role:', this.role);

      },
      error: (err) => {
        console.error('Error fetching user details', err);
      }
    });
  }

  isActive(): boolean {
    return this.router.url === '/layout/home'
        || this.router.url === '/layout/patient-dashboard';
  }

}