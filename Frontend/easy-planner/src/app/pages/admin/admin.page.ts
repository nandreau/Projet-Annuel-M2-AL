import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { SortEvent } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { User, Role, FormField } from 'src/app/models/global.model';
import { RequestService } from 'src/app/services/request.service';
import { TableService } from 'src/app/services/table.service';

import { HeaderComponent } from 'src/app/components/header/header.component';

import { IonicModule } from 'src/app/shared/ionic.module';
import { PrimengModule } from 'src/app/shared/primeng.module';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from 'src/app/components/confirm-modal/confirm-modal.component';
import { DynamicFormModalComponent } from 'src/app/components/dynamic-form-modal/dynamic-form-modal.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    HeaderComponent,
    IonicModule,
    PrimengModule,
    FormsModule,
    DynamicFormModalComponent,
    ConfirmModalComponent,
  ],
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  @ViewChild('dt') dt!: Table;

  users: User[] = [];
  availableRoles: Role[] = [];
  selectedUsers: User[] = [];
  userForm!: User;
  initialValues: User[] = [];
  isSorted: boolean | null = null;

  visibleAdd = false;
  visibleEdit = false;
  visibleDelete = false;

  // field definitions
  private allFields: FormField<User>[] = [];
  addFields: FormField<User>[] = [];
  editFields: FormField<User>[] = [];

  constructor(
    private tableService: TableService,
    private request: RequestService,
  ) {
    this.resetUserForm();
  }

  async ngOnInit() {
    await this.loadRoles();
    await this.loadUsers();
    this.defineFields();
  }

  private loadUsers(): Promise<void> {
    this.selectedUsers = [];
    return firstValueFrom(this.request.get<User[]>('api/users'))
      .then((data) => {
        this.users = data.map((user) => ({
          ...user,
          rolesString: user.roles.map((r) => r.name).join(' '),
        }));
        this.initialValues = [...this.users];
      })
      .catch((err) => {
        console.error('Erreur chargement utilisateurs', err);
      });
  }

  private loadRoles(): Promise<void> {
    return firstValueFrom(this.request.get<Role[]>('api/roles'))
      .then((data) => {
        this.availableRoles = data;
      })
      .catch((err) => {
        console.error('Erreur chargement roles', err);
      });
  }

  private defineFields() {
    this.allFields = [
      { key: 'firstname', label: 'Prénom', type: 'text', placeholder: '' },
      { key: 'name', label: 'Nom', type: 'text', placeholder: '' },
      {
        key: 'roles',
        label: 'Rôles',
        type: 'multiselect',
        options: this.availableRoles,
        optionLabel: 'name',
        placeholder: 'Sélectionner des rôles',
      },
      {
        key: 'job',
        label: 'Métier',
        type: 'chips',
        placeholder: 'Ajouter un métier',
      },
      { key: 'email', label: 'Email', type: 'email', placeholder: '' },
      {
        key: 'password',
        label: 'Mot de passe',
        type: 'password',
        placeholder: '',
      },
    ];

    this.addFields = [...this.allFields];
    this.editFields = this.allFields.filter((f) => f.key !== 'password');
  }

  applyGlobalFilter(event: any) {
    const filter = (event.target as HTMLInputElement).value;
    this.tableService.applyGlobalFilter(this.dt, filter);
  }

  customSort(event: SortEvent) {
    this.isSorted = this.tableService.customSort(
      event,
      this.users,
      this.initialValues,
      this.isSorted,
      this.dt,
    );
  }

  // opening dialogs
  openAdd() {
    this.resetUserForm();
    this.visibleAdd = true;
  }

  openEdit() {
    if (this.selectedUsers.length === 1) {
      this.userForm = { ...this.selectedUsers[0] };
      this.visibleEdit = true;
    }
  }

  openDelete() {
    if (this.selectedUsers.length > 0) {
      this.visibleDelete = true;
    }
  }

  // handlers for modal outputs
  async handleAdd(u: User) {
    await firstValueFrom(
      this.request.post(
        'api/users',
        {
          ...u,
          roles: u.roles.map((r) => r.name),
        },
        true,
      ),
    );
    this.visibleAdd = false;
    await this.loadUsers();
  }

  async handleEdit(u: User) {
    await firstValueFrom(
      this.request.put(
        `api/users/${u.id}`,
        {
          ...u,
          roles: u.roles.map((r) => r.name),
        },
        true,
      ),
    );
    this.visibleEdit = false;
    await this.loadUsers();
  }

  async handleDelete() {
    await Promise.all(
      this.selectedUsers.map((u) =>
        firstValueFrom(this.request.delete(`api/users/${u.id}`, true)),
      ),
    );
    this.visibleDelete = false;
    await this.loadUsers();
  }

  private resetUserForm() {
    this.userForm = {
      id: 0,
      firstname: '',
      name: '',
      email: '',
      password: '',
      roles: [],
      job: [],
      avatar: '',
    };
  }
}
