import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegDialogComponent } from './reg-dialog.component';

describe('RegDialogComponent', () => {
  let component: RegDialogComponent;
  let fixture: ComponentFixture<RegDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
