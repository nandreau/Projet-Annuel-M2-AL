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
   * Returns one of 'À faire' | 'En cours' | 'Terminée' | 'En retard'
   * based on done, dueDate, assignments, and a current date string.
   */
  getTaskState(task: Task): string {
    const todayStr = new Date().toISOString().slice(0, 10);
    if (task.done) {
      return 'Terminée';
    }
    if (task.dueDate && task.dueDate < todayStr) {
      return 'En retard';
    }
    return task.assignments && task.assignments.length > 0
      ? 'En cours'
      : 'À faire';
  }

  /**
   * Returns PrimeNG severity for a given task state.
   */
  getTaskSeverity(task: Task): 'success' | 'warn' | 'danger' | 'secondary' {
    const state = this.getTaskState(task);
    switch (state) {
      case 'Terminée':  return 'success';
      case 'En retard': return 'danger';
      case 'En cours':  return 'warn';
      case 'À faire':   return 'secondary';
      default:          return 'secondary';
    }
  }

  /**
   * Returns PrimeNG severity for a given problem priority.
   */
  getPrioritySeverity(priority: string): 'danger' | 'warn' | 'info' | 'secondary' {
    switch (priority) {
      case 'Urgent': return 'danger';
      case 'Important': return 'warn';
      case 'Moyen':  return 'info';
      case 'Faible': return 'secondary';
      default:       return 'info';
    }
  }

  /**
   * Returns PrimeNG severity for a given problem status.
   */
  getStatusSeverity(status: string): 'success' | 'warn' | 'danger' | 'info' {
    switch (status) {
      case 'Résolu':     return 'success';
      case 'En cours':   return 'warn';
      case 'Non résolu': return 'danger';
      default:           return 'info';
    }
  }
  
}
