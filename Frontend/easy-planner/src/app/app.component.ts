import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  listOutline,
  listSharp,
  businessOutline,
  businessSharp,
  calendarOutline,
  calendarSharp,
  homeOutline,
  homeSharp,
  peopleOutline,
  peopleSharp,
  warningOutline,
  warningSharp,
} from 'ionicons/icons';
import { IonicModule } from './shared/ionic.module';
import { ToastModule } from 'primeng/toast';
import { RoleEnum, UserAuth } from './models/global.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, RouterLinkActive, IonicModule, ToastModule],
})
export class AppComponent implements OnInit {
  public pages: Page[] = [];

  constructor() {
    addIcons({
      homeSharp,
      businessSharp,
      calendarSharp,
      listSharp,
      warningSharp,
      peopleSharp,
      homeOutline,
      businessOutline,
      calendarOutline,
      listOutline,
      warningOutline,
      peopleOutline,
    });
  }

  ngOnInit() {

    const raw = localStorage.getItem('currentUser');
    let user: UserAuth | null;
    let isAdmin: boolean = false;
    if (raw) {
      user = JSON.parse(raw);
      isAdmin = user?.roles.includes(RoleEnum.ROLE_ADMIN) ? true:false;
    }
    
    this.pages = [
      { title: 'Tableau de bord', url: '/dashboard', icon: 'home' },
      { title: isAdmin ? 'Tout les chantiers' : 'Mes chantiers', url: '/sites', icon: 'business' },
       { title: isAdmin ? 'Toute les taches' : 'Mes tâches', url: '/tasks', icon: 'list' },
      { title: 'Planning', url: '/planning', icon: 'calendar' },
      { title: 'Problèmes', url: '/problems', icon: 'warning' },
      { title: 'Administration', url: '/admin', icon: 'people' },
      { title: 'Login', url: '/login', icon: 'people' },
      { title: 'Register', url: '/register', icon: 'people' },
    ];
  }
}

interface Page {
  title: string;
  url: string;
  icon: string;
}
