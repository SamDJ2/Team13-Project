import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { HabitFormService } from './habit-form.service';
import { HabitService } from '../service/habit.service';
import { IHabit } from '../habit.model';

import { HabitUpdateComponent } from './habit-update.component';

describe('Habit Management Update Component', () => {
  let comp: HabitUpdateComponent;
  let fixture: ComponentFixture<HabitUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let habitFormService: HabitFormService;
  let habitService: HabitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [HabitUpdateComponent],
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
      .overrideTemplate(HabitUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HabitUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    habitFormService = TestBed.inject(HabitFormService);
    habitService = TestBed.inject(HabitService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const habit: IHabit = { id: 456 };

      activatedRoute.data = of({ habit });
      comp.ngOnInit();

      expect(comp.habit).toEqual(habit);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHabit>>();
      const habit = { id: 123 };
      jest.spyOn(habitFormService, 'getHabit').mockReturnValue(habit);
      jest.spyOn(habitService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ habit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: habit }));
      saveSubject.complete();

      // THEN
      expect(habitFormService.getHabit).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(habitService.update).toHaveBeenCalledWith(expect.objectContaining(habit));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHabit>>();
      const habit = { id: 123 };
      jest.spyOn(habitFormService, 'getHabit').mockReturnValue({ id: null });
      jest.spyOn(habitService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ habit: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: habit }));
      saveSubject.complete();

      // THEN
      expect(habitFormService.getHabit).toHaveBeenCalled();
      expect(habitService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHabit>>();
      const habit = { id: 123 };
      jest.spyOn(habitService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ habit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(habitService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
