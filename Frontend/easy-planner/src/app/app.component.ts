
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { addIcons } from 'ionicons';
import { businessOutline, businessSharp, calendarOutline, calendarSharp, homeOutline, homeSharp, peopleOutline, peopleSharp, warningOutline, warningSharp } from 'ionicons/icons';
import { IonicModule } from './shared/ionic.module';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, RouterLinkActive, IonicModule],
})
export class AppComponent {
  public appPages = [
    { title: 'Tableau de bord', url: '/dashboard', icon: 'home' },
    { title: 'Tout les chantiers', url: '/sites', icon: 'business' },
    { title: 'Planning', url: '/planning', icon: 'calendar' },
    { title: 'Problèmes', url: '/problems', icon: 'warning' },
    { title: 'Administration', url: '/admin', icon: 'people' },
  ];
  constructor() {
    addIcons({ homeSharp, businessSharp, calendarSharp, warningSharp, peopleSharp, homeOutline, businessOutline, calendarOutline, warningOutline, peopleOutline });
  }
}
