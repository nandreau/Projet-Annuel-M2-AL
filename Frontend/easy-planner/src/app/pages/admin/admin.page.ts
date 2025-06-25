import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SortEvent } from 'primeng/api';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { TableService } from 'src/app/services/table.service';
import { IonicModule } from 'src/app/shared/ionic.module';
import { PrimengModule } from 'src/app/shared/primeng.module';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    HeaderComponent,
    PrimengModule,
    IconField,
    InputIcon,
    FormsModule,
  ],
})
export class AdminPage implements OnInit {
  @ViewChild('dt') dt!: Table;
  users = [
    {
      id: 1,
      name: 'James Butt',
      mail: 'James@gmail.com',
      date: '2015-09-13',
      role: 'PDG',
      droit: 'Admin',
    },
    {
      id: 2,
      name: 'Josephine Darakjy',
      mail: 'Josephine@gmail.com',
      date: '2019-02-09',
      role: 'Ressource Humaine',
      droit: 'Manager',
    },
    {
      id: 3,
      name: 'Donette Foller',
      mail: 'Donette@gmail.com',
      date: '2016-05-20',
      role: 'Plombier',
      droit: 'Artisan',
    },
  ];
  selectedUser!: User | null;
  selectedUsers!: User[] | null;
  initialValues!: User[];
  userForm!: User;
  isSorted: boolean | null = null;
  visibleAdd = false;
  visibleEdit = false;
  visibleDelete = false;

  constructor(private tableService: TableService) {
    this.resetUserForm();
  }

  ngOnInit() {
    this.initialValues = [...this.users];
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

  openAdd() {
    this.resetUserForm();
    this.visibleAdd = true;
  }

  openEdit() {
    if (this.selectedUsers?.length) {
      this.userForm = { ...this.selectedUsers[0] }; // ou gestion multi
      this.visibleEdit = true;
    }
  }

  openDelete() {
    this.visibleDelete = true;
  }

  confirm(modal: any, action: 'add' | 'edit' | 'delete') {
    if (action === 'add') {
      // todo
    }

    if (action === 'edit' && this.selectedUsers?.length) {
      const editedUser = { ...this.userForm };
      this.users = this.users.map((user) =>
        user.id === this.selectedUsers![0].id
          ? { ...user, ...editedUser }
          : user,
      );
    }

    if (action === 'delete' && this.selectedUsers?.length) {
      const idsToDelete = this.selectedUsers.map((user) => user.id);
      this.users = this.users.filter((user) => !idsToDelete.includes(user.id));
      this.selectedUsers = [];
    }

    this.resetUserForm();

    modal.dismiss();
  }

  resetUserForm() {
    this.userForm = {
      id: 0,
      name: '',
      mail: '',
      date: '',
      role: '',
      droit: '',
    };
  }
}

interface User {
  id: number;
  name: string;
  mail: string;
  date: string;
  role: string;
  droit: string;
}
