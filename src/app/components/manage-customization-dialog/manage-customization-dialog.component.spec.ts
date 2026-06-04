import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCustomizationDialogComponent } from './manage-customization-dialog.component';

describe('ManageCustomizationDialogComponent', () => {
  let component: ManageCustomizationDialogComponent;
  let fixture: ComponentFixture<ManageCustomizationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCustomizationDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageCustomizationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
