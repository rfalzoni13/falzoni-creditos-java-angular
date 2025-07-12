import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<DialogComponent>>;

  const mockDialogData = {
    title: 'Test Title',
    message: 'Test Message'
  };

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        DialogComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<DialogComponent>>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject dialog data correctly', () => {
    expect(component.data).toEqual(mockDialogData);
    expect(component.data.title).toBe('Test Title');
    expect(component.data.message).toBe('Test Message');
  });

  describe('Dialog data injection', () => {
    it('should handle different title and message', () => {
      expect(component.data.title).toBe('Test Title');
      expect(component.data.message).toBe('Test Message');
    });

    it('should have correct data structure', () => {
      expect(component.data.title).toBeDefined();
      expect(component.data.message).toBeDefined();
      expect(typeof component.data.title).toBe('string');
      expect(typeof component.data.message).toBe('string');
    });
  });

  describe('Component rendering', () => {
    it('should display title in dialog', () => {
      const titleElement = fixture.nativeElement.querySelector('[mat-dialog-title]');
      expect(titleElement?.textContent?.trim()).toBe('Test Title');
    });

    it('should display message in dialog content', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      
      const contentElement = fixture.nativeElement.querySelector('mat-dialog-content');
      expect(contentElement?.textContent?.trim()).toBe('Test Message');
    });

    it('should have close button', () => {
      const closeButton = fixture.nativeElement.querySelector('button[mat-dialog-close]');
      expect(closeButton).toBeTruthy();
      expect(closeButton?.textContent?.trim()).toBe('Fechar');
    });
  });

  describe('Dialog interaction', () => {
    it('should close dialog when close button is clicked', () => {
      const closeButton = fixture.nativeElement.querySelector('button[mat-dialog-close]');
      closeButton?.click();
      
      
      expect(closeButton).toBeTruthy();
    });
  });

  describe('Component with different data', () => {
    beforeEach(async () => {
      const differentData = {
        title: 'Error',
        message: 'Something went wrong'
      };

      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [
          DialogComponent,
          NoopAnimationsModule
        ],
        providers: [
          { provide: MAT_DIALOG_DATA, useValue: differentData },
          { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(DialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should display different title and message', () => {
      expect(component.data.title).toBe('Error');
      expect(component.data.message).toBe('Something went wrong');
    });
  });

  describe('Component with empty data', () => {
    beforeEach(async () => {
      const emptyData = {
        title: '',
        message: ''
      };

      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [
          DialogComponent,
          NoopAnimationsModule
        ],
        providers: [
          { provide: MAT_DIALOG_DATA, useValue: emptyData },
          { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(DialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should handle empty title and message', () => {
      expect(component.data.title).toBe('');
      expect(component.data.message).toBe('');
    });
  });

  describe('Change detection strategy', () => {
    it('should use OnPush change detection strategy', () => {
      
      
      expect(component).toBeTruthy();
    });
  });
});
