import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { HabitstrackingFormService } from './habitstracking-form.service';
import { HabitstrackingService } from '../service/habitstracking.service';
import { IHabitstracking } from '../habitstracking.model';

import { HabitstrackingUpdateComponent } from './habitstracking-update.component';

describe('Habitstracking Management Update Component', () => {
  let comp: HabitstrackingUpdateComponent;
  let fixture: ComponentFixture<HabitstrackingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let habitstrackingFormService: HabitstrackingFormService;
  let habitstrackingService: HabitstrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [HabitstrackingUpdateComponent],
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
      .overrideTemplate(HabitstrackingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HabitstrackingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    habitstrackingFormService = TestBed.inject(HabitstrackingFormService);
    habitstrackingService = TestBed.inject(HabitstrackingService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const habitstracking: IHabitstracking = { id: 456 };

      activatedRoute.data = of({ habitstracking });
      comp.ngOnInit();

      expect(comp.habitstracking).toEqual(habitstracking);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHabitstracking>>();
      const habitstracking = { id: 123 };
      jest.spyOn(habitstrackingFormService, 'getHabitstracking').mockReturnValue(habitstracking);
      jest.spyOn(habitstrackingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ habitstracking });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: habitstracking }));
      saveSubject.complete();

      // THEN
      expect(habitstrackingFormService.getHabitstracking).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(habitstrackingService.update).toHaveBeenCalledWith(expect.objectContaining(habitstracking));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHabitstracking>>();
      const habitstracking = { id: 123 };
      jest.spyOn(habitstrackingFormService, 'getHabitstracking').mockReturnValue({ id: null });
      jest.spyOn(habitstrackingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ habitstracking: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: habitstracking }));
      saveSubject.complete();

      // THEN
      expect(habitstrackingFormService.getHabitstracking).toHaveBeenCalled();
      expect(habitstrackingService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHabitstracking>>();
      const habitstracking = { id: 123 };
      jest.spyOn(habitstrackingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ habitstracking });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(habitstrackingService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
