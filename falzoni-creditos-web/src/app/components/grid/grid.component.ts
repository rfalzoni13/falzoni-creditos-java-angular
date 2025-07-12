import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Credito } from '../../models/credito.model';
import { formatCurrency, formatPercentage, formatDate } from '../../../utils/helpers';

@Component({
  selector: 'app-grid',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent {
  displayedColumns: string[] = [
    'numeroCredito',
    'numeroNfse',
    'dataConstituicao',
    'valorIssqn',
    'tipoCredito',
    'simplesNacional',
    'aliquota',
    'valorFaturado',
    'valorDeducao',
    'baseCalculo'
  ];

  @Input() creditos: Credito[] = [];
  @Output() backEmitter = new EventEmitter();

  formatCurrency(value: number): string {
    return formatCurrency(value);
  }

  formatPercentage(value: number): string {
    return formatPercentage(value);
  }

  formatDate(date: Date): string {
    return formatDate(date);
  }

  onBack(): void {
    this.backEmitter.emit();
  }
}
