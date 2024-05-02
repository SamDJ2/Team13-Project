import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllChallengesComponent } from './all-challenges.component';

describe('AllChallengesComponent', () => {
  let component: AllChallengesComponent;
  let fixture: ComponentFixture<AllChallengesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllChallengesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AllChallengesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
