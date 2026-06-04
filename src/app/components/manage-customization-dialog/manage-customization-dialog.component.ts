import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomizationOptionService } from '../../services/customizationOption/customization-option.service';
import { AngularMaterailModules } from "../../AngularMeterialModules";
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manage-customization-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, AngularMaterailModules],
  templateUrl: './manage-customization-dialog.component.html',
  styleUrl: './manage-customization-dialog.component.scss'
})
export class ManageCustomizationDialogComponent implements OnInit {

  options: any[] = [];
  optionName = '';
  optionType = 'TEXT';
  editingId: number | null = null;

  selectedOption: any = null;
  optionValues: any[] = [];
  valueText = '';
  editingValueId: number | null = null;


  constructor(private optionService: CustomizationOptionService,
    private dialogRef: MatDialogRef<ManageCustomizationDialogComponent>,
    private snackBar: MatSnackBar,
  ) {

  }

  ngOnInit(): void {
    this.loadOptions();

  }

  loadOptions() {
    this.optionService.getAllOptions().subscribe((res: any) => {
      this.options = res;
    });
  }

  selectOption(option: any) {

    this.resetValueForm();

    this.selectedOption = option;

    this.optionService.getValues(option.optionId).subscribe({
      next: (res: any) => {
        this.optionValues = res;
      },
      error: () => {
        this.snackBar.open('Failed to load values', 'Close', { duration: 3000 });
      }
    });
  }


  addOption() {

    if (!this.optionName.trim()) {
      this.snackBar.open('Option name is required', 'Close', { duration: 3000 });
      return;
    }

    const data = {
      optionName: this.optionName,
      optionType: this.optionType
    };

    if (this.editingId) {
      this.optionService.updateOption(this.editingId, data).subscribe({
        next: () => {
          this.snackBar.open('Option updated successfully', 'Close', { duration: 3000 });
          this.resetForm();
          this.loadOptions();
        },
        error: () => {
          this.snackBar.open('Failed to update option', 'Close', { duration: 3000 });
        }
      });
    }

    else {
      this.optionService.addOption(data).subscribe({
        next: () => {
          this.snackBar.open('Option added successfully', 'Close', { duration: 3000 });
          this.resetForm();
          this.loadOptions();
        },
        error: () => {
          this.snackBar.open('Failed to add option', 'Close', { duration: 3000 });
        }
      });
    }
  }



  addValue() {
    if (!this.valueText.trim()) {
      this.snackBar.open('Please enter a value', 'Close', { duration: 3000 });
      return;
    }

    const data = {
      optionId: this.selectedOption.optionId,
      value: this.valueText,
    };

    if (this.editingValueId) {
      this.optionService.updateValue(this.editingValueId, data).subscribe({
        next: () => {
          this.snackBar.open('Value updated successfully', 'Close', { duration: 3000 });

          this.resetValueForm();

          this.selectOption(this.selectedOption);
        },
        error: () => {
          this.snackBar.open('Failed to update value', 'Close', { duration: 3000 });
        }
      });
    }
    else {
      this.optionService.addValues(data).subscribe({
        next: () => {
          this.snackBar.open('Value added successfully', 'Close', { duration: 3000 });

          this.resetValueForm();
          this.selectOption(this.selectedOption);
        },
        error: () => {
          this.snackBar.open('Failed to add value', 'Close', { duration: 3000 });
        }
      });
    }
  }


  editValue(valueObj: any) {
    this.valueText = valueObj.value;
    this.editingValueId = valueObj.valueId;
  }


  editOption(option: any) {
    this.optionName = option.optionName;
    this.optionType = option.optionType;
    this.editingId = option.optionId;
  }


  deleteOption(id: number) {

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

        this.optionService.deleteOption(id).subscribe({
          next: (response) => {
            this.snackBar.open('Data deleted successfully!', 'Close', { duration: 5000 });
            this.loadOptions();
          },
          error: (error) => {
            this.snackBar.open('Action failed with error ' + error, 'Close', { duration: 5000 });
          }
        });
      });
    }
    catch (error) {
      this.snackBar.open('Action failed with error ' + error, 'Close', { duration: 3000 });
    }

  }

  deleteValue(id: number) {
    Swal.fire({
      title: 'Delete value?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.optionService.deleteValue(id).subscribe({
        next: () => {
          this.snackBar.open('Value deleted successfully', 'Close', { duration: 3000 });

          this.selectOption(this.selectedOption);
        },
        error: () => {
          this.snackBar.open('Failed to delete value', 'Close', { duration: 3000 });
        }
      });
    });
  }


  resetForm() {
    this.optionName = '';
    this.optionType = 'TEXT';
    this.editingId = null;
  }

  resetValueForm() {
    this.valueText = '';
    this.editingValueId = null;
  }


  closeDialog() {
    this.dialogRef.close();
  }


}
