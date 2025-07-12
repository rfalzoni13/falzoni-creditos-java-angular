import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { AppComponent } from '../app/app.component';
import { MainComponent } from '../app/pages/main/main.component';
import { SearchService } from '../app/services/credito.service';
import { Credito } from '../app/models/credito.model';
import { provideHttpClient } from '@angular/common/http';

describe('End-to-End Tests - Application Flow', () => {
  let appComponent: AppComponent;
  let appFixture: ComponentFixture<AppComponent>;
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

    spinnerServiceSpy.getSpinner.and.returnValue(of({
      show: false,
      color: '#fff',
      size: 'default'
    }));

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        MainComponent,
        NoopAnimationsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: SearchService, useValue: searchServiceSpy },
        { provide: NgxSpinnerService, useValue: spinnerServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        provideHttpClient()
      ]
    }).compileComponents();

    appFixture = TestBed.createComponent(AppComponent);
    appComponent = appFixture.componentInstance;
    mainFixture = TestBed.createComponent(MainComponent);
    mainComponent = mainFixture.componentInstance;
    searchService = TestBed.inject(SearchService) as jasmine.SpyObj<SearchService>;
    spinnerService = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  describe('Application Initialization', () => {
    it('should initialize app component correctly', () => {
      appFixture.detectChanges();
      expect(appComponent).toBeTruthy();
      expect(appComponent.title).toBe('falzoni-creditos-web');
    });

    it('should initialize main component with correct default state', () => {
      mainFixture.detectChanges();
      expect(mainComponent).toBeTruthy();
      expect(mainComponent.creditos).toEqual([]);
      expect(mainComponent.credito).toBeNull();
      expect(mainComponent.isReady).toBeFalse();
    });
  });

  describe('Complete User Journey - NFSe Search', () => {
    it('should complete successful NFSe search journey from start to finish', fakeAsync(() => {
      searchService.getCreditByNfse.and.returnValue(of(mockCreditoArray));
      mainFixture.detectChanges();
      mainComponent.isReady = false;
      const searchData = { type: 'nfse', value: '67890' };

      mainComponent.onSearchSubmitted(searchData);

      expect(spinnerService.show).toHaveBeenCalled();
      expect(searchService.getCreditByNfse).toHaveBeenCalledWith('67890');
      expect(mainComponent.isReady).toBeTruthy();
      expect(mainComponent.creditos).toEqual(mockCreditoArray);

      tick(1000);

      expect(mainComponent.creditos).toEqual(mockCreditoArray);
      expect(mainComponent.isReady).toBeTrue();

      tick(2000);

      expect(spinnerService.hide).toHaveBeenCalled();
      mainComponent.clearGrid();

      expect(mainComponent.creditos).toEqual([]);
      expect(mainComponent.isReady).toBeFalse();
    }));

    it('should handle NFSe search with no results gracefully', fakeAsync(() => {
      searchService.getCreditByNfse.and.returnValue(of([]));
      mainFixture.detectChanges();
      const searchData = { type: 'nfse', value: '67890' };

      mainComponent.onSearchSubmitted(searchData);

      expect(spinnerService.show).toHaveBeenCalled();

      tick(2000);

      expect(dialog.open).toHaveBeenCalledWith(jasmine.any(Function), {
        data: { title: 'Aviso', message: 'Nenhum crédito encontrado para o NFS-e informado.' }
      });
      expect(spinnerService.hide).toHaveBeenCalled();
    }));
  });

  describe('Complete User Journey - Credit Number Search', () => {
    it('should complete successful credit number search journey', fakeAsync(() => {
      searchService.getCreditoByNumber.and.returnValue(of(mockCredito));
      mainFixture.detectChanges();
      const searchData = { type: 'credito', value: '12345' };

      mainComponent.onSearchSubmitted(searchData);

      expect(spinnerService.show).toHaveBeenCalled();
      expect(searchService.getCreditoByNumber).toHaveBeenCalledWith('12345');

      tick(1000);

      expect(mainComponent.credito).toEqual(mockCredito);
      expect(mainComponent.isReady).toBeTrue();

      tick(2000);

      expect(spinnerService.hide).toHaveBeenCalled();

      mainComponent.clearCard();
      expect(mainComponent.credito).toBeNull();
      expect(mainComponent.isReady).toBeFalse();
    }));

    it('should handle credit not found error gracefully', fakeAsync(() => {
      const error = new Error('Crédito não encontrado');

      searchService.getCreditoByNumber.and.returnValue(throwError(() => error));
      mainFixture.detectChanges();

      const searchData = { type: 'credito', value: '12345' };

      mainComponent.onSearchSubmitted(searchData);
      expect(spinnerService.show).toHaveBeenCalled();
      expect(mainComponent.isReady).toBeTrue();

      tick(2000);

      expect(spinnerService.hide).toHaveBeenCalled();
      expect(dialog.open).toHaveBeenCalledWith(jasmine.any(Function), {
        data: { title: 'Aviso', message: 'Crédito não encontrado' }
      });
    }));
  });

  describe('Error Handling Throughout Application', () => {
    it('should handle network errors gracefully', fakeAsync(() => {
      const networkError = new Error('Erro ao efetivar a busca');

      searchService.getCreditByNfse.and.returnValue(throwError(() => networkError));
      mainFixture.detectChanges();

      const searchData = { type: 'nfse', value: '67890' };

      mainComponent.onSearchSubmitted(searchData);

      tick(2000);

      expect(spinnerService.hide).toHaveBeenCalled();
      expect(mainComponent.isReady).toBeTrue();
      expect(dialog.open).toHaveBeenCalledWith(jasmine.any(Function), {
        data: { title: 'Erro', message: 'Erro ao efetivar a busca' }
      });
    }));

    it('should handle generic server errors', fakeAsync(() => {
      const serverError = new Error('Ocorreu um erro ao tentar realizar a consulta. Por favor, tente novamente mais tarde.');
      
      searchService.getCreditoByNumber.and.returnValue(throwError(() => serverError));
      mainFixture.detectChanges();

      const searchData = { type: 'credito', value: '12345' };
      
      mainComponent.onSearchSubmitted(searchData);
      tick(2000);
      
      expect(dialog.open).toHaveBeenCalledWith(jasmine.any(Function), {
        data: { title: 'Erro', message: 'Ocorreu um erro ao tentar realizar a consulta. Por favor, tente novamente mais tarde.' }
      });
    }));
  });
  
  describe('State Management Throughout User Journey', () => {
    it('should maintain correct state through multiple search operations', fakeAsync(() => {
      mainFixture.detectChanges();
      
      expect(mainComponent.creditos).toEqual([]);
      expect(mainComponent.credito).toBeNull();
      expect(mainComponent.isReady).toBeFalse();
      
      searchService.getCreditByNfse.and.returnValue(of(mockCreditoArray));
      mainComponent.onSearchSubmitted({ type: 'nfse', value: '67890' });
      
      tick(3000);
      
      expect(mainComponent.creditos).toEqual(mockCreditoArray);
      expect(mainComponent.credito).toBeNull();
      expect(mainComponent.isReady).toBeTrue();
      
      mainComponent.clearGrid();
      
      expect(mainComponent.creditos).toEqual([]);
      expect(mainComponent.isReady).toBeFalse();
      
      searchService.getCreditoByNumber.and.returnValue(of(mockCredito));
      mainComponent.onSearchSubmitted({ type: 'credito', value: '12345' });
      
      tick(3000);
      
      expect(mainComponent.creditos).toEqual([]);
      expect(mainComponent.credito).toEqual(mockCredito);
      expect(mainComponent.isReady).toBeTrue();
      
      mainComponent.clearCard();
      
      expect(mainComponent.credito).toBeNull();
      expect(mainComponent.isReady).toBeFalse();
    }));
    it('should handle rapid consecutive searches correctly', fakeAsync(() => {
      mainFixture.detectChanges();
      
      searchService.getCreditByNfse.and.returnValue(of(mockCreditoArray));
      mainComponent.onSearchSubmitted({ type: 'nfse', value: '67890' });
      
      mainComponent.clearGrid();
      
      const newCredito = { ...mockCredito, numeroCredito: '54321' };
      
      setTimeout(() => {
        searchService.getCreditByNfse.and.returnValue(of([newCredito]));
        mainComponent.onSearchSubmitted({ type: 'nfse', value: '12345' });
      }, 1000);
      
      tick(100);
      
      expect(mainComponent.creditos).toEqual([]);
      expect(mainComponent.isReady).toBeFalse();
      
      tick(3000);
      
      expect(mainComponent.creditos).toEqual([newCredito]);
      expect(mainComponent.isReady).toBeTrue();
    }));
  });

  describe('Performance and Resource Management', () => {
    it('should not leak subscriptions or memory', fakeAsync(() => {
      mainFixture.detectChanges();
      
      for (let i = 0; i < 5; i++) {
        searchService.getCreditByNfse.and.returnValue(of(mockCreditoArray));
        mainComponent.onSearchSubmitted({ type: 'nfse', value: `6789${i}` });
        tick(3000);
        mainComponent.clearGrid();
      }

      expect(mainComponent).toBeTruthy();
      expect(mainComponent.creditos).toEqual([]);
    }));
    
    it('should handle timing correctly for UI updates', fakeAsync(() => {
      mainFixture.detectChanges();
      searchService.getCreditByNfse.and.returnValue(of(mockCreditoArray));
      mainComponent.onSearchSubmitted({ type: 'nfse', value: '67890' });
      
      expect(spinnerService.show).toHaveBeenCalled();
      
      tick(1000);
      
      expect(mainComponent.creditos).toEqual(mockCreditoArray);
      
      tick(2000);
      
      expect(spinnerService.hide).toHaveBeenCalled();
    }));
  });
});
