import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SearchService } from './credito.service';
import { Credito } from '../models/credito.model';
import { environment } from '../../environments/environment';

describe('SearchService', () => {
  let service: SearchService;
  let httpMock: HttpTestingController;

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SearchService]
    });
    service = TestBed.inject(SearchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCreditByNfse', () => {
    it('should return credits array on successful request', () => {
      const numeroNfse = '67890';

      service.getCreditByNfse(numeroNfse).subscribe((credits) => {
        expect(credits).toEqual(mockCreditoArray);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/creditos/${numeroNfse}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCreditoArray);
    });

    it('should return empty array when response is null', () => {
      const numeroNfse = '67890';

      service.getCreditByNfse(numeroNfse).subscribe((credits) => {
        expect(credits).toEqual([]);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/creditos/${numeroNfse}`);
      expect(req.request.method).toBe('GET');
      req.flush(null);
    });

    it('should handle error and return proper error message', () => {
      const numeroNfse = '67890';
      const errorMessage = 'Erro ao efetivar a busca';

      service.getCreditByNfse(numeroNfse).subscribe({
        next: () => fail('should have failed with error'),
        error: (error) => {
          expect(error.message).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/creditos/${numeroNfse}`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getCreditoByNumber', () => {
    it('should return credit on successful request', () => {
      const numeroCredito = '12345';

      service.getCreditoByNumber(numeroCredito).subscribe((credit) => {
        expect(credit).toEqual(mockCredito);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/creditos/credito/${numeroCredito}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCredito);
    });

    it('should handle 404 error with proper message', () => {
      const numeroCredito = '12345';
      const expectedError = 'Crédito não encontrado';

      service.getCreditoByNumber(numeroCredito).subscribe({
        next: () => fail('should have failed with 404'),
        error: (error) => {
          expect(error.message).toBe(expectedError);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/creditos/credito/${numeroCredito}`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle other errors with generic message', () => {
      const numeroCredito = '12345';
      const expectedError = 'Ocorreu um erro ao tentar realizar a consulta. Por favor, tente novamente mais tarde.';

      service.getCreditoByNumber(numeroCredito).subscribe({
        next: () => fail('should have failed with 500'),
        error: (error) => {
          expect(error.message).toBe(expectedError);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/creditos/credito/${numeroCredito}`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
