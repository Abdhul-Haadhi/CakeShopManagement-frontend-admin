import { Component, OnInit } from '@angular/core';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbar } from '@angular/material/toolbar';
import { AngularMaterailModules } from '../../AngularMeterialModules';
import { MatCard } from '@angular/material/card';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';




@Component({
  selector: 'app-product-registration',
  standalone: true,
  imports: [AngularMaterailModules, MatToolbar, MatFormFieldModule, MatCard, MatFormField, ReactiveFormsModule, NgIf],
  templateUrl: './product-registration.component.html',
  styleUrl: './product-registration.component.scss'
})



export class ProductRegistrationComponent implements OnInit {

  ProdRegForm: FormGroup;

  showForm = false;
  submitted = false;
  saveButtonLabel: string = 'Save'

  constructor(private fb: FormBuilder) {
    this.ProdRegForm = this.fb.group({
      productId: new FormControl('', [Validators.required, Validators.pattern('^PRD[0-9]+$')]),
      productName: new FormControl('', [Validators.required, Validators.maxLength(25)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(25)]),
      price: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      size: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      quantity: new FormControl([], [Validators.required]),
      image: new FormControl('', [Validators.required]),
      imageName: new FormControl('', []),
      imageType: new FormControl('', []),
      createdAt: new FormControl('', [Validators.required]),
    });
  }




  ngOnInit(): void {

  }


  onSubmit() {

  }


  public resetData(): void {
    this.ProdRegForm.reset();
    this.ProdRegForm.updateValueAndValidity();
    this.ProdRegForm.enable();
    this.submitted = false;
  }

  closeForm() {
    this.showForm = false;
    this.ProdRegForm.reset();
    this.submitted = false;
  }


}
