import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoffeeStartComponent } from './coffee-start.component';

describe('CoffeeStartComponent', () => {
  let component: CoffeeStartComponent;
  let fixture: ComponentFixture<CoffeeStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoffeeStartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoffeeStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
