import { Component, OnInit } from '@angular/core';
import { IonicModule } from 'src/app/shared/ionic.module';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { PrimengModule } from 'src/app/shared/primeng.module';
import { FormsModule } from '@angular/forms';
import { Chantier, Phase, Task } from 'src/app/models/global.model';
import { RequestService } from 'src/app/services/request.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.page.html',
  styleUrls: ['./planning.page.scss'],
  standalone: true,
  imports: [IonicModule, PrimengModule, HeaderComponent, FormsModule],
})
export class PlanningPage implements OnInit {
  days: { date: Date; name: string; day: string }[] = [];
  chantiers: Chantier[] = [];

  // header controls (unchanged)…
  views = [{ name: 'Semaine' }, { name: 'Mois' }];
  groupBy = [{ name: 'Par artisan' }];
  selectedView = this.views[0];
  selectedChantier?: Chantier;
  selectedGroup = this.groupBy[0];
  weekRange = '';
  today: Date = new Date();

  constructor(
    private request: RequestService,
    public utils: UtilitiesService
  ) {}

  async ngOnInit() {
    this.initWeekDays();
    await this.loadChantiers();
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
      this.days.push({ date: d, name: weekdayFmt.format(d), day: dayNumFmt.format(d) });
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

  getSchedulesForDay(task: Task, day: Date): { time: string }[] {
    const results: { time: string }[] = [];

    // Define start and end of the target day
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    for (const planning of task.assignments) {
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
