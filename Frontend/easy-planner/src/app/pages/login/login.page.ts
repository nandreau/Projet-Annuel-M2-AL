import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
  email: string = '';
  password: string = '';

  onSubmit() {
    // traitement du formulaire ici
    console.log('Email:', this.email);
    console.log('Password:', this.password);
  }
}
