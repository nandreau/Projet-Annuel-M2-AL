import { Component,  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-not-authorized',
  templateUrl: './not-authorized.page.html',
  styleUrls: ['./not-authorized.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class NotAuthorizedPage {
}
