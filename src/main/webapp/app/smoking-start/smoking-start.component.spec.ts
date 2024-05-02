import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmokingStartComponent } from './smoking-start.component';

describe('SmokingStartComponent', () => {
  let component: SmokingStartComponent;
  let fixture: ComponentFixture<SmokingStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmokingStartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SmokingStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
