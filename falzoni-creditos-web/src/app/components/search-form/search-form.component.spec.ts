import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchFormComponent } from './search-form.component';

describe('SearchFormComponent', () => {
  let component: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SearchFormComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.searchForm.get('searchType')?.value).toBe('');
    expect(component.searchForm.get('searchValue')?.value).toBe('');
  });

  it('should have correct search options', () => {
    expect(component.searchOptions).toEqual([
      { value: 'nfse', viewValue: 'Número de NFSe' },
      { value: 'credito', viewValue: 'Número do Crédito' }
    ]);
  });

  it('should mark form as invalid when fields are empty', () => {
    expect(component.searchForm.valid).toBeFalse();
  });

  it('should mark form as valid when both fields are filled', () => {
    component.searchForm.patchValue({
      searchType: 'nfse',
      searchValue: '12345'
    });
    expect(component.searchForm.valid).toBeTrue();
  });

  it('should mark searchType as invalid when empty', () => {
    const searchTypeControl = component.searchForm.get('searchType');
    expect(searchTypeControl?.invalid).toBeTrue();
    expect(searchTypeControl?.hasError('required')).toBeTrue();
  });

  it('should mark searchValue as invalid when empty', () => {
    const searchValueControl = component.searchForm.get('searchValue');
    expect(searchValueControl?.invalid).toBeTrue();
    expect(searchValueControl?.hasError('required')).toBeTrue();
  });

  it('should validate searchType field correctly', () => {
    const searchTypeControl = component.searchForm.get('searchType');
    
    searchTypeControl?.setValue('nfse');
    expect(searchTypeControl?.valid).toBeTrue();
    
    searchTypeControl?.setValue('credito');
    expect(searchTypeControl?.valid).toBeTrue();
    
    searchTypeControl?.setValue('');
    expect(searchTypeControl?.invalid).toBeTrue();
  });

  it('should validate searchValue field correctly', () => {
    const searchValueControl = component.searchForm.get('searchValue');
    
    searchValueControl?.setValue('12345');
    expect(searchValueControl?.valid).toBeTrue();
    
    searchValueControl?.setValue('');
    expect(searchValueControl?.invalid).toBeTrue();
  });

  describe('onSubmit', () => {
    it('should emit searchSubmitted when form is valid', () => {
      spyOn(component.searchSubmitted, 'emit');
      
      component.searchForm.patchValue({
        searchType: 'nfse',
        searchValue: '67890'
      });

      component.onSubmit();

      expect(component.searchSubmitted.emit).toHaveBeenCalledWith({
        type: 'nfse',
        value: '67890'
      });
    });

    it('should not emit searchSubmitted when form is invalid', () => {
      spyOn(component.searchSubmitted, 'emit');
      
      component.searchForm.patchValue({
        searchType: '',
        searchValue: '67890'
      });

      component.onSubmit();

      expect(component.searchSubmitted.emit).not.toHaveBeenCalled();
    });

    it('should not emit when searchValue is empty', () => {
      spyOn(component.searchSubmitted, 'emit');
      
      component.searchForm.patchValue({
        searchType: 'nfse',
        searchValue: ''
      });

      component.onSubmit();

      expect(component.searchSubmitted.emit).not.toHaveBeenCalled();
    });

    it('should emit correct data for credito search type', () => {
      spyOn(component.searchSubmitted, 'emit');
      
      component.searchForm.patchValue({
        searchType: 'credito',
        searchValue: '12345'
      });

      component.onSubmit();

      expect(component.searchSubmitted.emit).toHaveBeenCalledWith({
        type: 'credito',
        value: '12345'
      });
    });
  });

  describe('Form integration tests', () => {
    it('should update form value when searchType changes', () => {
      const searchTypeControl = component.searchForm.get('searchType');
      searchTypeControl?.setValue('credito');
      
      expect(component.searchForm.value.searchType).toBe('credito');
    });

    it('should update form value when searchValue changes', () => {
      const searchValueControl = component.searchForm.get('searchValue');
      searchValueControl?.setValue('test-value');
      
      expect(component.searchForm.value.searchValue).toBe('test-value');
    });

    it('should reset form correctly', () => {
      component.searchForm.patchValue({
        searchType: 'nfse',
        searchValue: '12345'
      });

      component.searchForm.reset();

      expect(component.searchForm.get('searchType')?.value).toBeNull();
      expect(component.searchForm.get('searchValue')?.value).toBeNull();
    });
  });
});
