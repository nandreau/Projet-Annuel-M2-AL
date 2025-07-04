import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthResponse } from '../../models/global.model';
import { IonicModule } from 'src/app/shared/ionic.module';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user: AuthResponse | null = null;

  constructor(private router: Router) {
    addIcons({ logOutOutline });
  }

  ngOnInit() {
    const raw = localStorage.getItem('currentUser');
    if (raw) {
      this.user = JSON.parse(raw) as AuthResponse;
    }
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
