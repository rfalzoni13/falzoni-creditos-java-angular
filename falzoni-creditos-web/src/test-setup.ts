import 'zone.js/testing';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

beforeEach(() => {
  spyOn(console, 'warn').and.stub();
  spyOn(console, 'error').and.stub();
});

export const TestHelpers = {
  createMockCredito: (overrides = {}) => ({
    numeroCredito: '12345',
    numeroNfse: '67890',
    dataConstituicao: new Date('2024-01-15'),
    valorIssqn: 100.50,
    tipoCredito: 'PRINCIPAL',
    simplesNacional: true,
    aliquota: 2.5,
    valorFaturado: 5000.00,
    valorDeducao: 200.00,
    baseCalculo: 4800.00,
  }),

  createMockCreditoArray: (count = 1) => {
    return Array.from({ length: count }, (_, index) => 
      TestHelpers.createMockCredito({
        numeroCredito: `1234${index}`,
        numeroNfse: `6789${index}`
      })
    );
  },

  createMockDialogData: (title = 'Test Title', message = 'Test Message') => ({
    title,
    message
  }),

  createMockSearchFormData: (type = 'nfse', value = '12345') => ({
    type,
    value
  })
};
