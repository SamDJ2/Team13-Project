import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SmokingFormService } from './smoking-form.service';
import { SmokingService } from '../service/smoking.service';
import { ISmoking } from '../smoking.model';

import { SmokingUpdateComponent } from './smoking-update.component';

describe('Smoking Management Update Component', () => {
  let comp: SmokingUpdateComponent;
  let fixture: ComponentFixture<SmokingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let smokingFormService: SmokingFormService;
  let smokingService: SmokingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SmokingUpdateComponent],
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
      .overrideTemplate(SmokingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SmokingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    smokingFormService = TestBed.inject(SmokingFormService);
    smokingService = TestBed.inject(SmokingService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const smoking: ISmoking = { id: 456 };

      activatedRoute.data = of({ smoking });
      comp.ngOnInit();

      expect(comp.smoking).toEqual(smoking);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISmoking>>();
      const smoking = { id: 123 };
      jest.spyOn(smokingFormService, 'getSmoking').mockReturnValue(smoking);
      jest.spyOn(smokingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ smoking });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: smoking }));
      saveSubject.complete();

      // THEN
      expect(smokingFormService.getSmoking).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(smokingService.update).toHaveBeenCalledWith(expect.objectContaining(smoking));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISmoking>>();
      const smoking = { id: 123 };
      jest.spyOn(smokingFormService, 'getSmoking').mockReturnValue({ id: null });
      jest.spyOn(smokingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ smoking: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: smoking }));
      saveSubject.complete();

      // THEN
      expect(smokingFormService.getSmoking).toHaveBeenCalled();
      expect(smokingService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISmoking>>();
      const smoking = { id: 123 };
      jest.spyOn(smokingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ smoking });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(smokingService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
