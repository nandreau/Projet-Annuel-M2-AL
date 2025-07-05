import { Component, OnInit } from '@angular/core';
import { IonicModule } from 'src/app/shared/ionic.module';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { PrimengModule } from 'src/app/shared/primeng.module';
import { FormsModule } from '@angular/forms';
import { Phase, Task } from 'src/app/models/global.model';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.page.html',
  styleUrls: ['./planning.page.scss'],
  standalone: true,
  imports: [IonicModule, PrimengModule, HeaderComponent, FormsModule],
})
export class PlanningPage implements OnInit {
  days: { date: Date; name: string; day: string }[] = [];

  projects: Phase[] = [
    {
      id: 0,
      name: 'Phase 1 : Démolition',
      progress: 65,
      tasks: [
        {
          id: 0,
          name: 'Démolition cloisons',
          done: false,
          dueDate: '2025-06-24',
          doneDate: '2025-06-24',
          tasks: [
            {
              id: 0,
              startDate: '2025-06-24T08:00:00',
              endDate: '2025-06-24T12:00:00',
            },
          ],
        },
        {
          id: 0,
          name: 'Installation plomberie',
          done: true,
          dueDate: '2025-06-15',
          doneDate: '2025-06-24',
          tasks: [
            {
              id: 0,
              startDate: '2025-06-24T13:00:00',
              endDate: '2025-06-24T17:00:00',
            },
          ],
        },
        {
          id: 0,
          name: 'Installation électricité',
          done: false,
          dueDate: '2025-07-02',
          doneDate: '2025-06-24',
          tasks: [
            {
              id: 0,
              startDate: '2025-06-24T09:00:00',
              endDate: '2025-06-24T12:00:00',
            },
          ],
        },
      ],
    },
    {
      id: 0,
      name: 'Phase 2 : Electricité',
      progress: 30,
      tasks: [
        {
          id: 0,
          name: 'Coulage fondations',
          done: true,
          dueDate: '2025-06-10',
          doneDate: '2025-06-24',
          tasks: [
            {
              id: 0,
              startDate: '2025-06-24T08:00:00',
              endDate: '2025-06-24T10:30:00',
            },
          ],
        },
        {
          id: 0,
          name: 'Élévation murs',
          done: false,
          dueDate: '2025-07-05',
          doneDate: '2025-06-24',
          tasks: [
            {
              id: 0,
              startDate: '2025-06-24T10:30:00',
              endDate: '2025-06-24T15:00:00',
            },
          ],
        },
      ],
    },
    {
      id: 0,
      name: 'Phase 3 : Peinture',
      progress: 10,
      tasks: [
        {
          id: 0,
          name: 'Dépose ancienne toiture',
          done: false,
          dueDate: '2025-07-10',
          doneDate: '2025-06-24',
          tasks: [
            {
              id: 0,
              startDate: '2025-06-24T08:00:00',
              endDate: '2025-06-24T11:00:00',
            },
          ],
        },
      ],
    },
  ];

  // header controls
  views = [{ name: 'Semaine' }, { name: 'Mois' }];
  sites = [
    { name: 'Construction Maison Martin' },
    { name: 'Réfection Toiture Dubois' },
  ];
  groupBy = [{ name: 'Par artisan' }];
  selectedView = this.views[0];
  selectedSite = this.sites[0];
  selectedGroup = this.groupBy[0];
  weekRange = '';
  today: Date = new Date();

  ngOnInit() {
    const dow = this.today.getDay();
    const diffToMon = (dow + 6) % 7;
    const monday = new Date(this.today);
    monday.setDate(this.today.getDate() - diffToMon);

    const weekdayFmt = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' });
    const dayNumFmt = new Intl.DateTimeFormat('fr-FR', { day: '2-digit' });

    this.days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      this.days.push({
        date: d,
        name: weekdayFmt.format(d),
        day: dayNumFmt.format(d),
      });
    }

    // 3. compute weekRange display
    const monthFmt = new Intl.DateTimeFormat('fr-FR', { month: 'long' });
    const startStr = dayNumFmt.format(this.days[0].date);
    const endStr = dayNumFmt.format(this.days[6].date);
    const monthStr = monthFmt.format(this.days[0].date);
    this.weekRange = `${startStr} – ${endStr} ${monthStr} ${this.days[0].date.getFullYear()}`;
  }

  getSchedulesForDay(task: Task, day: Date): { time: string }[] {
    const results: { time: string }[] = [];

    // Define start and end of the target day
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    for (const planning of task.tasks) {
      if (!planning.startDate || !planning.endDate) continue;

      const start = new Date(planning.startDate);
      const end = new Date(planning.endDate);

      // Check overlap with this day
      if (start <= dayEnd && end >= dayStart) {
        const pad = (n: number) => n.toString().padStart(2, '0');
        const s = `${pad(start.getHours())}h${pad(start.getMinutes())}`;
        const e = `${pad(end.getHours())}h${pad(end.getMinutes())}`;
        results.push({ time: `${s} – ${e}` });
      }
    }

    return results;
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

  prev() {
    /* decale la semaine */
  }
  next() {
    /* avance la semaine */
  }
  naviguateToday() {
    /* revient à aujourd'hui */
  }
}
