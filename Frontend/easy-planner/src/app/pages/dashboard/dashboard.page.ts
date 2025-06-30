import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from 'src/app/shared/ionic.module';
import { PrimengModule } from 'src/app/shared/primeng.module';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { SelectItem } from 'primeng/api';

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
    FormsModule
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

  // --- CSS bar‐chart data ---
  statuses: { key: string; label: string; count: number }[] = [];
  maxStatusCount = 1;

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

    // --- build CSS‐bar “chart” data ---
    const byStatus: Record<string, number> = {
      'A faire': 0,
      'En cours': 0,
      'Terminée': 0,
      'En retard': 0,
      'Bloquée': 0
    };

    allTasks.forEach(t => {
      let statusKey: string;
      if (t.done) {
        statusKey = 'Terminée';
      } else if (t.dueDate! < this.today.toISOString().slice(0, 10)) {
        statusKey = 'En retard';
      } else {
        statusKey = 'En cours';
      }
      byStatus[statusKey]++;
    });

    this.statuses = Object.entries(byStatus).map(([label, count]) => {
      const key = label
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/\s+/g, '-');
      return { key, label, count };
    });
    this.maxStatusCount = Math.max(...this.statuses.map(s => s.count), 1);

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
  }

  loadMockData() {
    const user: User = {
      id: 1,
      firstname: 'Michael',
      name: 'youn',
      mail: 'm@r',
      date: '2025-06-01',
      role: ['Chef'],
      droit: 'full'
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
        date: '2025-07-19',
        status: 'En cours',
        description: '',
        user: user,
        images: [],
        messages: [
          {
            id: 1,
            sender: user,
            date: '2025-07-19',
            content: 'Attention !'
          }
        ]
      }
    ];
  }

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

  isLate(task: Task): boolean {
    return !!task.dueDate && !task.done && task.dueDate < this.todayStr;
  }
}
