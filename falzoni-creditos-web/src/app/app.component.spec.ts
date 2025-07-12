import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let ngxSpinnerService: jasmine.SpyObj<NgxSpinnerService>;

  beforeEach(async () => {
    const ngxSpinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide', 'getSpinner']);
    ngxSpinnerSpy.getSpinner.and.returnValue(of({
      show: false,
      color: '#fff',
      size: 'default'
    }));

    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterModule.forRoot([])],
      providers: [
        { provide: NgxSpinnerService, useValue: ngxSpinnerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    ngxSpinnerService = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct title', () => {
    expect(component.title).toEqual('falzoni-creditos-web');
  });

  it('should initialize with correct title property', () => {
    expect(component.title).toBeDefined();
    expect(typeof component.title).toBe('string');
  });

  it('should render correctly', () => {
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
  });
});
