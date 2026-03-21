import { Component } from '@angular/core';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbar } from '@angular/material/toolbar';
import { AngularMaterailModules } from '../../AngularMeterialModules';
import { MatCard } from '@angular/material/card';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';



interface Colors {
  value: string;
  viewValue: string;
}



@Component({
  selector: 'app-product-registration',
  standalone: true,
  imports: [AngularMaterailModules, MatToolbar, MatFormFieldModule, MatCard, MatFormField, ReactiveFormsModule, NgIf],
  templateUrl: './product-registration.component.html',
  styleUrl: './product-registration.component.scss'
})



export class ProductRegistrationComponent {

  ProdRegForm: FormGroup;

  colors: Colors[] = [
    { value: 'White', viewValue: 'White' },
    { value: 'Yellow', viewValue: 'Yellow' },
    { value: 'Orange', viewValue: 'Orange' },
    { value: 'Green', viewValue: 'Green' },
    { value: 'Blue', viewValue: 'Blue' },
    { value: 'Purple', viewValue: 'Purple' },
    { value: 'Pink', viewValue: 'Pink' },
    { value: 'Red', viewValue: 'Red' },
    { value: 'black', viewValue: 'Black' },
    { value: 'No colors', viewValue: 'No colors' },
  ];


  displayedColumns: string[] = [
    'productId',
    'image',
    'product',
    'description',
    'colors',
    'initialWeight',
    'finalPrice',
    'actions',
  ];



}
