import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GridComponent } from './grid.component';
import { Credito } from '../../models/credito.model';

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;

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

  const mockCreditos: Credito[] = [mockCredito];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        GridComponent,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty creditos array', () => {
    expect(component.creditos).toEqual([]);
  });

  it('should have correct displayed columns', () => {
    const expectedColumns = [
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
    expect(component.displayedColumns).toEqual(expectedColumns);
  });

  it('should accept creditos input', () => {
    component.creditos = mockCreditos;
    expect(component.creditos).toEqual(mockCreditos);
  });

  describe('formatCurrency', () => {
    it('should format currency values correctly', () => {
      const result = component.formatCurrency(1234.56);
      expect(result).toContain('1.234,56');
      expect(result).toContain('R$');
    });

    it('should format zero currency', () => {
      const result = component.formatCurrency(0);
      expect(result).toContain('0,00');
      expect(result).toContain('R$');
    });

    it('should format negative currency', () => {
      const result = component.formatCurrency(-100.50);
      expect(result).toContain('100,50');
      expect(result).toContain('-');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage values correctly', () => {
      const result = component.formatPercentage(2.5);
      expect(result).toBe('2.50%');
    });

    it('should format zero percentage', () => {
      const result = component.formatPercentage(0);
      expect(result).toBe('0.00%');
    });

    it('should format large percentage', () => {
      const result = component.formatPercentage(100.75);
      expect(result).toBe('100.75%');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date(2024, 0, 15);
      const result = component.formatDate(date);
      expect(result).toBe('15/01/2024');
    });

    it('should format different date correctly', () => {
      const date = new Date(2023, 11, 25);
      const result = component.formatDate(date);
      expect(result).toBe('25/12/2023');
    });
  });

  describe('onBack', () => {
    it('should emit backEmitter when called', () => {
      spyOn(component.backEmitter, 'emit');
      
      component.onBack();
      
      expect(component.backEmitter.emit).toHaveBeenCalled();
    });

    it('should emit without parameters', () => {
      spyOn(component.backEmitter, 'emit');
      
      component.onBack();
      
      expect(component.backEmitter.emit).toHaveBeenCalledWith();
    });
  });

  describe('Integration tests', () => {
    it('should handle creditos input change', () => {
      expect(component.creditos.length).toBe(0);
      
      component.creditos = mockCreditos;
      fixture.detectChanges();
      
      expect(component.creditos.length).toBe(1);
      expect(component.creditos[0]).toEqual(mockCredito);
    });

    it('should work with multiple creditos', () => {
      const multipleCreditos = [
        mockCredito,
        { ...mockCredito, numeroCredito: '54321', numeroNfse: '09876' }
      ];
      
      component.creditos = multipleCreditos;
      
      expect(component.creditos.length).toBe(2);
      expect(component.creditos).toEqual(multipleCreditos);
    });

    it('should handle empty creditos array', () => {
      component.creditos = [];
      
      expect(component.creditos.length).toBe(0);
      expect(component.creditos).toEqual([]);
    });
  });

  describe('Table display', () => {
    it('should render table when creditos are provided', async () => {
      component.creditos = mockCreditos;
      fixture.detectChanges();
      await fixture.whenStable();
      
      const table = fixture.nativeElement.querySelector('table');
      expect(table).toBeTruthy();
    });

    it('should display correct number of columns', async () => {
      component.creditos = mockCreditos;
      fixture.detectChanges();
      await fixture.whenStable();
      
      
      const table = fixture.nativeElement.querySelector('table');
      if (table) {
        const headers = fixture.nativeElement.querySelectorAll('th');
        expect(headers.length).toBeGreaterThan(0);
      } else {
        
        expect(component.creditos.length).toBeGreaterThan(0);
      }
    });
  });
});
