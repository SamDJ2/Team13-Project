import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoffeeLevelsComponent } from './coffee-levels.component';

describe('CoffeeLevelsComponent', () => {
  let component: CoffeeLevelsComponent;
  let fixture: ComponentFixture<CoffeeLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoffeeLevelsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoffeeLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
