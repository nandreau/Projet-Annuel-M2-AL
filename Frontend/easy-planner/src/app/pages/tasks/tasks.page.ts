import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from 'src/app/shared/ionic.module';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { Table } from 'primeng/table';
import { PrimengModule } from 'src/app/shared/primeng.module';
import { TableService } from 'src/app/services/table.service';
import { SortEvent } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { RequestService } from 'src/app/services/request.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { TaskModalComponent } from 'src/app/components/task-modal/task-modal.component';
import { Task } from 'src/app/models/global.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: true,
  imports: [IonicModule, PrimengModule, HeaderComponent, FormsModule, TaskModalComponent],
})
export class TasksPage implements OnInit {
  @ViewChild('dt') dt!: Table;

  tasks: Task[] = [];
  initialValues: Task[] = [];
  columns!: { field: string; header: string }[];
  globalFilterFields!: string[];
  isSorted: boolean | null = null;
  visibleDetail = false;
  selectedTask!: Task;

  constructor(
    private tableService: TableService,
    private request: RequestService,
    public utils: UtilitiesService
  ) {}

  async ngOnInit() {
    await this.loadTasks();
    this.defineFields();
  }

  private loadTasks(): Promise<void> {
    return firstValueFrom(this.request.get<Task[]>('api/tasks'))
      .then(data => {
        this.tasks = data;
        this.initialValues = [...data];
      })
      .catch(err => {
        console.error('Erreur chargement tâches', err);
      });
  }

  private defineFields() {
    this.columns = [
      { field: 'name',        header: 'Nom' },
      { field: 'priority',    header: 'Priorité' },
      { field: 'done',        header: 'État' },
      { field: 'doneDate',    header: 'Terminé le' },
      { field: 'dueDate',     header: 'Fin prévue' },
    ];
    this.globalFilterFields = this.columns.map(col => col.field);
  }

  applyGlobalFilter(event: any) {
    const filter = (event.target as HTMLInputElement).value;
    this.tableService.applyGlobalFilter(this.dt, filter);
  }

  customSort(event: SortEvent) {
    this.isSorted = this.tableService.customSort(
      event,
      this.tasks,
      this.initialValues,
      this.isSorted,
      this.dt,
    );
  }

  openEdit(task: Task) {
    this.selectedTask = { ...task };
    this.visibleDetail = true;
  }

  onDetailClose() {
    this.visibleDetail = false;
  }

  async onDetailSave(updated: Task) {
    await this.loadTasks();
    this.visibleDetail = false;
  }
}
