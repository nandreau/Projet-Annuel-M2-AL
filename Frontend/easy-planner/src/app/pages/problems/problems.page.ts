import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { Problem } from 'src/app/models/global.model';
import { IonicModule } from 'src/app/shared/ionic.module';
import { PrimengModule } from 'src/app/shared/primeng.module';

@Component({
  selector: 'app-problems',
  templateUrl: './problems.page.html',
  styleUrls: ['./problems.page.scss'],
  standalone: true,
  imports: [IonicModule, PrimengModule, HeaderComponent, FormsModule],
})
export class ProblemsPage {
  problems: Problem[] = [
    {
      id:1,
      title: "Fuite d'eau au niveau du 2ème étage",
      urgency: 'Urgent',
      chantier: 'Résidence Bellevue',
      phase: 'Plomberie',
      task: 'Réparation de canalisation',
      date: '29 Mai 2025',
      status: 'En cours',
      description: `Une fuite d'eau importante a été détectée...`,
      images: ['Photo de la fuite', 'Photo des dégâts'],
      messages: [
        {
          id:1,
          sender:  {
            id: 1,
            firstname: 'Michel',
            name: 'Dupont',
            mail: 'Michel@gmail.com',
            date: '2015-09-13',
            role: ['PDG'],
            droit: 'Admin',
            avatar: "AV1.png"
          },
          date: '28 Mai 2025, 14:30',
          content: "J'ai constaté la fuite ce matin...",
        },
        {
          id:2,
          sender:  {
            id: 1,
            firstname: 'Sophie',
            name: 'Dupont',
            mail: 'Martin@gmail.com',
            date: '2015-09-13',
            role: ['PDG'],
            droit: 'Admin',
            avatar: "AV1.png"
          },
          date: '28 Mai 2025, 16:45',
          content: "J'ai fermé l'arrivée d'eau principale...",
        },
        {
          id:3,
          sender:  {
            id: 1,
            firstname: 'Sophie',
            name: 'Sauvage',
            mail: 'Sophie@gmail.com',
            date: '2015-09-13',
            role: ['PDG'],
            droit: 'Admin',
            avatar: "AV1.png"
          },
          date: '28 Mai 2025, 16:46',
          content: "Et J'ai également coupé l'electricité",
        },
        {
          id:4,
          sender:  {
            id: 1,
            firstname: 'Pierre',
            name: 'Leroy',
            mail: 'Pierre@gmail.com',
            date: '2015-09-13',
            role: ['PDG'],
            droit: 'Admin',
            avatar: "AV1.png"
          },
          date: '29 Mai 2025, 09:15',
          content: "Je vais passer avec l'équipe de plomberie...",
        },
      ],
    },
    {
      id:2,
      title: "Problème d'installation électrique - Appartement 105",
      urgency: 'Moyen',
      chantier: 'Résidence Bellevue',
      phase: 'Électricité',
      task: 'Vérification du disjoncteur',
      date: '27 Mai 2025',
      status: 'Non résolu',
      description: `Un problème d'installation a été détecté dans l'appartement 105...`,
      images: [],
      messages: [],
    },
  ];
  comment: string = '';
  activeProblem: number = 0;

  constructor() {}

  onComment() {
    console.log('Commentaire envoyé :', this.comment);
    this.comment = '';
  }

  groupMessages(messages: any[]) {
    const grouped = [];
    let currentGroup: any = null;
    let lastSender = null;
    let nextSide = 'right';

    for (const msg of messages) {
      if (msg.sender !== lastSender) {
        nextSide = nextSide === 'left' ? 'right' : 'left';

        currentGroup = {
          sender: msg.sender,
          date: msg.date,
          side: nextSide,
          contents: [msg.content],
        };

        grouped.push(currentGroup);
        lastSender = msg.sender;
      } else if (currentGroup) {
        currentGroup.contents.push(msg.content);
      }
    }

    return grouped;
  }
}
