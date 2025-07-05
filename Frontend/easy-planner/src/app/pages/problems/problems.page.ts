import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { Problem } from 'src/app/models/global.model';
import { IonicModule } from 'src/app/shared/ionic.module';
import { PrimengModule } from 'src/app/shared/primeng.module';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-problems',
  templateUrl: './problems.page.html',
  styleUrls: ['./problems.page.scss'],
  standalone: true,
  imports: [IonicModule, PrimengModule, HeaderComponent, FormsModule],
})
export class ProblemsPage implements OnInit {
  problems: Problem[] = [];
  comment: string = '';
  activeProblem: number = 0;

  constructor(private request: RequestService) {}

  ngOnInit() {
    this.loadProblems();
  }

  private loadProblems(): void {
    this.request.get<Problem[]>('api/problems', false).subscribe({
      next: (data) => (this.problems = data),
      error: (err) => console.error('Erreur chargement problèmes', err),
    });
  }

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
          createdAt: '11 juillet 2021',
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
