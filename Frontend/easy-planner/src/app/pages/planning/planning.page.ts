import { Component, OnInit } from '@angular/core';
import { IonicModule } from 'src/app/shared/ionic.module';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { PrimengModule } from 'src/app/shared/primeng.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.page.html',
  styleUrls: ['./planning.page.scss'],
  standalone: true,
  imports: [IonicModule, PrimengModule, HeaderComponent, FormsModule],
})
export class PlanningPage implements OnInit {
  days: { date: Date; label: string; day: string }[] = [];

  // dummy data
  projects: Phase[] = [
    {
      name: 'Phase 1 : Démolition',
      progress: 65,
      tasks: [
        { name: 'Démolition cloisons', status: 'notStarted', schedule: [] },
        {
          name: 'Installation plomberie',
          status: 'finished',
          schedule: [
            {
              start: 1750233610,
              end: 1750266010,
            },
          ],
        },
        {
          name: 'Installation électricité',
          status: 'inProgress',
          schedule: [
            {
              start: 1750233610,
              end: 1750266010,
            },
          ],
        },
      ],
    },
    {
      name: 'Phase 2 : Electricité',
      progress: 30,
      tasks: [
        {
          name: 'Coulage fondations',
          status: 'finished',
          schedule: [{ start: 1750233610, end: 1750266010 }],
        },
        { name: 'Élévation murs', status: 'inProgress', schedule: [] },
      ],
    },
    {
      name: 'Phase 3 : Peinture',
      progress: 10,
      tasks: [
        {
          name: 'Dépose ancienne toiture',
          status: 'notStarted',
          schedule: [{ start: 1750233610, end: 1750266010 }],
        },
      ],
    },
  ];

  // header controls
  views = [{ label: 'Semaine' }, { label: 'Mois' }];
  sites = [
    { label: 'Construction Maison Martin' },
    { label: 'Réfection Toiture Dubois' },
  ];
  groupBy = [{ label: 'Par artisan' }];
  selectedView = this.views[0];
  selectedSite = this.sites[0];
  selectedGroup = this.groupBy[0];
  weekRange = '';

  ngOnInit() {
    const today = new Date();
    const dow = today.getDay();
    const diffToMon = (dow + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMon);

    const weekdayFmt = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' });
    const dayNumFmt = new Intl.DateTimeFormat('fr-FR', { day: '2-digit' });

    this.days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      this.days.push({
        date: d,
        label: weekdayFmt.format(d),
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

  getSchedulesForDay(task: Task, day: Date) {
    const dayStart = Math.floor(
      new Date(day.setHours(0, 0, 0, 0)).getTime() / 1000,
    );
    const dayEnd = dayStart + 86400;

    return task.schedule
      .filter((e) => e.start < dayEnd && e.end > dayStart)
      .map((e) => {
        const s = new Date(e.start * 1000);
        const t = new Date(e.end * 1000);
        const pad = (n: number) => n.toString().padStart(2, '0');
        return {
          time: `${pad(s.getHours())}h${pad(s.getMinutes())} – ${pad(t.getHours())}h${pad(t.getMinutes())}`,
        };
      });
  }

  prev() {
    /* decale la semaine */
  }
  next() {
    /* avance la semaine */
  }
  today() {
    /* revient à aujourd'hui */
  }
}

type Status = 'notStarted' | 'inProgress' | 'finished';

interface Details {
  start: number;
  end: number;
}

interface Task {
  name: string;
  status: Status;
  schedule: Details[];
}

interface Phase {
  name: string;
  tasks: Task[];
  progress: number;
}
