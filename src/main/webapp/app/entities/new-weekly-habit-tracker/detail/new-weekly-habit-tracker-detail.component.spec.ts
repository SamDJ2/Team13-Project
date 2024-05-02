import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { NewWeeklyHabitTrackerDetailComponent } from './new-weekly-habit-tracker-detail.component';

describe('NewWeeklyHabitTracker Management Detail Component', () => {
  let comp: NewWeeklyHabitTrackerDetailComponent;
  let fixture: ComponentFixture<NewWeeklyHabitTrackerDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewWeeklyHabitTrackerDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ newWeeklyHabitTracker: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(NewWeeklyHabitTrackerDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(NewWeeklyHabitTrackerDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load newWeeklyHabitTracker on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.newWeeklyHabitTracker).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
