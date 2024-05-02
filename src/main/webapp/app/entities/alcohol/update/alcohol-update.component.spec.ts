import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AlcoholFormService } from './alcohol-form.service';
import { AlcoholService } from '../service/alcohol.service';
import { IAlcohol } from '../alcohol.model';

import { AlcoholUpdateComponent } from './alcohol-update.component';

describe('Alcohol Management Update Component', () => {
  let comp: AlcoholUpdateComponent;
  let fixture: ComponentFixture<AlcoholUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let alcoholFormService: AlcoholFormService;
  let alcoholService: AlcoholService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AlcoholUpdateComponent],
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
      .overrideTemplate(AlcoholUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AlcoholUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    alcoholFormService = TestBed.inject(AlcoholFormService);
    alcoholService = TestBed.inject(AlcoholService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const alcohol: IAlcohol = { id: 456 };

      activatedRoute.data = of({ alcohol });
      comp.ngOnInit();

      expect(comp.alcohol).toEqual(alcohol);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAlcohol>>();
      const alcohol = { id: 123 };
      jest.spyOn(alcoholFormService, 'getAlcohol').mockReturnValue(alcohol);
      jest.spyOn(alcoholService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ alcohol });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: alcohol }));
      saveSubject.complete();

      // THEN
      expect(alcoholFormService.getAlcohol).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(alcoholService.update).toHaveBeenCalledWith(expect.objectContaining(alcohol));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAlcohol>>();
      const alcohol = { id: 123 };
      jest.spyOn(alcoholFormService, 'getAlcohol').mockReturnValue({ id: null });
      jest.spyOn(alcoholService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ alcohol: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: alcohol }));
      saveSubject.complete();

      // THEN
      expect(alcoholFormService.getAlcohol).toHaveBeenCalled();
      expect(alcoholService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAlcohol>>();
      const alcohol = { id: 123 };
      jest.spyOn(alcoholService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ alcohol });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(alcoholService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
