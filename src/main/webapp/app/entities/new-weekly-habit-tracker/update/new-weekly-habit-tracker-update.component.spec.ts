import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { NewWeeklyHabitTrackerFormService } from './new-weekly-habit-tracker-form.service';
import { NewWeeklyHabitTrackerService } from '../service/new-weekly-habit-tracker.service';
import { INewWeeklyHabitTracker } from '../new-weekly-habit-tracker.model';
import { IWeeklySummary } from 'app/entities/weekly-summary/weekly-summary.model';
import { WeeklySummaryService } from 'app/entities/weekly-summary/service/weekly-summary.service';
import { IHabit } from 'app/entities/habit/habit.model';
import { HabitService } from 'app/entities/habit/service/habit.service';

import { NewWeeklyHabitTrackerUpdateComponent } from './new-weekly-habit-tracker-update.component';

describe('NewWeeklyHabitTracker Management Update Component', () => {
  let comp: NewWeeklyHabitTrackerUpdateComponent;
  let fixture: ComponentFixture<NewWeeklyHabitTrackerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let newWeeklyHabitTrackerFormService: NewWeeklyHabitTrackerFormService;
  let newWeeklyHabitTrackerService: NewWeeklyHabitTrackerService;
  let weeklySummaryService: WeeklySummaryService;
  let habitService: HabitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [NewWeeklyHabitTrackerUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(NewWeeklyHabitTrackerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NewWeeklyHabitTrackerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    newWeeklyHabitTrackerFormService = TestBed.inject(NewWeeklyHabitTrackerFormService);
    newWeeklyHabitTrackerService = TestBed.inject(NewWeeklyHabitTrackerService);
    weeklySummaryService = TestBed.inject(WeeklySummaryService);
    habitService = TestBed.inject(HabitService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call weeklySummary query and add missing value', () => {
      const newWeeklyHabitTracker: INewWeeklyHabitTracker = { id: 456 };
      const weeklySummary: IWeeklySummary = { id: 82989 };
      newWeeklyHabitTracker.weeklySummary = weeklySummary;

      const weeklySummaryCollection: IWeeklySummary[] = [{ id: 25685 }];
      jest.spyOn(weeklySummaryService, 'query').mockReturnValue(of(new HttpResponse({ body: weeklySummaryCollection })));
      const expectedCollection: IWeeklySummary[] = [weeklySummary, ...weeklySummaryCollection];
      jest.spyOn(weeklySummaryService, 'addWeeklySummaryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ newWeeklyHabitTracker });
      comp.ngOnInit();

      expect(weeklySummaryService.query).toHaveBeenCalled();
      expect(weeklySummaryService.addWeeklySummaryToCollectionIfMissing).toHaveBeenCalledWith(weeklySummaryCollection, weeklySummary);
      expect(comp.weeklySummariesCollection).toEqual(expectedCollection);
    });

    it('Should call Habit query and add missing value', () => {
      const newWeeklyHabitTracker: INewWeeklyHabitTracker = { id: 456 };
      const habit: IHabit = { id: 25259 };
      newWeeklyHabitTracker.habit = habit;

      const habitCollection: IHabit[] = [{ id: 29682 }];
      jest.spyOn(habitService, 'query').mockReturnValue(of(new HttpResponse({ body: habitCollection })));
      const additionalHabits = [habit];
      const expectedCollection: IHabit[] = [...additionalHabits, ...habitCollection];
      jest.spyOn(habitService, 'addHabitToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ newWeeklyHabitTracker });
      comp.ngOnInit();

      expect(habitService.query).toHaveBeenCalled();
      expect(habitService.addHabitToCollectionIfMissing).toHaveBeenCalledWith(
        habitCollection,
        ...additionalHabits.map(expect.objectContaining)
      );
      expect(comp.habitsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const newWeeklyHabitTracker: INewWeeklyHabitTracker = { id: 456 };
      const weeklySummary: IWeeklySummary = { id: 27007 };
      newWeeklyHabitTracker.weeklySummary = weeklySummary;
      const habit: IHabit = { id: 74107 };
      newWeeklyHabitTracker.habit = habit;

      activatedRoute.data = of({ newWeeklyHabitTracker });
      comp.ngOnInit();

      expect(comp.weeklySummariesCollection).toContain(weeklySummary);
      expect(comp.habitsSharedCollection).toContain(habit);
      expect(comp.newWeeklyHabitTracker).toEqual(newWeeklyHabitTracker);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INewWeeklyHabitTracker>>();
      const newWeeklyHabitTracker = { id: 123 };
      jest.spyOn(newWeeklyHabitTrackerFormService, 'getNewWeeklyHabitTracker').mockReturnValue(newWeeklyHabitTracker);
      jest.spyOn(newWeeklyHabitTrackerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ newWeeklyHabitTracker });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: newWeeklyHabitTracker }));
      saveSubject.complete();

      // THEN
      expect(newWeeklyHabitTrackerFormService.getNewWeeklyHabitTracker).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(newWeeklyHabitTrackerService.update).toHaveBeenCalledWith(expect.objectContaining(newWeeklyHabitTracker));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INewWeeklyHabitTracker>>();
      const newWeeklyHabitTracker = { id: 123 };
      jest.spyOn(newWeeklyHabitTrackerFormService, 'getNewWeeklyHabitTracker').mockReturnValue({ id: null });
      jest.spyOn(newWeeklyHabitTrackerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ newWeeklyHabitTracker: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: newWeeklyHabitTracker }));
      saveSubject.complete();

      // THEN
      expect(newWeeklyHabitTrackerFormService.getNewWeeklyHabitTracker).toHaveBeenCalled();
      expect(newWeeklyHabitTrackerService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INewWeeklyHabitTracker>>();
      const newWeeklyHabitTracker = { id: 123 };
      jest.spyOn(newWeeklyHabitTrackerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ newWeeklyHabitTracker });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(newWeeklyHabitTrackerService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareWeeklySummary', () => {
      it('Should forward to weeklySummaryService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(weeklySummaryService, 'compareWeeklySummary');
        comp.compareWeeklySummary(entity, entity2);
        expect(weeklySummaryService.compareWeeklySummary).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareHabit', () => {
      it('Should forward to habitService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(habitService, 'compareHabit');
        comp.compareHabit(entity, entity2);
        expect(habitService.compareHabit).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
