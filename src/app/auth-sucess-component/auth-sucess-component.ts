import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/authServices/auth';
import { DoctorService } from '../services/doctor';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-sucess-component',
  imports: [],
  templateUrl: './auth-sucess-component.html',
  styleUrl: './auth-sucess-component.css',
})
export class AuthSucessComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.route.queryParams

      .subscribe(params => {

        const token =
          params['token'];

        if(token) {

          localStorage.setItem(
            'token',
            token
          );

          this.router.navigate([
            '/layout/home'
          ]);
        }
      });
  }
}