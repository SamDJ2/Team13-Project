import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlcoholLevelsComponent } from './alcohol-levels.component';

describe('AlcoholLevelsComponent', () => {
  let component: AlcoholLevelsComponent;
  let fixture: ComponentFixture<AlcoholLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlcoholLevelsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlcoholLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
