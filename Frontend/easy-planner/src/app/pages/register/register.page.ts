import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiResponse } from 'src/app/models/global.model';
import { RequestService } from 'src/app/services/request.service';
import { IonicModule } from 'src/app/shared/ionic.module';
import { PrimengModule } from 'src/app/shared/primeng.module';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [FormsModule, RouterLink, IonicModule, PrimengModule],
})
export class RegisterPage {
  firstname = '';
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  job = '';

  constructor(
    private request: RequestService,
    private router: Router,
    private messageService: MessageService,
  ) {}

  onSubmit() {
    if (this.password && this.password !== this.confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Passwords do not match',
      });
      return;
    }

    const payload = {
      firstname: this.firstname,
      name: this.name,
      email: this.email,
      job: [this.job],
      avatar: null,
      password: this.password,
    };

    this.request.post<ApiResponse>('api/auth/signup', payload, true).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
