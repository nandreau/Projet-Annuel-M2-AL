import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthResponse } from 'src/app/models/global.model';
import { RequestService } from 'src/app/services/request.service';
import { IonicModule } from 'src/app/shared/ionic.module';
import { PrimengModule } from 'src/app/shared/primeng.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [FormsModule, RouterLink, IonicModule, PrimengModule],
})
export class LoginPage {
email    = '';
  password = '';

  constructor(
    private request: RequestService,
    private router:  Router
  ) {}

  onSubmit() {
    const payload = {
      email:    this.email,
      password: this.password
    };

    this.request
    .post<AuthResponse>('api/auth/signin', payload, true)
    .subscribe({
      next: res => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('currentUser', JSON.stringify({
          id:        res.id,
          firstname: res.firstname,
          name:      res.name,
          email:     res.email,
          roles:     res.roles,
          avatar:    res.avatar
        }));
        this.router.navigate(['/']);
      },
      error: err => {
        console.error(err);
      }
    });
  }
}
