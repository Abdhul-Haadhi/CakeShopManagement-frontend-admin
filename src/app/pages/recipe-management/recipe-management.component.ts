import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { RecipeService } from '../../services/recipe/recipe.service';
import { ProductRegistrationService } from '../../services/productRegistration/product-registration.service';
import { InventoryService } from '../../services/inventory/inventory.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatCommonModule } from '@angular/material/core';
import { AngularMaterailModules } from "../../AngularMeterialModules";
import { MatToolbar } from '@angular/material/toolbar';
import { NgFor, NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { RecipeDialogComponent } from '../../components/recipe-dialog/recipe-dialog.component';

@Component({
  selector: 'app-recipe-management',
  standalone: true,
  imports: [MatFormFieldModule, NgFor, MatCommonModule, AngularMaterailModules, MatToolbar, MatFormField, ReactiveFormsModule, NgIf],
  templateUrl: './recipe-management.component.html',
  styleUrl: './recipe-management.component.scss'
})
export class RecipeManagementComponent implements OnInit {

  products: any[] = [];
  ingredients: any[] = [];
  recipeForm!: FormGroup;
  dataSource!: MatTableDataSource<any>;
  selectedProductId: number | null = null;

  variants: any[] = [];

  showForm = false;

  recipeItems: any[] = [];

  ingredientColumns: string[] = [
    'inventoryName',
    'quantityRequired',
    'actions'
  ]

  ingredientDataSource = new MatTableDataSource<any>();

  // displayedColumns: string[] = [
  //   'productName',
  //   'inventoryName',
  //   'quantityRequired',
  //   'actions'
  // ]

  displayedColumns = [
    'productName',
    'actions'
  ];

  constructor(private fb: FormBuilder,
    private recipeService: RecipeService,
    private productService: ProductRegistrationService,
    private inventoryService: InventoryService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.recipeForm = this.fb.group({
      productId: ['', Validators.required],
      inventoryId: ['', Validators.required],
      quantityRequired: ['', [Validators.required, Validators.min(0.01)]],
      variantId: ['', Validators.required],
    });

    this.loadProducts();
    this.loadIngredients();
    this.loadRecipes();
  }



  addIngredient() {
    if (!this.recipeForm.value.inventoryId || !this.recipeForm.value.quantityRequired) {
      return;
    }

    const ingredient = this.ingredients.find(
      i => i.inventoryId == this.recipeForm.value.inventoryId
    );

    if (!ingredient) {
      return;
    }

    const alreadyExist = this.recipeItems.find(
      x => x.inventoryId == ingredient.inventoryId
    );

    if (alreadyExist) {
      this.snackBar.open("Ingredient already added", "OK", { duration: 3000 });
      return;
    }

    this.recipeItems.push({
      inventoryId: ingredient.inventoryId,
      inventoryName: ingredient.itemName,
      quantityRequired: this.recipeForm.value.quantityRequired
    });

    this.ingredientDataSource.data = [...this.recipeItems];

    this.recipeForm.patchValue({
      inventoryId: '',
      quantityRequired: ''
    });

    this.recipeForm.get('inventoryId')?.markAsPristine();
    this.recipeForm.get('inventoryId')?.markAsUntouched();

    this.recipeForm.get('quantityRequired')?.markAsPristine();
    this.recipeForm.get('quantityRequired')?.markAsUntouched();

  }

  saveRecipe() {
    if (!this.recipeForm.value.productId) {
      this.snackBar.open("Please select a product", "OK", { duration: 3000 });
      return;
    }

    if (this.recipeItems.length == 0) {
      this.snackBar.open("Please add ingredients", "OK", { duration: 3000 });
      return;
    }

    const payload = {
      productId: this.recipeForm.value.productId,
      ingredients: this.recipeItems,
      variantId: this.recipeForm.value.variantId,
    };

    this.recipeService.addRecipe(payload).subscribe({
      next: () => {
        this.snackBar.open("Recipe saved", "OK", { duration: 3000 });

        this.recipeItems = [];
        this.ingredientDataSource.data = [];
        this.recipeForm.reset();
        this.loadRecipes();
        this.closeForm();
      },
      error: (err) => {
        console.log("add::", err);

        const errorMessage = err.error?.message || err.error || "Ingredient already exists for this product.";

        this.snackBar.open(errorMessage, "ERROR", { duration: 3000 });
      }
    });
  }

  removeIngredient(index: number) {
    this.recipeItems.splice(index, 1);

    this.ingredientDataSource.data = [...this.recipeItems];
  }

  loadVariants(productId: number) {
    this.productService.getProductVariants(productId).subscribe({
      next: (res) => {
        this.variants = res;
      }
    });
  }

  onProductChange() {
    const productId = this.recipeForm.value.productId;

    if (productId) {
      this.loadVariants(productId);
    }
  }


  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }


  loadIngredients() {
    this.inventoryService.getAllItems().subscribe({
      next: (res) => {
        this.ingredients = res;
      }
    });
  }


  loadRecipes() {
    this.recipeService.getRecipeProducts().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
      }
    });
  }


  viewRecipe(productId: number) {

    this.recipeService.getRecipeByProduct(productId).subscribe({

      next: (recipe) => {

        console.log(recipe);

        this.dialog.open(RecipeDialogComponent, {
          width: '500px',
          data: recipe
        });

      }

    });

  }


  deleteRecipe(id: number) {

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

        this.recipeService.deleteRecipe(id).subscribe({
          next: () => {
            this.snackBar.open("Recipe deleted", "OK", { duration: 3000 });

            this.loadRecipes();
          }
        });
      });
    }
    catch (error) {
      this.snackBar.open('Action failed with error ' + error, 'Close', { duration: 3000 });
    }
  }


  openAddForm() {
    this.showForm = true;
    this.recipeForm.enable();
  }


  public resetData(): void {
    this.recipeForm.reset();
    this.recipeForm.updateValueAndValidity();
    this.recipeForm.enable();
  }

  closeForm() {
    this.showForm = false;
    this.recipeForm.reset();
    this.recipeForm.enable();
  }

}
