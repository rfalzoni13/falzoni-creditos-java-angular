import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';

import { MainComponent } from '../app/pages/main/main.component';
import { SearchFormComponent } from '../app/components/search-form/search-form.component';
import { GridComponent } from '../app/components/grid/grid.component';
import { CreditDetailComponent } from '../app/components/credit-detail/credit-detail.component';
import { SearchService } from '../app/services/credito.service';
import { Credito } from '../app/models/credito.model';

describe('Integration Tests - Main Flow', () => {
  let mainComponent: MainComponent;
  let mainFixture: ComponentFixture<MainComponent>;
  let searchService: jasmine.SpyObj<SearchService>;
  let spinnerService: jasmine.SpyObj<NgxSpinnerService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  const mockCredito: Credito = {
    numeroCredito: '12345',
    numeroNfse: '67890',
    dataConstituicao: new Date(2024, 0, 15),
    valorIssqn: 100.50,
    tipoCredito: 'PRINCIPAL',
    simplesNacional: true,
    aliquota: 2.5,
    valorFaturado: 5000.00,
    valorDeducao: 200.00,
    baseCalculo: 4800.00
  };

  const mockCreditoArray: Credito[] = [mockCredito];

  beforeEach(async () => {
    const searchServiceSpy = jasmine.createSpyObj('SearchService', ['getCreditByNfse', 'getCreditoByNumber']);
    const spinnerServiceSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide', 'getSpinner']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        MainComponent,
        SearchFormComponent,
        GridComponent,
        CreditDetailComponent,
        HttpClientTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: SearchService, useValue: searchServiceSpy },
        { provide: NgxSpinnerService, useValue: spinnerServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    mainFixture = TestBed.createComponent(MainComponent);
    mainComponent = mainFixture.componentInstance;
    searchService = TestBed.inject(SearchService) as jasmine.SpyObj<SearchService>;
    spinnerService = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  describe('Complete NFSe Search Flow', () => {
    it('should complete successful NFSe search flow', fakeAsync(() => {
      
      searchService.getCreditByNfse.and.returnValue(of(mockCreditoArray));

      
      const searchData = { type: 'nfse', value: '67890' };
      mainComponent.onSearchSubmitted(searchData);

      
      expect(spinnerService.show).toHaveBeenCalled();
      expect(searchService.getCreditByNfse).toHaveBeenCalledWith('67890');

      
      tick(1000);

      
      expect(mainComponent.creditos).toEqual(mockCreditoArray);
      expect(mainComponent.isReady).toBeTrue();

      tick(2000);
      expect(spinnerService.hide).toHaveBeenCalled();
    }));

    it('should handle NFSe search with no results', fakeAsync(() => {
      
      searchService.getCreditByNfse.and.returnValue(of([]));

      
      const searchData = { type: 'nfse', value: '67890' };
      mainComponent.onSearchSubmitted(searchData);

      tick(2000);

      
      expect(dialog.open).toHaveBeenCalledWith(jasmine.any(Function), {
        data: { title: 'Aviso', message: 'Nenhum crédito encontrado para o NFS-e informado.' }
      });
    }));

    it('should handle NFSe search error', fakeAsync(() => {
      
      const error = new Error('Erro ao efetivar a busca');
      searchService.getCreditByNfse.and.returnValue(throwError(() => error));

      
      const searchData = { type: 'nfse', value: '67890' };
      mainComponent.onSearchSubmitted(searchData);
      tick(2000); 

      
      expect(mainComponent.isReady).toBeTrue();
      expect(spinnerService.hide).toHaveBeenCalled();
      expect(dialog.open).toHaveBeenCalledWith(jasmine.any(Function), {
        data: { title: 'Erro', message: 'Erro ao efetivar a busca' }
      });
    }));
  });

  describe('Complete Credit Number Search Flow', () => {
    it('should complete successful credit number search flow', fakeAsync(() => {
      
      searchService.getCreditoByNumber.and.returnValue(of(mockCredito));

      
      const searchData = { type: 'credito', value: '12345' };
      mainComponent.onSearchSubmitted(searchData);

      
      expect(spinnerService.show).toHaveBeenCalled();
      expect(searchService.getCreditoByNumber).toHaveBeenCalledWith('12345');

      tick(1000);

      expect(mainComponent.credito).toEqual(mockCredito);
      expect(mainComponent.isReady).toBeTrue();

      tick(2000);
      expect(spinnerService.hide).toHaveBeenCalled();
    }));

    it('should handle credit not found error', fakeAsync(() => {
      
      const error = new Error('Crédito não encontrado');
      searchService.getCreditoByNumber.and.returnValue(throwError(() => error));

      
      const searchData = { type: 'credito', value: '12345' };
      mainComponent.onSearchSubmitted(searchData);

      tick(2000);

      
      expect(dialog.open).toHaveBeenCalledWith(jasmine.any(Function), {
        data: { title: 'Aviso', message: 'Crédito não encontrado' }
      });
    }));
  });

  describe('Grid and Detail Navigation', () => {
    it('should clear grid when back button is pressed', () => {
      
      mainComponent.creditos = mockCreditoArray;
      mainComponent.isReady = true;

      
      mainComponent.clearGrid();

      
      expect(mainComponent.creditos).toEqual([]);
      expect(mainComponent.isReady).toBeFalse();
    });

    it('should clear credit detail when back button is pressed', () => {
      
      mainComponent.credito = mockCredito;
      mainComponent.isReady = true;

      
      mainComponent.clearCard();

      
      expect(mainComponent.credito).toBeNull();
      expect(mainComponent.isReady).toBeFalse();
    });
  });

  describe('State Management', () => {
    it('should maintain correct state throughout search operations', fakeAsync(() => {
      
      expect(mainComponent.creditos).toEqual([]);
      expect(mainComponent.credito).toBeNull();
      expect(mainComponent.isReady).toBeFalse();

      
      setTimeout(() => {
        searchService.getCreditByNfse.and.returnValue(of(mockCreditoArray));
        mainComponent.onSearchSubmitted({ type: 'nfse', value: '67890' });
      }, 1000);

      
      tick(100);

      
      expect(mainComponent.creditos).toEqual([]);
      expect(mainComponent.isReady).toBeFalse();

      tick(2000);

      
      expect(mainComponent.creditos).toEqual(mockCreditoArray);
      expect(mainComponent.isReady).toBeTrue();
    }));

    it('should handle multiple consecutive searches correctly', fakeAsync(() => {
      
      searchService.getCreditByNfse.and.returnValue(of(mockCreditoArray));
      mainComponent.onSearchSubmitted({ type: 'nfse', value: '67890' });
      tick(3000);

      expect(mainComponent.creditos).toEqual(mockCreditoArray);
      expect(mainComponent.isReady).toBeTrue();

      
      mainComponent.clearGrid();

      
      const newMockCredito = { ...mockCredito, numeroCredito: '54321' };

      
      setTimeout(() => {
        searchService.getCreditByNfse.and.returnValue(of([newMockCredito]));
        mainComponent.onSearchSubmitted({ type: 'nfse', value: '12345' });
      }, 1000);

      
      tick(100);

      
      expect(mainComponent.creditos).toEqual([]);
      expect(mainComponent.isReady).toBeFalse();

      tick(3000);

      
      expect(mainComponent.creditos).toEqual([newMockCredito]);
      expect(mainComponent.isReady).toBeTrue();
    }));
  });
});
