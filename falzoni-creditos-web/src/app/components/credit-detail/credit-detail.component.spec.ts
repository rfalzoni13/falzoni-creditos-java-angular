import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CreditDetailComponent } from './credit-detail.component';
import { Credito } from '../../models/credito.model';

describe('CreditDetailComponent', () => {
  let component: CreditDetailComponent;
  let fixture: ComponentFixture<CreditDetailComponent>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreditDetailComponent,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreditDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with null credito', () => {
    expect(component.credito).toBeNull();
  });

  it('should accept credito input', () => {
    component.credito = mockCredito;
    expect(component.credito).toEqual(mockCredito);
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

    it('should format large currency values', () => {
      const result = component.formatCurrency(1000000.99);
      expect(result).toContain('1.000.000,99');
      expect(result).toContain('R$');
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

    it('should format high percentage', () => {
      const result = component.formatPercentage(100.75);
      expect(result).toBe('100.75%');
    });

    it('should format decimal percentage', () => {
      const result = component.formatPercentage(12.345);
      expect(result).toBe('12.35%');
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

    it('should format single digit dates', () => {
      const date = new Date(2024, 2, 5);
      const result = component.formatDate(date);
      expect(result).toBe('05/03/2024');
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
    it('should handle credito input change', () => {
      expect(component.credito).toBeNull();
      
      component.credito = mockCredito;
      fixture.detectChanges();
      
      expect(component.credito).toEqual(mockCredito);
    });

    it('should handle null credito', () => {
      component.credito = mockCredito;
      component.credito = null;
      
      expect(component.credito).toBeNull();
    });

    it('should display credito data when provided', () => {
      component.credito = mockCredito;
      fixture.detectChanges();
      
      expect(component.credito.numeroCredito).toBe('12345');
      expect(component.credito.numeroNfse).toBe('67890');
      expect(component.credito.tipoCredito).toBe('PRINCIPAL');
      expect(component.credito.simplesNacional).toBe(true);
    });
  });

  describe('Component rendering', () => {
    it('should render card when credito is provided', () => {
      component.credito = mockCredito;
      fixture.detectChanges();
      
      const card = fixture.nativeElement.querySelector('mat-card');
      expect(card).toBeTruthy();
    });

    it('should show back button', () => {
      component.credito = mockCredito;
      fixture.detectChanges();
      
      const backButton = fixture.nativeElement.querySelector('button');
      expect(backButton).toBeTruthy();
    });

    it('should trigger onBack when back button is clicked', () => {
      spyOn(component, 'onBack');
      component.credito = mockCredito;
      fixture.detectChanges();
      
      const backButton = fixture.nativeElement.querySelector('button');
      backButton?.click();
      
      expect(component.onBack).toHaveBeenCalled();
    });
  });

  describe('Data formatting in component', () => {
    it('should format all currency fields correctly', () => {
      component.credito = mockCredito;
      
      expect(component.formatCurrency(mockCredito.valorIssqn)).toContain('100,50');
      expect(component.formatCurrency(mockCredito.valorFaturado)).toContain('5.000,00');
      expect(component.formatCurrency(mockCredito.valorDeducao)).toContain('200,00');
      expect(component.formatCurrency(mockCredito.baseCalculo)).toContain('4.800,00');
    });

    it('should format aliquota correctly', () => {
      component.credito = mockCredito;
      
      expect(component.formatPercentage(mockCredito.aliquota)).toBe('2.50%');
    });

    it('should format date correctly', () => {
      component.credito = mockCredito;
      
      expect(component.formatDate(mockCredito.dataConstituicao)).toBe('15/01/2024');
    });
  });
});
