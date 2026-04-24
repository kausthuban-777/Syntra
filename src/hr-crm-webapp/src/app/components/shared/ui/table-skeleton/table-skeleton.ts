import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-skeleton',
  imports: [CommonModule],
  templateUrl: './table-skeleton.html',
  styleUrl: './table-skeleton.css'
})
export class TableSkeleton {
  @Input() set rows(value: number) {
    this._rows.set(value);
  }

  @Input() set columns(value: number) {
    this._columns.set(value);
  }

  private _rows = signal(5);
  private _columns = signal(6);

  rowsArray = computed(() => Array.from({ length: this._rows() }, (_, i) => i));
  columnsArray = computed(() => Array.from({ length: this._columns() }, (_, i) => i));
}
