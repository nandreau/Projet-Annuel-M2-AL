import { Component } from '@angular/core';
import { IonicModule } from 'src/app/shared/ionic.module';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { PrimengModule } from 'src/app/shared/primeng.module';
import { FormsModule } from '@angular/forms';
import { Chantier, User } from 'src/app/models/global.model';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.page.html',
  styleUrls: ['./sites.page.scss'],
  standalone: true,
  imports: [IonicModule, PrimengModule, HeaderComponent, FormsModule],
})
export class SitesPage {
  user: User = {
    id: 1,
    firstname: 'Michael',
    name: 'youn',
    email: 'm@r',
    role: ['admin'],
    job: ['Chef'],
  };

  projets: Chantier[] = [
    {
      id: 1,
      title: 'Rénovation Appartement Paris 16',
      client: this.user,
      address: '25 rue de la Pompe, Paris',
      start: '14/04/2025',
      end: '18/06/2025',
      progress: 57,
      phases: [
        {
          id: 1,
          name: 'Phase 1 : Démolition',
          progress: 100,
          tasks: [
            {
              id: 1,
              name: 'Dépose des cloisons',
              done: true,
              doneDate: '18 avril 2025',
              tasks: [],
            },
            {
              id: 2,
              name: 'Enlèvement des gravats',
              done: true,
              doneDate: '17 avril 2025',
              tasks: [],
            },
          ],
        },
        {
          id: 2,
          name: 'Phase 2 : Electricité',
          progress: 30,
          tasks: [
            {
              id: 3,
              name: 'Pose des gaines électriques',
              done: false,
              dueDate: '18 avril 2025',
              tasks: [],
            },
            {
              id: 4,
              name: 'Pose des tableaux électriques',
              done: false,
              tasks: [],
            },
            {
              id: 5,
              name: 'Raccordements',
              done: false,
              dueDate: '18 avril 2025',
              tasks: [],
            },
          ],
        },
        {
          id: 3,
          name: 'Phase 3 : Peinture',
          progress: 0,
          tasks: [
            {
              id: 6,
              name: 'Préparation des murs',
              done: false,
              dueDate: '25 avril 2025',
              tasks: [],
            },
            {
              id: 7,
              name: 'Mise en peinture',
              done: false,
              dueDate: '27 avril 2025',
              tasks: [],
            },
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
      id: 2,
      title: 'Extension Maison Saint-Cloud',
      client: this.user,
      address: '8 avenue des Acacias, Saint-Cloud',
      start: '01/05/2025',
      end: '20/09/2025',
      progress: 18,
      phases: [
        {
          id: 4,
          name: 'Phase 1 : Terrassement',
          progress: 40,
          tasks: [
            {
              id: 8,
              name: 'Décapage du terrain',
              done: true,
              doneDate: '21 avril 2025',
              tasks: [],
            },
            {
              id: 9,
              name: 'Creusement des fondations',
              done: false,
              tasks: [],
            },
          ],
        },
        {
          id: 5,
          name: 'Phase 2 : Maçonnerie',
          progress: 0,
          tasks: [
            {
              id: 10,
              name: 'Élévation des murs porteurs',
              done: false,
              dueDate: '28 avril 2025',
              tasks: [],
            },
            {
              id: 11,
              name: 'Coulage de la dalle',
              done: false,
              dueDate: '24 avril 2025',
              tasks: [],
            },
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
    title: '',
    client: this.user as User,
    address: '',
    start: null as Date | null,
    end: null as Date | null,
  };
  newPhase = { name: '' };
  newTask = { name: '', dueDate: null as Date | null };
  visibleAddChantier: boolean = false;
  visibleAddPhase: boolean = false;
  visibleAddTask: boolean = false;
  visibleDeleteChantier: boolean = false;
  visibleDeletePhase: boolean = false;
  visibleDeleteTask: boolean = false;
  selectedChantierIndex: number = 0;
  selectedPhaseIndex: number = 0;
  selectedTaskIndex: number = 0;

  constructor() {}

  openAddChantier() {
    this.visibleAddChantier = true;
  }
  cancelChantier() {
    this.visibleAddChantier = false;
  }
  confirmChantier() {
    this.projets.push({
      id: 0,
      title: this.newChantier.title,
      client: this.newChantier.client,
      address: this.newChantier.address,
      start: this.formatDate(this.newChantier.start),
      end: this.formatDate(this.newChantier.end),
      progress: 0,
      phases: [],
      intervenants: [],
    });
    this.newChantier = {
      title: '',
      client: this.user,
      address: '',
      start: null,
      end: null,
    };
    this.visibleAddChantier = false;
  }
  openAddPhase(ci: number) {
    this.visibleAddPhase = true;
    this.selectedChantierIndex = ci;
  }
  cancelPhase() {
    this.visibleAddPhase = false;
  }
  confirmPhase() {
    this.projets[this.selectedChantierIndex].phases.push({
      id: 0,
      name: this.newPhase.name,
      progress: 0,
      tasks: [],
    });
    this.newPhase = { name: '' };
    this.visibleAddPhase = false;
  }
  openAddTask(ci: number, pi: number) {
    this.visibleAddTask = true;
    this.selectedChantierIndex = ci;
    this.selectedPhaseIndex = pi;
  }
  cancelTask() {
    this.visibleAddTask = false;
  }
  confirmTask() {
    this.projets[this.selectedChantierIndex].phases[
      this.selectedPhaseIndex
    ].tasks.push({
      id: 0,
      name: this.newTask.name,
      done: false,
      dueDate: this.formatDate(this.newTask.dueDate),
      tasks: [],
    });
    this.newTask = { name: '', dueDate: null };
    this.visibleAddTask = false;
  }

  private formatDate(d: Date | null): string {
    if (!d) return '';
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
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
    this.selectedPhaseIndex = pi;
    this.visibleDeletePhase = true;
  }
  cancelDeletePhase() {
    this.visibleDeletePhase = false;
  }
  confirmDeletePhase() {
    this.projets[this.selectedChantierIndex].phases.splice(
      this.selectedPhaseIndex,
      1,
    );
    this.visibleDeletePhase = false;
  }

  openDeleteTask(ci: number, pi: number, ti: number) {
    this.selectedChantierIndex = ci;
    this.selectedPhaseIndex = pi;
    this.selectedTaskIndex = ti;
    this.visibleDeleteTask = true;
  }
  cancelDeleteTask() {
    this.visibleDeleteTask = false;
  }
  confirmDeleteTask() {
    this.projets[this.selectedChantierIndex].phases[
      this.selectedPhaseIndex
    ].tasks.splice(this.selectedTaskIndex, 1);
    this.visibleDeleteTask = false;
  }
}
