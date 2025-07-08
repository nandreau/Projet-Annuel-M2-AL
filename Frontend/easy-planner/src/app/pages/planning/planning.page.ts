import { Component, OnInit } from '@angular/core';
import { IonicModule } from 'src/app/shared/ionic.module';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { PrimengModule } from 'src/app/shared/primeng.module';
import { FormsModule } from '@angular/forms';
import { Assignment, Chantier, FormField, Phase, Task, User } from 'src/app/models/global.model';
import { RequestService } from 'src/app/services/request.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { firstValueFrom } from 'rxjs';
import { DynamicFormModalComponent } from 'src/app/components/dynamic-form-modal/dynamic-form-modal.component';
import { ConfirmModalComponent } from 'src/app/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.page.html',
  styleUrls: ['./planning.page.scss'],
  standalone: true,
  imports: [IonicModule, PrimengModule, HeaderComponent, FormsModule, DynamicFormModalComponent, ConfirmModalComponent],
})
export class PlanningPage implements OnInit {
  days: { date: Date; name: string; day: string, shortName: string }[] = [];
  chantiers: Chantier[] = [];
  artisans: User[] = [];
  
  selectedChantier?: Chantier;
  groupOptions: { name: string; id: number|null }[] = [];
  selectedGroup: number|null = null;

  weekRange = '';
  today: Date = new Date();

  // Modal controls
  assignmentFormVisible = false;
  confirmVisible = false;
  formMode: 'add' | 'edit' = 'add';
  formTitle = '';
  formFields: FormField<any>[] = [];
  formModel: any = {};
  deleteAssignmentId?: number;

  constructor(
    private request: RequestService,
    public utils: UtilitiesService
  ) {}

  async ngOnInit() {
    await this.loadArtisans();
    this.initWeekDays();
    await this.loadChantiers();
    this.updateGroupOptions();
  }

  private initWeekDays() {
    const dow = this.today.getDay();
    const diffToMon = (dow + 6) % 7;
    const monday = new Date(this.today);
    monday.setDate(this.today.getDate() - diffToMon);

    const weekdayFmt = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' });
    const dayNumFmt  = new Intl.DateTimeFormat('fr-FR', { day: '2-digit' });
    const monthFmt   = new Intl.DateTimeFormat('fr-FR', { month: 'long' });

    this.days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      this.days.push({
        date: d,
        name: weekdayFmt.format(d),
        day: dayNumFmt.format(d),
        shortName: weekdayFmt.format(d).charAt(0).toUpperCase()
      });
    }
    const startStr = dayNumFmt.format(this.days[0].date);
    const endStr   = dayNumFmt.format(this.days[6].date);
    const monthStr = monthFmt.format(this.days[0].date);
    this.weekRange = `${startStr} – ${endStr} ${monthStr} ${this.days[0].date.getFullYear()}`;
  }

  private async loadChantiers() {
    try {
      this.chantiers = await firstValueFrom(
        this.request.get<Chantier[]>('api/chantiers')
      );
      this.selectedChantier = this.chantiers[0];
    } catch (err) {
      console.error('Erreur chargement chantiers', err);
    }
  }

  private async loadArtisans() {
    try {
      const allUsers = await firstValueFrom(
        this.request.get<User[]>('api/users')
      );
      this.artisans = allUsers
        .filter(u => u.roles.some(r => r.name === 'artisan'))
        .map(u => ({
          ...u,
          fullname: `${u.firstname} ${u.name}`
        }));
    } catch (err) {
      console.error('Erreur chargement artisans', err);
    }
  }

  onChantierChange() {
    this.updateGroupOptions();
  }

  private updateGroupOptions() {
    const ct = this.selectedChantier!;
    const inter = ct.intervenants || [];
    this.groupOptions = [
      { id: null, name: 'Tous les artisans' },
      ...inter.map(u => ({ id: u.id, name: `${u.firstname} ${u.name}` }))
    ];
    this.selectedGroup = null;
  }
  
  getSchedulesForDay(task: Task, day: Date) {
    let assigns = task.assignments;
    if (this.selectedGroup !== null) {
      assigns = assigns.filter(a => a.users.some(u => u.id === this.selectedGroup));
    }
    const ds = new Date(day); ds.setHours(0,0,0,0);
    const de = new Date(day); de.setHours(23,59,59,999);
    return assigns
      .filter(a => a.startDate && a.endDate)
      .filter(a => new Date(a.startDate) <= de && new Date(a.endDate) >= ds)
      .map(a => {
        const pad = (n: number) => n.toString().padStart(2,'0');
        const s = new Date(a.startDate), e = new Date(a.endDate);
        return { ...a, time: `${pad(s.getHours())}h${pad(s.getMinutes())} – ${pad(e.getHours())}h${pad(e.getMinutes())}` };
      });
  }


  isOverdue(task: Task): boolean {
    return !task.done && !!task.dueDate && new Date(task.dueDate) <= this.today;
  }

  isOngoing(task: Task): boolean {
    return !task.done && !!task.dueDate && new Date(task.dueDate) > this.today;
  }

  isTodo(task: Task): boolean {
    return !task.done && !task.dueDate;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear();
  }

  prev() {
    this.today.setDate(this.today.getDate() - 7);
    this.initWeekDays();
  }

  next() {
    this.today.setDate(this.today.getDate() + 7);
    this.initWeekDays();
  }

  navigateToday() {
    this.today = new Date();
    this.initWeekDays();
  }

  // Add assignment modal
  openAddModal(taskId: number, date: Date) {
    this.formMode = 'add';
    this.formTitle = `Ajouter une nouvelle assignation`;
    this.formModel = { taskId, date, startTime: '08:00', endTime: '17:00', users: [] };
    this.defineFormFields();
    this.assignmentFormVisible = true;
  }

  // Edit assignment modal
  openEditModal(a: Assignment) {
    this.formMode = 'edit';
    const d = new Date(a.startDate);
    const e = new Date(a.endDate);

    const two = (n: number) => n.toString().padStart(2, '0');

    this.formTitle = `Modifier une assignation`;
    this.formModel = {
      id: a.id,
      taskId: a.taskId,
      date: d,
      startTime: `${two(d.getHours())}:${two(d.getMinutes())}`,
      endTime:   `${two(e.getHours())}:${two(e.getMinutes())}`,
      users: a.users.map(u => u.id)
    };
    this.defineFormFields();
    this.assignmentFormVisible = true;
  }

  defineFormFields() {
    this.formFields = [
      { key: 'date', label: 'Date', type: 'date', placeholder: '' },
      { key: 'startTime', label: 'Début', type: 'time', placeholder: '' },
      { key: 'endTime',  label: 'Fin', type: 'time', placeholder: '' },
      { key: 'users', label: 'Artisans', type: 'multiselect', options: this.artisans, optionLabel: 'fullname',  optionValue: 'id', placeholder: 'Sélectionner' }
    ];
  }

  // 4) onFormSubmit
  async onFormSubmit(model: any) {
    // split the HH:MM strings
    const [sh, sm] = (model.startTime as string).split(':').map(Number);
    const [eh, em] = (model.endTime   as string).split(':').map(Number);

    const sd = new Date(model.date);
    sd.setHours(sh, sm, 0, 0);

    const ed = new Date(model.date);
    ed.setHours(eh, em, 0, 0);

    if (this.formMode === 'add') {
      await firstValueFrom(this.request.post('api/assignments', {
        taskId: model.taskId,
        startDate: sd,
        endDate: ed,
        assignment_users: model.users
      }, true));
    } else {
      await firstValueFrom(this.request.put(
        `api/assignments/${model.id}`,
        { startDate: sd, endDate: ed, assignment_users: model.users },
        true
      ));
    }
    this.assignmentFormVisible = false;
    await this.loadChantiers();
  }

  openDeleteModal(a: Assignment) {
    this.deleteAssignmentId = a.id;
    this.confirmVisible = true;
  }

  async onDeleteConfirm() {
    if (!this.deleteAssignmentId) return;
    await firstValueFrom(this.request.delete(`api/assignments/${this.deleteAssignmentId}`, true));
    this.confirmVisible = false;
    await this.loadChantiers();
  }
}
