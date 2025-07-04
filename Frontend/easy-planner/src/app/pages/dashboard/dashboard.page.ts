import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from 'src/app/shared/ionic.module';
import { PrimengModule } from 'src/app/shared/primeng.module';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { SelectItem } from 'primeng/api';
import { ChartModule } from 'primeng/chart';

import {
  Chantier,
  Phase,
  Task,
  Problem,
  User
} from 'src/app/models/global.model';

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
    ChartModule
  ]
})
export class DashboardPage implements OnInit {
  // --- Metrics ---
  activeChantiers = 0;
  inProgressTasks = 0;
  completedTasks = 0;
  activeUsers = 0;
  today: Date = new Date();
  todayStr!: string;

  // --- Data sources ---
  chantiers: Chantier[] = [];
  problems: Problem[] = [];

  // --- Dropdown options moved here! ---
  chantierOptions: SelectItem[] = [];
  statusOptions: SelectItem[] = [];
  priorityOptions: SelectItem[] = [];

  // --- Filters / selections ---
  historyChantierId: number | null = null;
  problemChantierId: number | null = null;
  problemStatus: string | null = null;
  problemPriority: string | null = null;

  tasksData: any;
  tasksOptions: any;

  problemsData: any;
  problemsOptions: any;

  ngOnInit() {
    this.loadMockData();

    // --- top metrics ---
    this.activeChantiers = this.chantiers.length;
    const allTasks: Task[] = [];
    this.chantiers.forEach(ct => {
      ct.phases.forEach(ph => {
        allTasks.push(...ph.tasks);
      });
    });
    this.inProgressTasks = allTasks.filter(t => !t.done).length;
    this.completedTasks = allTasks.filter(t => t.done).length;
    this.activeUsers = 23; // e.g. your real API
    
    // --- build dropdown options once ---
    this.chantierOptions = this.chantiers.map(c => ({
      label: c.title,
      value: c.id
    }));
    this.statusOptions = ['En cours', 'Non résolu', 'Résolu'].map(s => ({
      label: s,
      value: s
    }));
    this.priorityOptions = ['Urgent', 'Moyen', 'Faible'].map(u => ({
      label: u,
      value: u
    }));

    this.todayStr = this.today.toISOString().slice(0, 10);

    // --- init filters ---
    this.historyChantierId = this.chantiers[0]?.id ?? null;
    this.problemChantierId = this.chantiers[0]?.id ?? null;

    this.initChart();
  }

  constructor(private cd: ChangeDetectorRef) {}

  get historyTasks(): Task[] {
    const chantier = this.chantiers.find(x => x.id === this.historyChantierId);
    if (!chantier) {
      return [];
    }
    // flatten without flatMap
    return chantier.phases.reduce((all, phase) => {
      return all.concat(phase.tasks);
    }, [] as Task[]);
  }

  get filteredProblems() {
    return this.problems.filter(p =>
      (!this.problemChantierId ||
        p.chantier === this.chantierOptions.find(o => o.value === this.problemChantierId)?.label) &&
      (!this.problemStatus || p.status === this.problemStatus) &&
      (!this.problemPriority || p.urgency === this.problemPriority)
    );
  }
  
  loadMockData() {
    const user: User = {
      id: 1,
      firstname: 'Michael',
      name: 'youn',
      email: 'm@r',
      role: ['admin'],
      job: ['admin']
    };

    this.chantiers = [
      {
        id: 1,
        title: 'Chantier A',
        client: user,
        address: '123 Rue Principale',
        start: '2025-05-01',
        end: '2025-12-31',
        progress: 65,
        images: ['https://picsum.photos/seed/1/200/120'],
        intervenants: [{ avatar: 'https://i.pravatar.cc/40?img=1' }],
        phases: [
          {
            id: 11,
            name: 'Fondations',
            progress: 100,
            tasks: [
              {
                id: 111,
                name: 'Mise en place',
                done: true,
                dueDate: '2025-05-25',
                doneDate: '2025-05-25',
                tasks: []
              }
            ]
          },
          {
            id: 12,
            name: 'Electricité',
            progress: 60,
            tasks: [
              {
                id: 121,
                name: 'Câblage',
                done: false,
                dueDate: '2025-07-19',
                tasks: []
              }
            ]
          },
          {
            id: 13,
            name: 'Plomberie',
            progress: 20,
            tasks: [
              {
                id: 131,
                name: 'Tuyaux sanitaires',
                done: false,
                dueDate: '2025-09-30',
                tasks: []
              }
            ]
          },
          {
            id: 14,
            name: 'Finitions',
            progress: 0,
            tasks: []
          }
        ]
      }
      // … ajoutez Chantier B, C si besoin …
    ];

    this.problems = [
      {
        id: 100,
        title: 'Fuite d’eau au plafond',
        urgency: 'Urgent',
        chantier: 'Chantier A',
        phase: 'Plomberie',
        task: 'Tuyaux sanitaires',
        status: 'En cours',
        description: '',
        user: user,
        images: [],
        messages: [
          {
            id: 1,
            user: user,
            content: 'Attention !'
          }
        ]
      }
    ];
  }

  isLate(task: Task): boolean {
    return !!task.dueDate && !task.done && task.dueDate < this.todayStr;
  }

  initChart() {
    const docStyle = getComputedStyle(document.documentElement);
    const textColor          = docStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = docStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder      = docStyle.getPropertyValue('--p-content-border-color');

    // —————————————————————————————————————————————
    // 1) TASKS BY STATUS
    // —————————————————————————————————————————————
    const allTasks: Task[] = [];
    this.chantiers.forEach(ct =>
      ct.phases.forEach(ph => allTasks.push(...ph.tasks))
    );

    const todayStr = new Date().toISOString().slice(0,10);
    const taskByStatus: Record<string, number> = {
      'A faire':   0,
      'En cours':  0,
      'Terminée':  0,
      'En retard': 0
    };

    // count tasks
    allTasks.forEach(t => {
      const key = t.done
        ? 'Terminée'
        : t.dueDate
          ? (t.dueDate < todayStr ? 'En retard' : 'En cours')
          : 'A faire';
      taskByStatus[key]++;
    });

    const taskLabels = Object.keys(taskByStatus);

    // define one color per status
    const taskColors: Record<string,string> = {
      'A faire':   'rgba(0,0,0,0.6)',
      'En cours':  'rgba(255,214,0,0.6)',
      'Terminée':  'rgba(51,209,122,0.6)',
      'En retard': 'rgba(255,92,92,0.6)'
    };

    this.tasksData = {
      labels: taskLabels,
      datasets: [
        {
          label: 'Tâches',
          data: taskLabels.map(l => taskByStatus[l]),
          backgroundColor: taskLabels.map(l => taskColors[l]),
          borderColor:     taskLabels.map(l => taskColors[l].replace(/0\.6\)/,'1)')),
          borderWidth: 1
        }
      ]
    };

    this.tasksOptions = {
      indexAxis: 'y',   // horizontal bars
      plugins: {
        legend: {
          position: 'top',
          labels: { color: textColor }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { color: textColorSecondary, stepSize: 1 },
          grid:  { color: surfaceBorder }
        },
        y: {
          ticks: { color: textColorSecondary },
          grid:  { color: surfaceBorder }
        }
      }
    };

    // —————————————————————————————————————————————
    // 2) PROBLEMS BY STATUS
    // —————————————————————————————————————————————
    const problemByStatus: Record<string, number> = {
      'En cours':   0,
      'Non résolu': 0,
      'Résolu':     0
    };
    this.problems.forEach(p => {
      if (problemByStatus[p.status] != null) {
        problemByStatus[p.status]++;
      }
    });

    const problemLabels = Object.keys(problemByStatus);

    // define one color per problem-status
    const problemColors: Record<string,string> = {
      'En cours':   'rgba(255,214,0,0.6)',
      'Non résolu': 'rgba(255,92,92,0.6)',
      'Résolu':     'rgba(51,209,122,0.6)'
    };

    this.problemsData = {
      labels: problemLabels,
      datasets: [
        {
          label: 'Problèmes',
          data: problemLabels.map(l => problemByStatus[l]),
          backgroundColor: problemLabels.map(l => problemColors[l]),
          borderColor:     problemLabels.map(l => problemColors[l].replace(/0\.6\)/,'1)')),
          borderWidth: 1
        }
      ]
    };

    this.problemsOptions = {
      indexAxis: 'y',  // horizontal bars
      plugins: {
        legend: {
          position: 'top',
          labels: { color: textColor }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { color: textColorSecondary, stepSize: 1 },
          grid:  { color: surfaceBorder }
        },
        y: {
          ticks: { color: textColorSecondary },
          grid:  { color: surfaceBorder }
        }
      }
    };

    this.cd.markForCheck();
  }

  
}
