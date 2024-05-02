import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengesIndexComponent } from './challenges-index.component';

describe('ChallengesIndexComponent', () => {
  let component: ChallengesIndexComponent;
  let fixture: ComponentFixture<ChallengesIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChallengesIndexComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
