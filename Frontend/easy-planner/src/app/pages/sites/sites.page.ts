import { Component } from '@angular/core';
import { IonicModule } from 'src/app/shared/ionic.module';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { PrimengModule } from 'src/app/shared/primeng.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.page.html',
  styleUrls: ['./sites.page.scss'],
  standalone: true,
  imports: [IonicModule, PrimengModule, HeaderComponent, FormsModule]
})
export class SitesPage  {
  projets: Chantier[] = [
    {
      title: 'Rénovation Appartement Paris 16',
      client: 'Dupont SARL',
      address: '25 rue de la Pompe, Paris',
      start: '14/04/2025',
      end: '18/06/2025',
      globalProgress: 57,
      phases: [
        {
          label: 'Phase 1 : Démolition',
          progress: 100,
          tasks: [
            { label: 'Dépose des cloisons', done: true, doneDate: '18 avril 2025' },
            { label: 'Enlèvement des gravats', done: true, doneDate: '17 avril 2025' },
          ],
        },
        {
          label: 'Phase 2 : Electricité',
          progress: 30,
          statusLabel: 'En cours',
          tasks: [
            { label: 'Pose des gaines électriques', done: false, dueDate: '18 avril 2025' },
            { label: 'Pose des tableaux électriques', done: false },
            { label: 'Raccordements', done: false, dueDate: '18 avril 2025' },
          ],
        },
        {
          label: 'Phase 3 : Peinture',
          progress: 0,
          tasks: [
            { label: 'Préparation des murs', done: false, dueDate: '25 avril 2025' },
            { label: 'Mise en peinture', done: false, dueDate: '27 avril 2025' },
          ],
        },
      ],
      intervenants: [
        { avatar: 'assets/avatars/AV1.png' },
        { avatar: 'assets/avatars/AV2.png' },
        { avatar: 'assets/avatars/AV3.png' },
      ],
    },
    {
      title: 'Extension Maison Saint-Cloud',
      client: 'Martin Bâtiment',
      address: '8 avenue des Acacias, Saint-Cloud',
      start: '01/05/2025',
      end: '20/09/2025',
      globalProgress: 18,
      phases: [
        {
          label: 'Phase 1 : Terrassement',
          progress: 40,
          statusLabel: 'En cours',
          tasks: [
            { label: 'Décapage du terrain', done: true, doneDate: '21 avril 2025' },
            { label: 'Creusement des fondations', done: false },
          ],
        },
        {
          label: 'Phase 2 : Maçonnerie',
          progress: 0,
          tasks: [
            { label: 'Élévation des murs porteurs', done: false, dueDate: '28 avril 2025' },
            { label: 'Coulage de la dalle', done: false, dueDate: '24 avril 2025' },
          ],
        },
      ],
      intervenants: [
        { avatar: 'assets/avatars/AV2.png' },
        { avatar: 'assets/avatars/AV4.png' },
      ],
    },
  ];
  newChantier = {
    title:   '',
    client:  '',
    address: '',
    start:   null as Date|null,
    end:     null as Date|null
  };
  newPhase = { label: '' };
  newTask = { label: '', dueDate: null as Date|null };
  visibleAddChantier: boolean = false;
  visibleAddPhase: boolean = false;
  visibleAddTask: boolean = false;
  visibleDeleteChantier: boolean = false;
  visibleDeletePhase: boolean = false;
  visibleDeleteTask: boolean = false;
  selectedChantierIndex: number = 0;
  selectedPhaseIndex: number = 0;
  selectedTaskIndex: number = 0;

  constructor() { }

  openAddChantier()   { this.visibleAddChantier = true; }
  cancelChantier()     { this.visibleAddChantier = false; }
  confirmChantier() {
    this.projets.push({
      title:          this.newChantier.title,
      client:         this.newChantier.client,
      address:        this.newChantier.address,
      start:          this.formatDate(this.newChantier.start),
      end:            this.formatDate(this.newChantier.end),
      globalProgress: 0,
      phases:         [],
      intervenants:   []
    });
    this.newChantier = { title:'', client:'', address:'', start:null, end:null };
    this.visibleAddChantier = false;
  }
  openAddPhase(ci: number)   {
    this.visibleAddPhase = true;
    this.selectedChantierIndex = ci;
  }
  cancelPhase()     { this.visibleAddPhase = false; }
  confirmPhase() {
    this.projets[this.selectedChantierIndex].phases.push({
      label:    this.newPhase.label,
      progress: 0,
      tasks:    []
    });
    this.newPhase = { label: '' };
    this.visibleAddPhase = false;
  }
  openAddTask(ci: number, pi: number)   {
    this.visibleAddTask = true;
    this.selectedChantierIndex = ci;
    this.selectedPhaseIndex = pi;
  }
  cancelTask()    { this.visibleAddTask = false; }
  confirmTask() {
    this.projets[this.selectedChantierIndex]
      .phases[this.selectedPhaseIndex]
      .tasks.push({
        label:   this.newTask.label,
        done:    false,
        dueDate: this.formatDate(this.newTask.dueDate)
      });
    this.newTask = { label: '', dueDate: null };
    this.visibleAddTask = false;
  }

  private formatDate(d: Date|null): string {
    if (!d) return '';
    return new Intl.DateTimeFormat('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric' }).format(d);
  }

  openDeleteChantier(ci: number) {
    this.selectedChantierIndex = ci;
    this.visibleDeleteChantier = true;
  }
  cancelDeleteChantier() {
    this.visibleDeleteChantier = false;
  }
  confirmDeleteChantier() {
    this.projets.splice(this.selectedChantierIndex, 1);
    this.visibleDeleteChantier = false;
  }

  openDeletePhase(ci: number, pi: number) {
    this.selectedChantierIndex = ci;
    this.selectedPhaseIndex    = pi;
    this.visibleDeletePhase    = true;
  }
  cancelDeletePhase() {
    this.visibleDeletePhase = false;
  }
  confirmDeletePhase() {
    this.projets[this.selectedChantierIndex]
        .phases.splice(this.selectedPhaseIndex, 1);
    this.visibleDeletePhase = false;
  }

  openDeleteTask(ci: number, pi: number, ti: number) {
    this.selectedChantierIndex = ci;
    this.selectedPhaseIndex    = pi;
    this.selectedTaskIndex     = ti;
    this.visibleDeleteTask     = true;
  }
  cancelDeleteTask() {
    this.visibleDeleteTask = false;
  }
  confirmDeleteTask() {
    this.projets[this.selectedChantierIndex]
        .phases[this.selectedPhaseIndex]
        .tasks.splice(this.selectedTaskIndex, 1);
    this.visibleDeleteTask = false;
  }
}

interface Task {
  label: string;
  done: boolean;
  dueDate?: string;      // date à faire
  doneDate?: string;     // date de fin
}

interface Phase {
  label: string;
  progress: number;      // 0–100
  statusLabel?: string;  // "En cours", "Retard", etc.
  tasks: Task[];
}

interface Chantier {
  title: string;
  client: string;
  address: string;
  start: string;
  end: string;
  globalProgress: number;
  phases: Phase[];
  intervenants: { avatar: string }[];
}