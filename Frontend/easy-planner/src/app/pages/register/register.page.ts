import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule } from 'src/app/shared/ionic.module';
import { PrimengModule } from 'src/app/shared/primeng.module';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [FormsModule, RouterLink, IonicModule, PrimengModule]
})
export class RegisterPage {
  fullName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor() {}

  onSubmit() {
    console.log('Nom:', this.fullName);
    console.log('Email:', this.email);
    console.log('Mot de passe:', this.password);
    console.log('Confirmation:', this.confirmPassword);
  }
}
