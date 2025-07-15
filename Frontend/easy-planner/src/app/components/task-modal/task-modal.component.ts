import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import {
  Task,
  Phase,
  Checklist,
  ApiResponse,
} from 'src/app/models/global.model';
import { RequestService } from 'src/app/services/request.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { PrimengModule } from 'src/app/shared/primeng.module';
import { ImageManagerComponent } from '../image-manager/image-manager.component';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, PrimengModule, ImageManagerComponent],
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss'],
})
export class TaskModalComponent {
  @Input() visible: boolean = false;
  @Input() task!: Task;
  @Input() phases: Phase[] = [];

  @Output() submitted = new EventEmitter<any>();
  @Output() closed = new EventEmitter<void>();

  // dropdown options
  progressionOptions: Option[] = [
    { label: 'Non démarrées', value: 'À faire' },
    { label: 'En cours', value: 'En cours' },
    { label: 'Terminée', value: 'Terminée' },
    { label: 'En retard', value: 'En retard' },
  ];

  priorityOptions: Option[] = [
    { label: 'Urgent', value: 'Urgent' },
    { label: 'Important', value: 'Important' },
    { label: 'Moyen', value: 'Moyen' },
    { label: 'Faible', value: 'Faible' },
  ];

  newItemName = '';
  confirmation: boolean = false;
  imageList: string[] = [];

  constructor(
    private request: RequestService,
    public utils: UtilitiesService,
  ) {}

  /** Generic field update */
  async onFieldChange<K extends keyof Task>(field: K, value: Task[K]) {
    try {
      const updated: ApiResponse = await firstValueFrom(
        this.request.put(
          `api/tasks/${this.task.id}/meta`,
          { [field]: value },
          false,
        ),
      );
      this.task = updated.data;
    } catch (err) {
      console.error('Erreur mise à jour tâche', err);
    }
  }

  /** Add a new checklist item */
  async addChecklistItem() {
    const name = this.newItemName.trim();
    if (!name) return;
    try {
      const item: ApiResponse = await firstValueFrom(
        this.request.post(
          'api/checklist',
          { taskId: this.task.id, name },
          false,
        ),
      );
      this.task.checklists = [...(this.task.checklists || []), item.data];
      this.newItemName = '';
    } catch (err) {
      console.error('Erreur création checklist item', err);
    }
  }

  /** Update an existing checklist item */
  async onChecklistChange(item: Checklist) {
    try {
      const updated = await firstValueFrom(
        this.request.put<Checklist>(
          `api/checklist/${item.id}`,
          { name: item.name, done: item.done },
          false,
        ),
      );
      this.task.checklists = this.task.checklists!.map((i) =>
        i.id === updated.id ? updated : i,
      );
    } catch (err) {
      console.error('Erreur mise à jour checklist item', err);
    }
  }

  /** Delete a checklist item */
  async deleteChecklistItem(item: Checklist) {
    try {
      await firstValueFrom(
        this.request.delete<void>(`api/checklist/${item.id}`, false),
      );
      this.task.checklists = this.task.checklists!.filter(
        (i) => i.id !== item.id,
      );
    } catch (err) {
      console.error('Erreur suppression checklist item', err);
    }
  }

  async onValidate() {
    try {
      if (this.imageList.length === 0) {
        console.warn('At least one image is required');
        return;
      }

      const validated: ApiResponse = await firstValueFrom(
        this.request.put(
          `api/tasks/${this.task.id}/validate`,
          { images: [...this.imageList] },
          true,
        ),
      );

      this.task = validated.data;
      this.submitted.emit(validated.data);
    } catch (err: any) {
      console.error('Erreur validation tâche', err);
    }
  }
}

interface Option {
  label: string;
  value: string;
}
