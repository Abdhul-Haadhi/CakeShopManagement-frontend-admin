import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { AngularMaterailModules } from '../../AngularMeterialModules';

@Component({
  selector: 'app-recipe-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, AngularMaterailModules],
  templateUrl: './recipe-dialog.component.html',
  styleUrl: './recipe-dialog.component.scss'
})
export class RecipeDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

}
