import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { ApiResponse, Problem, ProblemMessage } from 'src/app/models/global.model';
import { IonicModule } from 'src/app/shared/ionic.module';
import { PrimengModule } from 'src/app/shared/primeng.module';
import { RequestService } from 'src/app/services/request.service';
import { addIcons } from 'ionicons';
import { camera } from 'ionicons/icons';
import { firstValueFrom } from 'rxjs';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-problems',
  templateUrl: './problems.page.html',
  styleUrls: ['./problems.page.scss'],
  standalone: true,
  imports: [IonicModule, PrimengModule, HeaderComponent, FormsModule],
})
export class ProblemsPage implements OnInit {
  problems: Problem[] = [];
  filteredProblems: Problem[] = [];
  chantierOptions: { label: string; value: string | null }[] = [];
  selectedChantier: string | null = null;

  // dropdown options
  urgencyOptions = [
    { label: 'Urgent', value: 'Urgent' },
    { label: 'Moyen', value: 'Moyen' },
    { label: 'Faible', value: 'Faible' },
  ];
  statusOptions = [
    { label: 'En cours', value: 'En cours' },
    { label: 'Non résolu', value: 'Non résolu' },
    { label: 'Résolu', value: 'Résolu' },
  ];

  newComments: { [problemId: number]: string } = {};

  activeProblem: number = 0;

  constructor(private request: RequestService) {
    addIcons({ camera });
  }

  ngOnInit() {
    this.loadProblems();
  }

  private loadProblems(): void {
    this.request.get<Problem[]>('api/problems', false).subscribe({
      next: (data) => {
        this.problems = data;
        console.log(data)
        const titres = Array.from(new Set(data.map(p => p.chantier)));
        this.chantierOptions = [
          { label: 'Tous les chantiers', value: null },
          ...titres.map(t => ({ label: t, value: t }))
        ];
        this.filteredProblems = [...this.problems];
      },
      error: (err) => console.error('Erreur chargement problèmes', err),
    });
  }

  onChantierChange() {
    if (this.selectedChantier) {
      this.filteredProblems = this.problems
        .filter(p => p.chantier === this.selectedChantier);
    } else {
      this.filteredProblems = [...this.problems];
    }
  }

  async sendMessage(problem: Problem) {
    const content = this.newComments[problem.id]?.trim();
    if (!content) {
      return;
    }

    const payload = {
      problemId: problem.id,
      content
    };

    try {
      const result: ApiResponse = await firstValueFrom(
        this.request.post(
          'api/problemMessages',
          payload,
          true
        )
      );
      problem.problem_messages = problem.problem_messages || [];
      problem.problem_messages.push(result.data);

      this.newComments[problem.id] = '';
    } catch (err) {
      console.error('Échec envoi message', err);
    }
  }

  updateProblem(problem: Problem) {
    const payload = {
      urgency: problem.urgency,
      status: problem.status,
      images: problem.images,
    };
    this.request.put(`api/problems/${problem.id}/meta`, payload, true).subscribe({
      next: () => console.log('Problème mis à jour'),
      error: err => console.error('Échec mise à jour', err)
    });
  }

  addPhoto(event: Event, problem: Problem) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      problem.images = problem.images || [];
      problem.images.push(url);
      this.updateProblem(problem);
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  onFileUpload(
    event: { files: File[] },
    problem: Problem,
    fileUpload: FileUpload
  ) {
    for (const file of event.files) {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        problem.images = problem.images || [];
        problem.images.push(url);
        this.updateProblem(problem);
      };
      reader.readAsDataURL(file);
    }
    fileUpload.clear();
  }

  removePhoto(problem: Problem, index: number) {
    if (!problem.images) return;
    problem.images.splice(index, 1);
    this.updateProblem(problem);
  }

  groupMessages(messages: any[]) {
    const grouped: Array<any> = [];
    let currentGroup: any = null;
    let lastuser: any = null;
    let nextSide = 'right';

    for (const msg of messages) {
      if (msg.user.id !== lastuser) {
        nextSide = nextSide === 'left' ? 'right' : 'left';
        currentGroup = {
          user: msg.user,
          createdAt: msg.createdAt,
          side: nextSide,
          contents: [msg.content],
        };
        grouped.push(currentGroup);
        lastuser = msg.user.id;
      } else if (currentGroup) {
        currentGroup.contents.push(msg.content);
      }
    }
    return grouped;
  }
}
