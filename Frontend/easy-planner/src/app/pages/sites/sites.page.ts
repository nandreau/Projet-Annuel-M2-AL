import { Component, OnInit } from '@angular/core';
import { IonicModule } from 'src/app/shared/ionic.module';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.page.html',
  styleUrls: ['./sites.page.scss'],
  standalone: true,
  imports: [IonicModule, HeaderComponent]
})
export class SitesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
