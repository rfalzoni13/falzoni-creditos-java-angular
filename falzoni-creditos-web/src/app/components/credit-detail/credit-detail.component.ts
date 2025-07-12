import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Credito } from '../../models/credito.model';
import { formatCurrency, formatPercentage, formatDate } from '../../../utils/helpers';

@Component({
  selector: 'app-credit-detail',
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './credit-detail.component.html',
  styleUrl: './credit-detail.component.scss'
})
export class CreditDetailComponent {
  @Input() credito: Credito | null = null;
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
