import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodLevelsComponent } from './food-levels.component';

describe('FoodLevelsComponent', () => {
  let component: FoodLevelsComponent;
  let fixture: ComponentFixture<FoodLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FoodLevelsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FoodLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
