import { Injectable } from '@angular/core';
import { Chantier, Phase, Task, User } from 'src/app/models/global.model';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
 /** % of done tasks in a phase */
  getPhaseProgress(ph: Phase): number {
    const total = ph.tasks?.length ?? 0;
    if (total === 0) return 0;
    const done = ph.tasks!.filter(t => t.done).length;
    return Math.round((done / total) * 100);
  }

  /** % of done tasks across all phases of a chantier */
  getChantierProgress(ct: Chantier): number {
    const allTasks = ct.phases?.reduce<Task[]>((arr, ph) => {
      return arr.concat(ph.tasks ?? []);
    }, []) ?? [];
    if (allTasks.length === 0) return 0;
    const done = allTasks.filter(t => t.done).length;
    return Math.round((done / allTasks.length) * 100);
  }

  /**
   * Extract a flat list of unique users assigned anywhere in this chantier.
   */
  extractUniqueUsersFromChantier(chantier: Chantier): User[] {
    const seen = new Map<number, User>();
    for (const phase of chantier.phases || []) {
      for (const task of phase.tasks || []) {
        for (const assignment of (task.assignments || [])) {
          for (const user of (assignment.users || [])) {
            if (!seen.has(user.id)) {
              seen.set(user.id, user);
            }
          }
        }
      }
    }
    return Array.from(seen.values());
  }
}
