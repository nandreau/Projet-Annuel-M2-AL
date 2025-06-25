import { Injectable } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { Table } from 'primeng/table';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  /**
   * Applique le filtre global PrimeNG
   */
  applyGlobalFilter(dt: Table, value: string): void {
    dt.filterGlobal(value, 'contains');
  }

  /**
   * Extrait dynamiquement un champ imbriqué
   */
  getFieldValue(data: any, field: string): any {
    return field
      .split('.')
      .reduce((acc, key) => (acc != null ? acc[key] : null), data);
  }

  /**
   * Tri "personnalisé" à 3 états : asc, desc, reset.
   * Retourne le nouvel état de tri (true/false/null).
   */
  customSort(
    event: SortEvent,
    data: any[],
    initialData: any[],
    isSorted: boolean | null,
    dt: Table
  ): boolean | null {
    if (isSorted == null) {
      isSorted = true;
      this.sortTableData(event);
    } else if (isSorted === true) {
      isSorted = false;
      this.sortTableData(event);
    } else {
      // reset
      isSorted = null;
      // remet les données initiales
      data.splice(0, data.length, ...initialData);
      dt.reset();
    }
    return isSorted;
  }

  /** 
   * Implémentation concrète du tri, utilitaire interne 
   */
  private sortTableData(event: SortEvent) {
    // Si data est absent, on sort de la méthode
    if (!event.data) {
      return;
    }

    event.data.sort((d1: any, d2: any) => {
      const v1 = this.getFieldValue(d1, event.field!);
      const v2 = this.getFieldValue(d2, event.field!);
      let res: number;

      if (v1 == null && v2 != null) res = -1;
      else if (v1 != null && v2 == null) res = 1;
      else if (v1 == null && v2 == null) res = 0;
      else if (typeof v1 === 'string' && typeof v2 === 'string')
        res = v1.localeCompare(v2);
      else
        res = v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

      return (event.order ?? 1) * res;
    });
  }

}
