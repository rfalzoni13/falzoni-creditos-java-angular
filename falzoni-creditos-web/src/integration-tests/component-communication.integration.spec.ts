import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { SearchFormComponent } from '../app/components/search-form/search-form.component';
import { GridComponent } from '../app/components/grid/grid.component';
import { CreditDetailComponent } from '../app/components/credit-detail/credit-detail.component';
import { Credito } from '../app/models/credito.model';

describe('Integration Tests - Component Communication', () => {
  let searchFormComponent: SearchFormComponent;
  let searchFormFixture: ComponentFixture<SearchFormComponent>;
  
  let gridComponent: GridComponent;
  let gridFixture: ComponentFixture<GridComponent>;
  
  let creditDetailComponent: CreditDetailComponent;
  let creditDetailFixture: ComponentFixture<CreditDetailComponent>;

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
    await TestBed.configureTestingModule({
      imports: [
        SearchFormComponent,
        GridComponent,
        CreditDetailComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ]
    }).compileComponents();

    searchFormFixture = TestBed.createComponent(SearchFormComponent);
    searchFormComponent = searchFormFixture.componentInstance;
    
    gridFixture = TestBed.createComponent(GridComponent);
    gridComponent = gridFixture.componentInstance;
    
    creditDetailFixture = TestBed.createComponent(CreditDetailComponent);
    creditDetailComponent = creditDetailFixture.componentInstance;

    searchFormFixture.detectChanges();
    gridFixture.detectChanges();
    creditDetailFixture.detectChanges();
  });

  describe('SearchForm Component Communication', () => {
    it('should emit search data when form is submitted', () => {
      let emittedData: any = null;
      searchFormComponent.searchSubmitted.subscribe((data) => {
        emittedData = data;
      });

      searchFormComponent.searchForm.patchValue({
        searchType: 'nfse',
        searchValue: '67890'
      });
      searchFormComponent.onSubmit();

      expect(emittedData).toEqual({
        type: 'nfse',
        value: '67890'
      });
    });

    it('should emit different data for credit search', () => {
      let emittedData: any = null;
      searchFormComponent.searchSubmitted.subscribe((data) => {
        emittedData = data;
      });

      searchFormComponent.searchForm.patchValue({
        searchType: 'credito',
        searchValue: '12345'
      });
      searchFormComponent.onSubmit();

      expect(emittedData).toEqual({
        type: 'credito',
        value: '12345'
      });
    });

    it('should not emit when form is invalid', () => {
      
      let emittedData: any = null;
      searchFormComponent.searchSubmitted.subscribe((data) => {
        emittedData = data;
      });

      
      searchFormComponent.searchForm.patchValue({
        searchType: '',
        searchValue: '67890'
      });
      searchFormComponent.onSubmit();

      
      expect(emittedData).toBeNull();
    });
  });

  describe('Grid Component Communication', () => {
    it('should receive and display creditos data', () => {
      
      gridComponent.creditos = mockCreditoArray;
      gridFixture.detectChanges();

      
      expect(gridComponent.creditos).toEqual(mockCreditoArray);
      expect(gridComponent.creditos.length).toBe(1);
    });

    it('should emit back event when onBack is called', () => {
      
      let backEmitted = false;
      gridComponent.backEmitter.subscribe(() => {
        backEmitted = true;
      });

      
      gridComponent.onBack();

      
      expect(backEmitted).toBeTrue();
    });

    it('should handle empty creditos array', () => {
      
      gridComponent.creditos = [];
      gridFixture.detectChanges();

      
      expect(gridComponent.creditos).toEqual([]);
      expect(gridComponent.creditos.length).toBe(0);
    });

    it('should handle multiple creditos', () => {
      
      const multipleCreditos = [
        mockCredito,
        { ...mockCredito, numeroCredito: '54321', numeroNfse: '09876' }
      ];

      
      gridComponent.creditos = multipleCreditos;
      gridFixture.detectChanges();

      
      expect(gridComponent.creditos.length).toBe(2);
      expect(gridComponent.creditos).toEqual(multipleCreditos);
    });
  });

  describe('CreditDetail Component Communication', () => {
    it('should receive and display credito data', () => {
      
      creditDetailComponent.credito = mockCredito;
      creditDetailFixture.detectChanges();

      
      expect(creditDetailComponent.credito).toEqual(mockCredito);
    });

    it('should emit back event when onBack is called', () => {
      
      let backEmitted = false;
      creditDetailComponent.backEmitter.subscribe(() => {
        backEmitted = true;
      });

      
      creditDetailComponent.onBack();

      
      expect(backEmitted).toBeTrue();
    });

    it('should handle null credito', () => {
      
      creditDetailComponent.credito = null;
      creditDetailFixture.detectChanges();

      
      expect(creditDetailComponent.credito).toBeNull();
    });

    it('should update when credito changes', () => {
      
      creditDetailComponent.credito = mockCredito;
      creditDetailFixture.detectChanges();

      const newCredito = { ...mockCredito, numeroCredito: '99999' };

      
      creditDetailComponent.credito = newCredito;
      creditDetailFixture.detectChanges();

      
      expect(creditDetailComponent.credito).toEqual(newCredito);
      expect(creditDetailComponent.credito?.numeroCredito).toBe('99999');
    });
  });

  describe('Data Formatting Integration', () => {
    it('should format currency consistently across components', () => {
      
      const gridFormatted = gridComponent.formatCurrency(1234.56);
      
      
      const detailFormatted = creditDetailComponent.formatCurrency(1234.56);

      
      expect(gridFormatted).toEqual(detailFormatted);
      expect(gridFormatted).toContain('1.234,56');
    });

    it('should format percentage consistently across components', () => {
      
      const gridFormatted = gridComponent.formatPercentage(2.5);
      
      
      const detailFormatted = creditDetailComponent.formatPercentage(2.5);

      
      expect(gridFormatted).toEqual(detailFormatted);
      expect(gridFormatted).toBe('2.50%');
    });

    it('should format date consistently across components', () => {
      const testDate = new Date(2024, 0, 15);
      
      
      const gridFormatted = gridComponent.formatDate(testDate);
      
      
      const detailFormatted = creditDetailComponent.formatDate(testDate);

      
      expect(gridFormatted).toEqual(detailFormatted);
      expect(gridFormatted).toBe('15/01/2024');
    });
  });

  describe('Component Lifecycle Integration', () => {
    it('should handle component initialization properly', () => {
      
      expect(searchFormComponent).toBeTruthy();
      expect(gridComponent).toBeTruthy();
      expect(creditDetailComponent).toBeTruthy();
    });

    it('should maintain proper state after multiple interactions', () => {
      
      searchFormComponent.searchForm.patchValue({
        searchType: 'nfse',
        searchValue: '67890'
      });
      
      
      gridComponent.creditos = mockCreditoArray;
      
      
      creditDetailComponent.credito = mockCredito;
      
      
      expect(searchFormComponent.searchForm.valid).toBeTrue();
      expect(gridComponent.creditos.length).toBe(1);
      expect(creditDetailComponent.credito).toEqual(mockCredito);
    });
  });
});
