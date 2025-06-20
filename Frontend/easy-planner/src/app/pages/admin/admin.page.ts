import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SortEvent } from 'primeng/api';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { IonicModule } from 'src/app/shared/ionic.module';
import { PrimengModule } from 'src/app/shared/primeng.module';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [IonicModule, HeaderComponent, PrimengModule, IconField, InputIcon, FormsModule]
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
      droit: 'Admin'
    },
    {
      id: 2,
      name: 'Josephine Darakjy',
      mail: 'Josephine@gmail.com',
      date: '2019-02-09',
      role: 'Ressource Humaine',
      droit: 'Manager'
    },
    {
      id: 3,
      name: 'Donette Foller',
      mail: 'Donette@gmail.com',
      date: '2016-05-20',
      role: 'Plombier',
      droit: 'Artisan'
    }
  ];
  selectedUser!: User | null;
  selectedUsers!: User[] | null;
  initialValues!: User[];
  isSorted: boolean | null = null;

  constructor() { }

  ngOnInit() {
    this.initialValues = [...this.users];
  }

  applyGlobalFilter(event: any) {
    const value = (event.target as HTMLInputElement).value;
    this.dt.filterGlobal(value, 'contains');
  }

  getFieldValue(data: any, field: string) {
    return field.split('.').reduce((value, key) => value && value[key], data);
  }

  customSort(event: SortEvent) {
    if (this.isSorted == null || this.isSorted === undefined) {
      this.isSorted = true;
      this.sortTableData(event);
    } else if (this.isSorted === true) {
      this.isSorted = false;
      this.sortTableData(event);
    } else if (this.isSorted === false) {
      this.isSorted = null;
      this.users = [...this.initialValues];
      this.dt.reset();
    }
  }

  sortTableData(event: any) {
    event.data.sort((data1: any, data2: any) => {
      let value1 = this.getFieldValue(data1, event.field);
      let value2 = this.getFieldValue(data2, event.field);
      let result = null;

      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order * result;
    });
  }

  openAdd() {}

  openEdit() {}

  openDelete() {}
}


interface User {
  id: number,
  name: string,
  mail: string,
  date: string,
  role: string,
  droit: string
}