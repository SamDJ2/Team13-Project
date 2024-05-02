import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { JunkFoodFormService } from './junk-food-form.service';
import { JunkFoodService } from '../service/junk-food.service';
import { IJunkFood } from '../junk-food.model';

import { JunkFoodUpdateComponent } from './junk-food-update.component';

describe('JunkFood Management Update Component', () => {
  let comp: JunkFoodUpdateComponent;
  let fixture: ComponentFixture<JunkFoodUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let junkFoodFormService: JunkFoodFormService;
  let junkFoodService: JunkFoodService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [JunkFoodUpdateComponent],
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
      .overrideTemplate(JunkFoodUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(JunkFoodUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    junkFoodFormService = TestBed.inject(JunkFoodFormService);
    junkFoodService = TestBed.inject(JunkFoodService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const junkFood: IJunkFood = { id: 456 };

      activatedRoute.data = of({ junkFood });
      comp.ngOnInit();

      expect(comp.junkFood).toEqual(junkFood);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJunkFood>>();
      const junkFood = { id: 123 };
      jest.spyOn(junkFoodFormService, 'getJunkFood').mockReturnValue(junkFood);
      jest.spyOn(junkFoodService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ junkFood });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: junkFood }));
      saveSubject.complete();

      // THEN
      expect(junkFoodFormService.getJunkFood).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(junkFoodService.update).toHaveBeenCalledWith(expect.objectContaining(junkFood));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJunkFood>>();
      const junkFood = { id: 123 };
      jest.spyOn(junkFoodFormService, 'getJunkFood').mockReturnValue({ id: null });
      jest.spyOn(junkFoodService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ junkFood: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: junkFood }));
      saveSubject.complete();

      // THEN
      expect(junkFoodFormService.getJunkFood).toHaveBeenCalled();
      expect(junkFoodService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJunkFood>>();
      const junkFood = { id: 123 };
      jest.spyOn(junkFoodService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ junkFood });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(junkFoodService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
