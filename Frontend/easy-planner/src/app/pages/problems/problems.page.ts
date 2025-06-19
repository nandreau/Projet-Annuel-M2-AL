import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { IonicModule } from 'src/app/shared/ionic.module';


@Component({
  selector: 'app-problems',
  templateUrl: './problems.page.html',
  styleUrls: ['./problems.page.scss'],
  standalone: true,
  imports: [IonicModule, HeaderComponent]
})
export class ProblemsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
