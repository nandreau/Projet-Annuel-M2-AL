import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormField } from 'src/app/models/global.model';
import { PrimengModule } from 'src/app/shared/primeng.module';

@Component({
  selector: 'app-dynamic-form-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, PrimengModule],
  templateUrl: './dynamic-form-modal.component.html',
  styleUrls: ['./dynamic-form-modal.component.scss'],
})
export class DynamicFormModalComponent<T> {
  @Input() visible: boolean = false;
  @Input() mode: 'add' | 'edit' = 'add';

  @Input() model!: any;
  @Input() fields: FormField<any>[] = [];

  @Input() addTitle = 'Ajouter';
  @Input() editTitle = 'Modifier';
  @Input() addButtonLabel = 'Ajouter';
  @Input() editButtonLabel = 'Enregistrer';
  @Input() subtitle = '';
  @Input() dialogWidth = '30rem';

  // pour multiselect
  @Input() optionLabelKey = 'name';
  @Input() optionValueKey = 'id';
  @Input() separator = ',';

  @Output() submitted = new EventEmitter<any>();
  @Output() closed = new EventEmitter<void>();
}
