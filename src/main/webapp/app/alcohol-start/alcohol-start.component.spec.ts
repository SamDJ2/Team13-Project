import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlcoholStartComponent } from './alcohol-start.component';

describe('AlcoholStartComponent', () => {
  let component: AlcoholStartComponent;
  let fixture: ComponentFixture<AlcoholStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlcoholStartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlcoholStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
