import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicModule } from 'src/app/shared/ionic.module';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { Table } from 'primeng/table';
import { PrimengModule } from 'src/app/shared/primeng.module';
import { FormsModule } from '@angular/forms';
import { TableService } from 'src/app/services/table.service';
import { SortEvent } from 'primeng/api';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,
  imports: [IonicModule, PrimengModule, HeaderComponent, FormsModule]
})
export class HistoryPage implements OnInit {
  @ViewChild('dt') dt!: Table;

  historique: HistoriqueItem[] = [
    {
      description: 'Mise à jour du planning de fondation',
      phase: 'Fondation',
      chantier: 'Résidence Les Cèdres',
      etatPrecedent: 'En retard',
      etatActuel: 'Complété',
      executant: {
        name: 'Martin Dupont',
        role: 'Chef de chantier',
        avatar: 'assets/avatars/AV1.png'
      },
      date: '2019-02-09'
    },
    {
      description: 'Livraison de matériaux de construction',
      phase: 'Fondation',
      chantier: 'Immeuble Horizon',
      etatPrecedent: 'A faire',
      etatActuel: 'En cours',
      executant: {
        name: 'Sophie Laurent',
        role: 'Responsable logistique',
        avatar: 'assets/avatars/AV51.png'
      },
      date: '2017-05-13'
    },
    {
      description: 'Mise à jour du planning de fondation',
      phase: 'Fondation',
      chantier: 'Centre Commercial Étoile',
      etatPrecedent: 'En cours',
      etatActuel: 'Complété',
      executant: {
        name: 'Pierre Moreau',
        role: 'Responsable sécurité',
        avatar: 'assets/avatars/AV2.png'
      },
      date: '2020-09-15'
    },
    {
      description: 'Inspection de sécurité hebdomadaire',
      phase: 'Fondation',
      chantier: 'Résidence Les Cèdres',
      etatPrecedent: 'En cours',
      etatActuel: 'Complété',
      executant: {
        name: 'Julie Mercier',
        role: 'Architecte',
        avatar: 'assets/avatars/AV52.png'
      },
      date: '2016-05-20'
    },
    {
      description: 'Mise à jour du budget trimestriel',
      phase: 'Fondation',
      chantier: 'Immeuble Horizon',
      etatPrecedent: 'A faire',
      etatActuel: 'En cours',
      executant: {
        name: 'Thomas Bernard',
        role: 'Directeur financier',
        avatar: 'assets/avatars/AV3.png'
      },
      date: '2018-02-16'
    },
    {
      description: 'Réunion de coordination hebdomadaire',
      phase: 'Fondation',
      chantier: 'Centre Commercial Étoile',
      etatPrecedent: 'En retard',
      etatActuel: 'Complété',
      executant: {
        name: 'Lucie Petit',
        role: 'Chef de projet',
        avatar: 'assets/avatars/AV53.png'
      },
      date: '2015-09-13'
    }
  ];
  initialValues!: HistoriqueItem[];
  isSorted: boolean | null = null;

  constructor(private tableService: TableService) {}

  ngOnInit() {
    this.initialValues = [...this.historique];
  }

  /**
   * Retourne la sévérité PrimeNG en fonction de l’état
   */
  severity(etat: string): 'danger' | 'warning' | 'info' | 'success' {
    switch (etat) {
      case 'En retard': return 'danger';
      case 'A faire':   return 'warning';
      case 'En cours':  return 'info';
      case 'Complété':  return 'success';
      default:          return 'info';
    }
  }

  applyGlobalFilter(event: any) {
    const filter = (event.target as HTMLInputElement).value;
    this.tableService.applyGlobalFilter(this.dt, filter);
  }

  customSort(event: SortEvent) {
    this.isSorted = this.tableService.customSort(
      event,
      this.historique,
      this.initialValues,
      this.isSorted,
      this.dt
    );
  }
}

interface HistoriqueItem {
  description: string;
  phase: string;
  chantier: string;
  etatPrecedent: 'En retard' | 'A faire' | 'En cours';
  etatActuel: 'Complété' | 'En cours';
  executant: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string; // format YYYY-MM-DD
}
