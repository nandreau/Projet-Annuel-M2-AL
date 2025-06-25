import { Component } from '@angular/core';
import { IonicModule } from 'src/app/shared/ionic.module';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonicModule],
})
export class HeaderComponent {
  constructor() {}
}
