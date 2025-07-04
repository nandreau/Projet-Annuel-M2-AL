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
      status: 'En cours',
      description: `Une fuite d'eau importante a été détectée...`,
      user: {
        id: 1,
        firstname: 'Michel',
        name: 'Dupont',
        email: 'Michel@gmail.com',
        role: ['admin'],
        job: ['PDG'],
        avatar: "AV1.png"
      },
      images: ['Photo de la fuite', 'Photo des dégâts'],
      messages: [
        {
          id:1,
          user:  {
            id: 1,
            firstname: 'Michel',
            name: 'Dupont',
            email: 'Michel@gmail.com',
            role: ['admin'],
            job: ['PDG'],
            avatar: "AV1.png"
          },
          content: "J'ai constaté la fuite ce matin...",
        },
        {
          id:2,
          user:  {
            id: 1,
            firstname: 'Sophie',
            name: 'Dupont',
            email: 'Martin@gmail.com',
            role: ['admin'],
            job: ['PDG'],
            avatar: "AV1.png"
          },
          content: "J'ai fermé l'arrivée d'eau principale...",
        },
        {
          id:3,
          user:  {
            id: 1,
            firstname: 'Sophie',
            name: 'Sauvage',
            email: 'Sophie@gmail.com',
            role: ['admin'],
            job: ['PDG'],
            avatar: "AV1.png"
          },
          content: "Et J'ai également coupé l'electricité",
        },
        {
          id:4,
          user:  {
            id: 1,
            firstname: 'Pierre',
            name: 'Leroy',
            email: 'Pierre@gmail.com',
            role: ['admin'],
            job: ['PDG'],
            avatar: "AV1.png"
          },
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
      status: 'Non résolu',
      description: `Un problème d'installation a été détecté dans l'appartement 105...`,
      user: {
        id: 1,
        firstname: 'Michel',
        name: 'Dupont',
        email: 'Michel@gmail.com',
        role: ['admin'],
        job: ['PDG'],
        avatar: "AV1.png"
      },
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
      if (msg.user !== lastSender) {
        nextSide = nextSide === 'left' ? 'right' : 'left';

        currentGroup = {
          sender: msg.user,
          createdAt: "11 juillet 2021",
          side: nextSide,
          contents: [msg.content],
        };

        grouped.push(currentGroup);
        lastSender = msg.user;
      } else if (currentGroup) {
        currentGroup.contents.push(msg.content);
      }
    }

    return grouped;
  }
}
