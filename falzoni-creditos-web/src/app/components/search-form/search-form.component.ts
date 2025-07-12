import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-search-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatOptionModule
  ],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss'
})
export class SearchFormComponent {
  @Output() searchSubmitted = new EventEmitter<any>();
  
  searchForm: FormGroup;
  
  searchOptions = [
    { value: 'nfse', viewValue: 'Número de NFSe' },
    { value: 'credito', viewValue: 'Número do Crédito' }
  ];

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      searchType: ['', Validators.required],
      searchValue: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.searchForm.valid) {
      const searchData: any = {
        type: this.searchForm.value.searchType,
        value: this.searchForm.value.searchValue
      };
      
      this.searchSubmitted.emit(searchData);
    }
  }
}
