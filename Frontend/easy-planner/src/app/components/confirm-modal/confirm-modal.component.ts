import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule, ButtonSeverity } from 'primeng/button';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  templateUrl: './confirm-modal.component.html',
})
export class ConfirmModalComponent {
  @Input() visible: boolean = false;
  @Input() header = 'Confirmation';
  @Input() subtitle = '';
  @Input() color: ButtonSeverity = 'primary';

  @Output() submitted = new EventEmitter<any>();
  @Output() closed = new EventEmitter<void>();
}
