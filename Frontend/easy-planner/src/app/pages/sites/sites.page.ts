// src/app/pages/sites/sites.page.ts
import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Chantier, FormField, Phase, Task, User } from 'src/app/models/global.model';
import { RequestService } from 'src/app/services/request.service';

import { IonicModule } from 'src/app/shared/ionic.module';
import { PrimengModule } from 'src/app/shared/primeng.module';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { DynamicFormModalComponent } from 'src/app/components/dynamic-form-modal/dynamic-form-modal.component';
import { ConfirmModalComponent } from 'src/app/components/confirm-modal/confirm-modal.component';
import { FormsModule } from '@angular/forms';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-sites',
  standalone: true,
  imports: [
    IonicModule,
    PrimengModule,
    HeaderComponent,
    FormsModule,
    DynamicFormModalComponent,
    ConfirmModalComponent,
  ],
  templateUrl: './sites.page.html',
  styleUrls: ['./sites.page.scss'],
})
export class SitesPage implements OnInit {
  chantiers: Chantier[] = [];
  chantierOptions: { label: string; value: number }[] = [];
  filteredChantierIndex = 0;
  filteredChantier!: Chantier;
  clients: User[] = [];

  /** Modals Chantier */
  visibleAddChantier = false;
  visibleDeleteChantier = false;
  newChantier = { title: '', address: '', start: null as Date|null, end: null as Date|null };
  selectedChantierIndex = 0;

  /** Modals Phase */
  visibleAddPhase = false;
  visibleDeletePhase = false;
  newPhase = { name: '' };
  selectedPhaseIndex = 0;

  /** Modals Task */
  visibleAddTask = false;
  visibleDeleteTask = false;
  newTask = { name: '', dueDate: null as Date|null };
  selectedTaskIndex = 0;

  selectedChantierName: string = '';
  selectedPhaseName: string = '';
  selectedTaskName: string = '';

  /** Dynamic Form definitions */
  chantierFields: FormField<any>[] = [];
  phaseFields: FormField<any>[] = [];
  taskFields: FormField<any>[] = [];

  constructor(private request: RequestService, public utils: UtilitiesService) {}

  async ngOnInit() {
    await Promise.all([
      this.loadClients(),
      this.loadChantiers()
    ]);
    this.loadFields();
  }

  /** Charge uniquement les users qui ont le rôle "client" */
  private async loadClients() {
    try {
      const allUsers = await firstValueFrom(
        this.request.get<User[]>('api/users')
      );
      this.clients = allUsers
        .filter(u => u.roles.some(r => r.name === 'client'))
        .map(u => ({
          ...u,
          fullname: `${u.firstname} ${u.name}`
        }));
    } catch (err) {
      console.error('Erreur chargement clients', err);
    }
  }

  /** Récupère la liste complète de l’API */
  private async loadChantiers() {
    try {
      this.chantiers = await firstValueFrom(
        this.request.get<Chantier[]>('api/chantiers')
      );
      this.chantiers = await firstValueFrom(
        this.request.get<Chantier[]>('api/chantiers')
      );
      this.chantierOptions = this.chantiers
        .map((ct, idx) => ({ label: ct.title, value: idx }));
      if (this.chantiers.length > 0) {
        this.filteredChantierIndex = 0;
        this.filteredChantier = this.chantiers[0];
      }
    } catch (err) {
      console.error('Erreur chargement chantiers', err);
    }
  }

  private loadFields() {
    this.chantierFields = [
      { key: 'title',   label: 'Titre',       type: 'text',  placeholder: 'Titre du chantier' },
      { key: 'address', label: 'Adresse',     type: 'text',  placeholder: 'Adresse' },
      { key: 'start',   label: 'Début',       type: 'date',  placeholder: '' },
      { key: 'end',     label: 'Fin estimée', type: 'date',  placeholder: '' },
      {
        key: 'clientId',
        label: 'Client',
        type: 'select',
        options: this.clients,
        optionValue: 'id',
        optionLabel: 'fullname',
        placeholder: 'Sélectionner un client'
      },
    ];
    this.phaseFields = [
      { key: 'name', label: 'Nom de phase', type: 'text', placeholder: 'Nom de la phase' },
    ];
    this.taskFields = [
      { key: 'name',    label: 'Libellé',   type: 'text', placeholder: 'Nom de la tâche' },
      { key: 'dueDate', label: 'Date cible', type: 'date', placeholder: '' },
    ];

  }

  onChantierChange() {
    this.filteredChantier = this.chantiers[this.selectedChantierIndex];
  }

  // ----- Chantier -----

  openAddChantier() {
    this.newChantier = { title: '', address: '', start: null, end: null };
    this.visibleAddChantier = true;
  }

  async handleAddChantier(ch: any) {
    try {
      await firstValueFrom(
        this.request.post('api/chantiers', {
          title:   ch.title,
          address: ch.address,
          start:   ch.start,
          end:     ch.end,
          clientId: ch.clientId 
        }, true)
      );
      this.visibleAddChantier = false;
      await this.loadChantiers();
    } catch (err) {
      console.error('Erreur ajout chantier', err);
    }
  }

  openDeleteChantier(ch: number) {
    this.selectedChantierIndex  = ch;
    this.selectedChantierName = this.chantiers[ch].title;
    this.visibleDeleteChantier = true;
  }

  async confirmDeleteChantier() {
    try {
      await firstValueFrom(
        this.request.delete(`api/chantiers/${this.chantiers[this.selectedChantierIndex].id}`, true)
      );
      this.visibleDeleteChantier = false;
      await this.loadChantiers();
    } catch (err) {
      console.error('Erreur suppression chantier', err);
    }
  }

  // ----- Phase via API -----

  openAddPhase(chIndex: number) {
    this.selectedChantierIndex = chIndex;
    this.newPhase = { name: '' };
    this.visibleAddPhase = true;
  }

  async handleAddPhase(p: { name: string }) {
    try {
      await firstValueFrom(
        this.request.post('api/phases', {
          name: p.name,
          chantierId: this.chantiers[this.selectedChantierIndex].id
        }, true)
      );
      this.visibleAddPhase = false;
      await this.loadChantiers();
    } catch (err) {
      console.error('Erreur ajout phase', err);
    }
  }

  openDeletePhase(chIndex: number, phaseIndex: number) {
    this.selectedChantierIndex = chIndex;
    this.selectedPhaseIndex    = phaseIndex;
    this.selectedPhaseName     = this.chantiers[chIndex].phases[phaseIndex].name;
    this.visibleDeletePhase    = true;
  }

  async confirmDeletePhase() {
    try {
      const phase = this.chantiers[this.selectedChantierIndex].phases[this.selectedPhaseIndex];
      await firstValueFrom(
        this.request.delete(`api/phases/${phase.id}`, true)
      );
      this.visibleDeletePhase = false;
      await this.loadChantiers();
    } catch (err) {
      console.error('Erreur suppression phase', err);
    }
  }

  // ----- Task via API -----

  openAddTask(chIndex: number, phaseIndex: number) {
    this.selectedChantierIndex = chIndex;
    this.selectedPhaseIndex    = phaseIndex;
    this.newTask = { name: '', dueDate: null };
    this.visibleAddTask = true;
  }

  async handleAddTask(t: { name: string, dueDate: Date|null }) {
    console.log(t.dueDate,t.name)
    try {
      const payload = {
        name:    t.name,
        done:    false,
        dueDate: t.dueDate ? t.dueDate.toISOString() : null,
        phaseId: this.chantiers[this.selectedChantierIndex]
                        .phases[this.selectedPhaseIndex].id
      };

      await firstValueFrom(
        this.request.post('api/tasks', payload, true)
      );

      this.visibleAddTask = false;
      await this.loadChantiers();
    } catch (err) {
      console.error('Erreur ajout tâche', err);
    }
  }


  openDeleteTask(chIndex: number, phaseIndex: number, taskIndex: number) {
    this.selectedChantierIndex = chIndex;
    this.selectedPhaseIndex    = phaseIndex;
    this.selectedTaskIndex     = taskIndex;
    this.selectedTaskName      = this.chantiers[chIndex].phases[phaseIndex].tasks[taskIndex].name;
    this.visibleDeleteTask     = true;
  }

  async confirmDeleteTask() {
    try {
      const task = this.chantiers[this.selectedChantierIndex]
                          .phases[this.selectedPhaseIndex]
                          .tasks[this.selectedTaskIndex];
      await firstValueFrom(
        this.request.delete(`api/tasks/${task.id}`, true)
      );
      this.visibleDeleteTask = false;
      await this.loadChantiers();
    } catch (err) {
      console.error('Erreur suppression tâche', err);
    }
  }
}
