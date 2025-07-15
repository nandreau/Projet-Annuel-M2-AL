import { Component, OnInit, ViewChild } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
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
import { FormsModule } from '@angular/forms';
import { IonSplitPane, MenuController } from '@ionic/angular';
import { UtilitiesService } from './services/utilities.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    RouterLink,
    RouterLinkActive,
    IonicModule,
    ToastModule,
    FormsModule,
  ],
})
export class AppComponent implements OnInit {
  @ViewChild('ionSplitPane') ionSplitPane!: IonSplitPane;
  public pages: Page[] = [];

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private utils: UtilitiesService,
  ) {
    const allowedRoutes = [
      '/dashboard',
      '/sites',
      '/tasks',
      '/planning',
      '/problems',
      '/admin',
    ];

    this.router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd) {
        const isAllowed = allowedRoutes.some((route) =>
          event.urlAfterRedirects.startsWith(route),
        );
        this.checkPages();
        if (isAllowed && this.pages.length > 1) {
          this.ionSplitPane.disabled = false;
          await this.menuCtrl.enable(true);
          await this.menuCtrl.open('main-menu');
        } else {
          this.ionSplitPane.disabled = true;
          await this.menuCtrl.close('main-menu');
          await this.menuCtrl.enable(false);
        }
      }
    });

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
    this.checkPages();
  }

  checkPages() {
    const isAdmin = this.utils.isAdmin();
    const isModeratorOrAdmin = this.utils.isModeratorOrAdmin();
    const isArtisanOrModeratorOrAdmin =
      this.utils.isArtisanOrModeratorOrAdmin();

    this.pages = [
      { title: 'Tableau de bord', url: '/dashboard', icon: 'home' },
    ];
    if (isModeratorOrAdmin) {
      this.pages.push({
        title: 'Tout les chantiers',
        url: '/sites',
        icon: 'business',
      });
    }
    if (isArtisanOrModeratorOrAdmin) {
      this.pages.push(
        {
          title: isModeratorOrAdmin ? 'Toute les tâches' : 'Mes tâches',
          url: '/tasks',
          icon: 'list',
        },
        { title: 'Planning', url: '/planning', icon: 'calendar' },
        { title: 'Problèmes', url: '/problems', icon: 'warning' },
      );
    }
    if (isAdmin) {
      this.pages.push({
        title: 'Administration',
        url: '/admin',
        icon: 'people',
      });
    }
  }
}

interface Page {
  title: string;
  url: string;
  icon: string;
}
