import { Component, OnInit } from '@angular/core';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbar } from '@angular/material/toolbar';
import { AngularMaterailModules } from '../../AngularMeterialModules';
import { MatCard } from '@angular/material/card';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf, NgForOf } from '@angular/common';
import { ProductRegistrationService } from '../../services/productRegistration/product-registration.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from '../../admin/service/admin.service';




@Component({
  selector: 'app-product-registration',
  standalone: true,
  imports: [AngularMaterailModules, MatToolbar, MatFormFieldModule, MatCard, MatFormField, ReactiveFormsModule, NgIf, NgForOf],
  templateUrl: './product-registration.component.html',
  styleUrl: './product-registration.component.scss'
})



export class ProductRegistrationComponent implements OnInit {

  ProdRegForm: FormGroup;
  listOfCategories: any = [];
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null;

  dataSource!: MatTableDataSource<any>;

  showForm = false;
  submitted = false;
  saveButtonLabel: string = 'Save'

  constructor(private fb: FormBuilder,
    private prodService: ProductRegistrationService,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.ProdRegForm = this.fb.group({
      // productId: new FormControl('', [Validators.required, Validators.pattern('^PRD[0-9]+$')]),
      // productId: new FormControl('', [Validators.required]),
      // categoryId: new FormControl('', [Validators.required]),
      // productName: new FormControl('', [Validators.required, Validators.maxLength(25)]),
      // description: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      // size: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      // quantity: new FormControl([], [Validators.required]),
      // price: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      // image: new FormControl('', [Validators.required]),
      // imageName: new FormControl('', []),
      // imageType: new FormControl('', []),
      // createdAt: new FormControl('', [Validators.required]),
    });
  }




  ngOnInit(): void {

    this.ProdRegForm = this.fb.group({
      categoryId: [null, [Validators.required]],
      productName: [null, [Validators.required, Validators.maxLength(25)]],
      description: [null, [Validators.required, Validators.maxLength(500)]],
      size: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
    });

    this.getAllCategories();
  }

  getAllCategories() {
    this.adminService.getAllCategories().subscribe(resposne => {
      this.listOfCategories = resposne;
      console.log(this.listOfCategories);
    })
  }

  addProduct(): void {

  }


  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.previewImage();
  }

  previewImage() {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(this.selectedFile);
  }


  onSubmit(): void {
    // try{
    //   this.submitted=true;
    //   if(this.ProdRegForm.invalid){
    //     return;
    //   }
    //   this.prodService.addProduct(this.ProdRegForm.value).subscribe({
    //     next: (response: any) => {
    //       if(this.dataSource && this.dataSource.data && this.dataSource.data.length > 0){
    //         const formData: FormData = new FormData();
    //         formData.append('image', this.selectedFile);
    //         this.dataSource = new MatTableDataSource([response, ...this.dataSource.data,]);
    //       }
    //       else{
    //         this.dataSource = new MatTableDataSource([response]);
    //       }
    //       this.snackBar.open("Product added successfully", 'Ok', {duration:5000});
    //     },
    //     error:(error)=>{
    //       console.error("FULL ERROR:", error);
    //       this.snackBar.open("Something went wrong while adding", "Error", {duration:5000});
    //     }
    //   });

    // }
    // catch(error){
    //   this.snackBar.open("Something error", "Error", {duration:5000})
    // }


    if (this.ProdRegForm.valid) {
      const formData: FormData = new FormData();
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }
      formData.append('categoryId', this.ProdRegForm.get('categoryId').value);
      formData.append('productName', this.ProdRegForm.get('productName').value);
      formData.append('description', this.ProdRegForm.get('description').value);
      formData.append('size', this.ProdRegForm.get('size').value);
      formData.append('quantity', this.ProdRegForm.get('quantity').value);
      formData.append('price', this.ProdRegForm.get('price').value);

      this.prodService.addProduct(formData).subscribe({
        next: (response: any) => {
          console.log("RESPONSE:", response);
          if (response.productId != null) {
            this.snackBar.open('Product added successfully', 'Ok', { duration: 5000 });
            this.router.navigateByUrl('/dashboard');
          }
          else {
            this.snackBar.open(response.message, 'ERROR', { duration: 5000 });
          }
        }
      })

    }
    else {
      for (const i in this.ProdRegForm.controls) {
        this.ProdRegForm.controls[i].markAsDirty();
        this.ProdRegForm.controls[i].updateValueAndValidity();
      }
    }

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
