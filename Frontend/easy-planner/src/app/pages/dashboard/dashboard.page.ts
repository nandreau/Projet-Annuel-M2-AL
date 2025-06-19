import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { IonicModule } from 'src/app/shared/ionic.module';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, HeaderComponent]
})
export class DashboardPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
