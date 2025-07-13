import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from 'src/app/shared/ionic.module';
import { PrimengModule } from 'src/app/shared/primeng.module';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { SelectItem } from 'primeng/api';
import { ChartModule } from 'primeng/chart';
import { forkJoin } from 'rxjs';

import { Chantier, Task, Problem, User } from 'src/app/models/global.model';
import { RequestService } from 'src/app/services/request.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    HeaderComponent,
    PrimengModule,
    FormsModule,
    ChartModule,
    RouterModule,
  ],
})
export class DashboardPage implements OnInit {
  // --- Metrics ---
  activeChantiers = 0;
  inProgressTasks = 0;
  completedTasks = 0;
  activeUsers = 0;

  // --- Data sources ---
  chantiers: Chantier[] = [];
  problems: Problem[] = [];
  tasks: Task[] = [];
  users: User[] = [];

  // --- Dropdown options ---
  chantierOptions: SelectItem[] = [];
  statusOptions: SelectItem[] = [];
  priorityOptions: SelectItem[] = [];
  stateOptions: SelectItem[] = [];

  // --- Filters / selections ---
  historyChantierId: number | null = null;
  historyState: string | null = null;
  historyPriority: string | null = null;
  problemChantierId: number | null = null;
  problemStatus: string | null = null;
  problemPriority: string | null = null;

  // --- Chart data & options ---
  tasksData: any;
  tasksOptions: any;
  problemsData: any;
  problemsOptions: any;

  constructor(
    private request: RequestService,
    private cd: ChangeDetectorRef,
    public utils: UtilitiesService,
  ) {}

  ngOnInit() {
    this.loadAllData();
  }

  private loadAllData() {
    forkJoin({
      chantiers: this.request.get<Chantier[]>('api/chantiers', false),
      tasks: this.request.get<Task[]>('api/tasks', false),
      problems: this.request.get<Problem[]>('api/problems', false),
      users: this.request.get<User[]>('api/users', false),
    }).subscribe({
      next: ({ chantiers, tasks, problems, users }) => {
        this.chantiers = chantiers;
        this.tasks = tasks;
        this.problems = problems;
        this.users = users;

        // Metrics
        this.activeChantiers = chantiers.length;

        // flatten tasks without flatMap
        const allTasks: Task[] = chantiers.reduce((acc, ct) => {
          const tasks = ct.phases.reduce(
            (subAcc, ph) => subAcc.concat(ph.tasks),
            [] as Task[],
          );
          return acc.concat(tasks);
        }, [] as Task[]);

        this.inProgressTasks = allTasks.filter((t) => !t.done).length;
        this.completedTasks = allTasks.filter((t) => t.done).length;
        this.activeUsers = users.length;

        // Dropdown options
        this.chantierOptions = chantiers.map((c) => ({
          label: c.title,
          value: c.id,
        }));
        this.statusOptions = ['En cours', 'Non résolu', 'Résolu'].map((s) => ({
          label: s,
          value: s,
        }));
        this.priorityOptions = ['Urgent', 'Important', 'Moyen', 'Faible'].map(
          (p) => ({ label: p, value: p }),
        );
        this.stateOptions = [
          { label: 'À faire', value: 'À faire' },
          { label: 'En cours', value: 'En cours' },
          { label: 'Terminée', value: 'Terminée' },
          { label: 'En retard', value: 'En retard' },
        ];
        // Filters default
        this.historyChantierId = chantiers[0].id;
        this.problemChantierId = chantiers[0].id;

        // Build charts
        this.initChart();

        this.cd.markForCheck();
      },
      error: (err) => console.error('Error loading dashboard data', err),
    });
  }

  get filteredProblems(): Problem[] {
    return this.problems.filter(
      (p) =>
        (!this.problemChantierId ||
          p.chantier?.id === this.problemChantierId) &&
        (!this.problemStatus || p.status === this.problemStatus) &&
        (!this.problemPriority || p.priority === this.problemPriority),
    );
  }

  get historyTasks(): Task[] {
    const chantier = this.chantiers.find(
      (c) => c.id === this.historyChantierId,
    );
    const phaseIds = chantier?.phases.map((p) => p.id) || [];

    return this.tasks.filter(
      (t) =>
        (!this.historyChantierId || phaseIds.includes(t.phaseId)) &&
        (!this.historyState ||
          this.utils.getTaskState(t) === this.historyState) &&
        (!this.historyPriority || t.priority === this.historyPriority),
    );
  }

  private initChart() {
    const style = getComputedStyle(document.documentElement);
    const textColor = style.getPropertyValue('--p-text-color');
    const textMuted = style.getPropertyValue('--p-text-muted-color');
    const border = style.getPropertyValue('--p-content-border-color');

    // 1) Tasks by status
    const allTasks: Task[] = this.chantiers.reduce((acc, ct) => {
      const ts = ct.phases.reduce(
        (sa, ph) => sa.concat(ph.tasks),
        [] as Task[],
      );
      return acc.concat(ts);
    }, [] as Task[]);

    const counts1: Record<string, number> = {
      'À faire': 0,
      'En cours': 0,
      Terminée: 0,
      'En retard': 0,
    };
    allTasks.forEach((t) => {
      const key = this.utils.getTaskState(t);
      counts1[key]++;
    });
    const labels1 = Object.keys(counts1);
    const colors1: Record<string, string> = {
      'À faire': 'rgba(0,0,0,0.6)',
      'En cours': 'rgba(255,214,0,0.6)',
      Terminée: 'rgba(51,209,122,0.6)',
      'En retard': 'rgba(255,92,92,0.6)',
    };
    this.tasksData = {
      labels: labels1,
      datasets: [
        {
          label: 'Tâches',
          data: labels1.map((l) => counts1[l]),
          backgroundColor: labels1.map((l) => colors1[l]),
          borderColor: labels1.map((l) => colors1[l].replace(/0\.6\)/, '1)')),
          borderWidth: 1,
        },
      ],
    };
    this.tasksOptions = {
      indexAxis: 'y',
      plugins: { legend: { position: 'top', labels: { color: textColor } } },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { color: textMuted, stepSize: 1 },
          grid: { color: border },
        },
        y: { ticks: { color: textMuted }, grid: { color: border } },
      },
    };

    // 2) Problems by status
    const counts2: Record<string, number> = {
      'En cours': 0,
      'Non résolu': 0,
      Résolu: 0,
    };
    this.problems.forEach((p) => {
      if (counts2[p.status] != null) counts2[p.status]++;
    });
    const labels2 = Object.keys(counts2);
    const colors2: Record<string, string> = {
      'En cours': 'rgba(255,214,0,0.6)',
      'Non résolu': 'rgba(255,92,92,0.6)',
      Résolu: 'rgba(51,209,122,0.6)',
    };
    this.problemsData = {
      labels: labels2,
      datasets: [
        {
          label: 'Problèmes',
          data: labels2.map((l) => counts2[l]),
          backgroundColor: labels2.map((l) => colors2[l]),
          borderColor: labels2.map((l) => colors2[l].replace(/0\.6\)/, '1)')),
          borderWidth: 1,
        },
      ],
    };
    this.problemsOptions = {
      indexAxis: 'y',
      plugins: { legend: { position: 'top', labels: { color: textColor } } },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { color: textMuted, stepSize: 1 },
          grid: { color: border },
        },
        y: { ticks: { color: textMuted }, grid: { color: border } },
      },
    };
  }
}
