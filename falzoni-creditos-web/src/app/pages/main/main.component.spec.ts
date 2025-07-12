import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { MainComponent } from './main.component';
import { SearchService } from '../../services/credito.service';
import { Credito } from '../../models/credito.model';
import { DialogComponent } from '../../components/dialog/dialog.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
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
    const spinnerServiceSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [MainComponent],
      providers: [
        { provide: SearchService, useValue: searchServiceSpy },
        { provide: NgxSpinnerService, useValue: spinnerServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    searchService = TestBed.inject(SearchService) as jasmine.SpyObj<SearchService>;
    spinnerService = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.creditos).toEqual([]);
    expect(component.credito).toBeNull();
    expect(component.isReady).toBeFalse();
  });

  describe('onSearchSubmitted method', () => {
    it('should call searchByNFse when type is nfse', fakeAsync(() => {
      const searchData = { type: 'nfse', value: '67890' };
      searchService.getCreditByNfse.and.returnValue(of(mockCreditoArray));

      component.onSearchSubmitted(searchData);
      tick(1000);

      expect(spinnerService.show).toHaveBeenCalled();
      expect(searchService.getCreditByNfse).toHaveBeenCalledWith('67890');
      expect(component.creditos).toEqual(mockCreditoArray);
    }));

    it('should call searchByNumeroCredito when type is credito', fakeAsync(() => {
      const searchData = { type: 'credito', value: '12345' };
      searchService.getCreditoByNumber.and.returnValue(of(mockCredito));

      component.onSearchSubmitted(searchData);
      tick(1000);

      expect(spinnerService.show).toHaveBeenCalled();
      expect(searchService.getCreditoByNumber).toHaveBeenCalledWith('12345');
      expect(component.credito).toEqual(mockCredito);
    }));
  });

  describe('searchByNFse', () => {
    it('should handle successful search with results', fakeAsync(() => {
      searchService.getCreditByNfse.and.returnValue(of(mockCreditoArray));

      component['searchByNFse']('67890');
      tick(2000);

      expect(component.creditos).toEqual(mockCreditoArray);
      expect(component.isReady).toBeTrue();
      expect(spinnerService.hide).toHaveBeenCalled();
    }));

    it('should show dialog when no results found', fakeAsync(() => {
      searchService.getCreditByNfse.and.returnValue(of([]));

      component['searchByNFse']('67890');
      tick(2000);

      expect(dialog.open).toHaveBeenCalledWith(DialogComponent, {
        data: { title: 'Aviso', message: 'Nenhum crédito encontrado para o NFS-e informado.' }
      });
    }));

    it('should handle search error', fakeAsync(() => {
      const error = new Error('Erro ao efetivar a busca');
      searchService.getCreditByNfse.and.returnValue(throwError(() => error));

      component['searchByNFse']('67890');
      tick(2000);

      expect(component.isReady).toBeTrue();
      expect(spinnerService.hide).toHaveBeenCalled();
      expect(dialog.open).toHaveBeenCalledWith(DialogComponent, {
        data: { title: 'Erro', message: 'Erro ao efetivar a busca' }
      });
    }));

    it('should clear creditos before search', fakeAsync(() => {
      component.creditos = mockCreditoArray;
      component.isReady = false; 
      searchService.getCreditByNfse.and.returnValue(of([]));

      component['searchByNFse']('67890');

      expect(component.creditos).toEqual([]);
      expect(component.isReady).toBeTrue();
    }));
  });

  describe('searchByNumeroCredito', () => {
    it('should handle successful search', fakeAsync(() => {
      searchService.getCreditoByNumber.and.returnValue(of(mockCredito));

      component['searchByNumeroCredito']('12345');
      tick(2000);

      expect(component.credito).toEqual(mockCredito);
      expect(component.isReady).toBeTrue();
      expect(spinnerService.hide).toHaveBeenCalled();
    }));

    it('should handle 404 error with warning dialog', fakeAsync(() => {
      const error = new Error('Crédito não encontrado');
      searchService.getCreditoByNumber.and.returnValue(throwError(() => error));

      component['searchByNumeroCredito']('12345');
      tick(2000);

      expect(spinnerService.hide).toHaveBeenCalled();
      expect(component.isReady).toBeTrue();
      expect(dialog.open).toHaveBeenCalledWith(DialogComponent, {
        data: { title: 'Aviso', message: 'Crédito não encontrado' }
      });
    }));

    it('should handle other errors with error dialog', fakeAsync(() => {
      const error = new Error('Ocorreu um erro ao tentar realizar a consulta. Por favor, tente novamente mais tarde.');
      searchService.getCreditoByNumber.and.returnValue(throwError(() => error));

      component['searchByNumeroCredito']('12345');
      tick(2000);

      expect(spinnerService.hide).toHaveBeenCalled();
      expect(component.isReady).toBeTrue();
      expect(dialog.open).toHaveBeenCalledWith(DialogComponent, {
        data: { title: 'Erro', message: 'Ocorreu um erro ao tentar realizar a consulta. Por favor, tente novamente mais tarde.' }
      });
    }));
  });

  describe('clearGrid', () => {
    it('should clear creditos array and set isReady to false', () => {
      component.creditos = mockCreditoArray;
      component.isReady = true;

      component.clearGrid();

      expect(component.creditos).toEqual([]);
      expect(component.isReady).toBeFalse();
    });
  });

  describe('clearCard', () => {
    it('should clear credito and set isReady to false', () => {
      component.credito = mockCredito;
      component.isReady = true;

      component.clearCard();

      expect(component.credito).toBeNull();
      expect(component.isReady).toBeFalse();
    });
  });

  describe('private methods', () => {
    it('should show dialog with correct parameters', fakeAsync(() => {
      component['showDialog']('Test Title', 'Test Message');
      tick(1000);

      expect(dialog.open).toHaveBeenCalledWith(DialogComponent, {
        data: { title: 'Test Title', message: 'Test Message' }
      });
    }));

    it('should show spinner', () => {
      component['showSpinner']();
      expect(spinnerService.show).toHaveBeenCalled();
    });

    it('should hide spinner with delay', fakeAsync(() => {
      component['hideSpinner']();
      tick(2000);
      expect(spinnerService.hide).toHaveBeenCalled();
    }));
  });
});
