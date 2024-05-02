import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmokingLevelsComponent } from './smoking-levels.component';

describe('SmokingLevelsComponent', () => {
  let component: SmokingLevelsComponent;
  let fixture: ComponentFixture<SmokingLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmokingLevelsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SmokingLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
