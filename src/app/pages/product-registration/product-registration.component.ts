import { Component, OnInit, ViewChild } from '@angular/core';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbar } from '@angular/material/toolbar';
import { AngularMaterailModules } from '../../AngularMeterialModules';
import { MatCard } from '@angular/material/card';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf, NgForOf, DatePipe } from '@angular/common';
import { ProductRegistrationService } from '../../services/productRegistration/product-registration.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../admin/service/admin.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { provideNativeDateAdapter } from '@angular/material/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


// interface Colors {
//   value: string;
//   viewValue: string;
// }



@Component({
  selector: 'app-product-registration',
  standalone: true,
  imports: [AngularMaterailModules, MatToolbar, MatFormFieldModule, MatCard, MatFormField, ReactiveFormsModule, NgIf, NgForOf, DatePipe],
  templateUrl: './product-registration.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './product-registration.component.scss'
})



export class ProductRegistrationComponent implements OnInit {


  // colors: Colors[] = [
  //   { value: 'White', viewValue: 'White' },
  //   { value: 'Yellow', viewValue: 'Yellow' },
  //   { value: 'Orange', viewValue: 'Orange' },
  //   { value: 'Green', viewValue: 'Green' },
  //   { value: 'Blue', viewValue: 'Blue' },
  //   { value: 'Purple', viewValue: 'Purple' },
  //   { value: 'Pink', viewValue: 'Pink' },
  //   { value: 'Red', viewValue: 'Red' },
  //   { value: 'black', viewValue: 'Black' },
  //   { value: 'No colors', viewValue: 'No colors' },
  // ];



  // productId = this.activatedRoute.snapshot.params['productId'];

  ProdRegForm: FormGroup;
  listOfCategories: any = [];
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null;
  showForm = false;
  submitted = false;
  saveButtonLabel: string = 'Save';
  isButtonDisabled = false;
  mode = 'add';
  selectedImage: any;
  selectedData!: { productId: any; };
  products: any[] = [];
  existingImage: string | null = null;
  maxDate: Date;
  minDate: Date;


  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  displayedColumns: string[] = [
    // 'productId',
    'productSku',
    'productName',
    'byteImage',
    'description',
    // 'colors',
    'size',
    'price',
    'addedDate',
    'actions',
  ];




  constructor(private fb: FormBuilder,
    private prodService: ProductRegistrationService,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private router: Router,
    // private activatedRoute: ActivatedRoute
  ) {
    this.maxDate = new Date();
    this.minDate = new Date();
  }


  ngOnInit(): void {

    this.ProdRegForm = this.fb.group({
      productSku: [null, [Validators.required, Validators.pattern('^PRD[0-9]+$')]],
      categoryId: [null, [Validators.required]],
      productName: [null, [Validators.required, Validators.maxLength(25)]],
      description: [null, [Validators.required, Validators.maxLength(500)]],
      // colors: [null, [Validators.required, Validators.maxLength(500)]],
      size: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
      addedDate: new FormControl(new Date(), Validators.required),
    });

    const skuControl = this.ProdRegForm.get('productSku');

    skuControl?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {

        console.log("Typing:", value);

        if (!value) return;

        const control = this.ProdRegForm.get('productSku');

        this.prodService.checkSkuExists(value).subscribe({
          next: (exists) => {

            if (exists) {
              control?.setErrors({ ...control.errors, duplicate: true });
            } else {
              if (control?.errors) {
                delete control.errors['duplicate'];

                if (Object.keys(control.errors).length === 0) {
                  control.setErrors(null);
                } else {
                  control.setErrors(control.errors);
                }
              }
            }

          },
          error: (err) => {
            console.error(err);
          }
        });

      });

    this.getAllCategories();
    this.populateData();

    // const nav = this.router.getCurrentNavigation();
    const data = history.state.product;

    // console.log('*****', data);

    if (data) {
      this.editData(data);
      this.showForm = true;
    }
    // this.getProductById();
  }

  // getProductById() {
  //   this.prodService.getProductById(this.productId).subscribe(response => {
  //     this.existingImage = 'data:image/jpeg;base64,' + response.byteImage;
  //   })
  // }


  public populateData(): void {
    try {
      this.prodService.getAllProducts().subscribe({
        next: (dataList: any) => {
          if (dataList.length <= 0) {
            return;
          }

          this.dataSource = new MatTableDataSource(dataList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          // this.existingImage = 'data:image/jpeg;base64,' + dataList.byteImage;
          // console.log("got:",dataList);

        },
        error: (error) => {
          // this.messageService.showError('Action failed with error' + error);
          this.snackBar.open(error.message, 'ERROR', { duration: 5000 })
        }
      });
    }
    catch (error) {
      this.snackBar.open(error.message, 'ERROR', { duration: 5000 });
    }

  }

  getAllCategories() {
    this.adminService.getAllCategories().subscribe(resposne => {
      this.listOfCategories = resposne;
      // console.log(this.listOfCategories);
    })
  }


  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    this.existingImage = null;

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
    console.log("FORM VALUE:", this.ProdRegForm.value);
    try {

      if (this.mode === 'add') {
        if (this.ProdRegForm.valid) {
          const formData: FormData = new FormData();
          if (this.selectedFile) {
            formData.append('image', this.selectedFile);
          }
          formData.append('categoryId', this.ProdRegForm.get('categoryId').value);
          formData.append('productSku', this.ProdRegForm.get('productSku').value);
          formData.append('productName', this.ProdRegForm.get('productName').value);
          formData.append('description', this.ProdRegForm.get('description').value);
          formData.append('size', this.ProdRegForm.get('size').value);
          formData.append('quantity', this.ProdRegForm.get('quantity').value);
          formData.append('price', this.ProdRegForm.get('price').value);
          const rawDate = this.ProdRegForm.get('addedDate')?.value;
          if (rawDate) {
            const formattedDate = new Date(rawDate).toISOString();
            formData.append('addedDate', formattedDate);
          }

          this.prodService.addProduct(formData).subscribe({
            next: (response: any) => {
              // console.log("RESPONSE:", formData);
              if (response.productId != null) {
                this.snackBar.open('Product added successfully', 'Ok', { duration: 5000 });
                this.router.navigateByUrl('/dashboard');
              }
              else {
                this.snackBar.open(response.message, 'ERROR', { duration: 5000 });
              }
            },
            error: (error) => {
              console.error("ERROR RESPONSE:", error);
              this.snackBar.open(
                error.error?.message || 'Product SKU already exists!',
                'Error',
                { duration: 5000 }
              );
            }
            // error: (error) => {
            //   console.error(error);
            //   console.log("FULL ERROR:", error);

            //   // if (error.error?.message?.includes('SKU')) {
            //   //   this.ProdRegForm.get('productSku')?.setErrors({ duplicate: true });
            //   // }
            //   const errorMessage = error.message || '';

            //   if (errorMessage.toLowerCase().includes('sku')) {
            //     this.ProdRegForm.get('productSku')?.setErrors({ duplicate: true });
            //   }

            //   this.snackBar.open(error.message || 'Error occurred', 'Error', { duration: 3000 });
            // }
          })

        }
        else {
          console.log("wrong");

          for (const i in this.ProdRegForm.controls) {
            this.ProdRegForm.controls[i].markAsDirty();
            this.ProdRegForm.controls[i].updateValueAndValidity();
          }
        }

      } else if (this.mode === 'edit') {
        const formData: FormData = new FormData();

        if (this.selectedFile) {
          formData.append('image', this.selectedFile);
        }
        formData.append('categoryId', this.ProdRegForm.get('categoryId').value);
        formData.append('productSku', this.ProdRegForm.get('productSku').value);
        formData.append('productName', this.ProdRegForm.get('productName').value);
        formData.append('description', this.ProdRegForm.get('description').value);
        formData.append('size', this.ProdRegForm.get('size').value);
        formData.append('quantity', this.ProdRegForm.get('quantity').value);
        formData.append('price', this.ProdRegForm.get('price').value);
        const rawDate = this.ProdRegForm.get('addedDate')?.value;
        if (rawDate) {
          const formattedDate = new Date(rawDate).toISOString();
          formData.append('addedDate', formattedDate);
        }

        formData.forEach((value, key) => {
          console.log("FORMDATA:", key, value);
        });

        this.prodService.editData(this.selectedData.productId, formData).subscribe({
          next: (response: any) => {
            this.snackBar.open('Product updated successfully', 'Ok', { duration: 5000 });
            this.router.navigateByUrl('/dashboard');
          },
          error: (error) => {
            this.snackBar.open(error.error?.message || 'Update failed', 'Error', { duration: 5000 });
          }
        });
      }
      this.mode = 'add';
      this.ProdRegForm.disable();
      this.isButtonDisabled = true;
    }
    catch (error) {
      this.snackBar.open("Something went wrong ", "Error", { duration: 5000 })
    }


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public editData(data: any): void {

    this.ProdRegForm.patchValue({
      ...data,
      addedDate: data.addedDate ? new Date(data.addedDate + 'Z') : null
    });

    this.ProdRegForm.updateValueAndValidity();

    this.ProdRegForm.get('productSku')?.disable();

    if (data.byteImage) {
      this.existingImage = 'data:image/jpeg;base64,' + data.byteImage;
    }

    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;
    this.isButtonDisabled=false;
  }

  public deleteData(productId: any): void {

    try {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete this?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result && !result.isConfirmed) {
          return;
        }


        this.prodService.deleteProduct(productId).subscribe({
          next: (response) => {
            const index = this.dataSource.data.findIndex((element) => element.productId === productId);
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            // this.messageService.showSuccess('Data deleted successfully!');
            this.snackBar.open('Data deleted successfully!', 'Close', { duration: 5000 });

          },
          error: (error) => {
            this.snackBar.open('Action failed with error ' + error, 'Close', { duration: 5000 });
          }
        });
      });
    }
    catch (error) {
      this.snackBar.open('Action failed with error ' + error, 'Close', { duration: 5000 });
    }


  }


  public resetData(): void {
    this.ProdRegForm.reset();
    this.ProdRegForm.updateValueAndValidity();
    this.saveButtonLabel = 'Save';
    this.ProdRegForm.enable();
    this.isButtonDisabled = false;
    this.submitted = false;
    this.existingImage = null;
    this.selectedFile = null;
    this.ProdRegForm.get('productSku')?.enable();
  }


  public refreshData(): void {
    this.populateData();
  }

  closeForm() {
    this.showForm = false;
    this.ProdRegForm.reset();
    this.ProdRegForm.enable();
    this.existingImage = null;
    this.selectedFile = null;
    this.saveButtonLabel = 'Save'
    this.submitted = false;
    this.ProdRegForm.get('productSku')?.enable();
  }


}
