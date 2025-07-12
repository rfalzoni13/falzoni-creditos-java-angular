import { Component, inject } from '@angular/core';
import { SearchFormComponent } from '../../components/search-form/search-form.component';
import { GridComponent } from '../../components/grid/grid.component';
import { CreditDetailComponent } from '../../components/credit-detail/credit-detail.component';
import { SearchService } from '../../services/credito.service';
import { Credito } from '../../models/credito.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../components/dialog/dialog.component';

@Component({
  selector: 'app-main',
  imports: [
    CommonModule,
    MatButtonModule,
    SearchFormComponent,
    GridComponent,
    CreditDetailComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  creditos: Credito[] = [];
  credito: Credito | null = null;
  isReady: boolean = false;

  readonly dialog = inject(MatDialog);

  constructor(private searchService: SearchService, private spinner: NgxSpinnerService) { }

  onSearchSubmitted(searchData: any): void {
    this.showSpinner();

    if (searchData.type === "nfse") {
      this.searchByNFse(searchData.value);
    } else {
      this.searchByNumeroCredito(searchData.value);
    }
  }

  private searchByNFse(numeroNfse: string): void {
    this.isReady = false;
    this.creditos = [];

    this.searchService.getCreditByNfse(numeroNfse).subscribe({
      next: (result) => {
        if (result.length === 0) {
          setTimeout(() => {
            this.showDialog("Aviso", "Nenhum crédito encontrado para o NFS-e informado.");
            return;
          }, 1000);
        }
        this.creditos = result;
      },
      error: (error) => {
        console.error('Erro na pesquisa:', error);
        this.isReady = true;
        this.showDialog("Erro", error.message);
        this.hideSpinner();
      },
      complete: () => {
        this.hideSpinner();
        this.isReady = true;
      }
    });
  }

  private searchByNumeroCredito(numeroCredito: string): void {
    this.searchService.getCreditoByNumber(numeroCredito).subscribe({
      next: (result) => {
        setTimeout(() => {
          console.log(result);
          this.credito = result;
        }, 1000);
      },
      error: (error) => {
        console.error('Erro na pesquisa:', error);
        this.hideSpinner();
        const errorTitle: string = error.message === "Crédito não encontrado" ? "Aviso" : "Erro";

        this.showDialog(errorTitle, error.message);
        this.isReady = true;
      },
      complete: () => {
        this.hideSpinner();
        this.isReady = true;
      }
    });
  }

  clearGrid(): void {
    this.creditos = [];
    this.isReady = false;
  }

  clearCard(): void {
    this.credito = null;
    this.isReady = false;
  }

  private showDialog(title: string, message: string) {
    setTimeout(() => {
      this.dialog.open(DialogComponent, {
        data: { title, message }
      });
    }, 1000);
  }

  private showSpinner() {
    this.spinner.show();
  }

  private hideSpinner() {
    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
  }
}
