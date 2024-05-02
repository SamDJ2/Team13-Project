import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { WeeklySummaryFormService } from './weekly-summary-form.service';
import { WeeklySummaryService } from '../service/weekly-summary.service';
import { IWeeklySummary } from '../weekly-summary.model';

import { WeeklySummaryUpdateComponent } from './weekly-summary-update.component';

describe('WeeklySummary Management Update Component', () => {
  let comp: WeeklySummaryUpdateComponent;
  let fixture: ComponentFixture<WeeklySummaryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let weeklySummaryFormService: WeeklySummaryFormService;
  let weeklySummaryService: WeeklySummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [WeeklySummaryUpdateComponent],
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
      .overrideTemplate(WeeklySummaryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WeeklySummaryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    weeklySummaryFormService = TestBed.inject(WeeklySummaryFormService);
    weeklySummaryService = TestBed.inject(WeeklySummaryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const weeklySummary: IWeeklySummary = { id: 456 };

      activatedRoute.data = of({ weeklySummary });
      comp.ngOnInit();

      expect(comp.weeklySummary).toEqual(weeklySummary);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWeeklySummary>>();
      const weeklySummary = { id: 123 };
      jest.spyOn(weeklySummaryFormService, 'getWeeklySummary').mockReturnValue(weeklySummary);
      jest.spyOn(weeklySummaryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ weeklySummary });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: weeklySummary }));
      saveSubject.complete();

      // THEN
      expect(weeklySummaryFormService.getWeeklySummary).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(weeklySummaryService.update).toHaveBeenCalledWith(expect.objectContaining(weeklySummary));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWeeklySummary>>();
      const weeklySummary = { id: 123 };
      jest.spyOn(weeklySummaryFormService, 'getWeeklySummary').mockReturnValue({ id: null });
      jest.spyOn(weeklySummaryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ weeklySummary: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: weeklySummary }));
      saveSubject.complete();

      // THEN
      expect(weeklySummaryFormService.getWeeklySummary).toHaveBeenCalled();
      expect(weeklySummaryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWeeklySummary>>();
      const weeklySummary = { id: 123 };
      jest.spyOn(weeklySummaryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ weeklySummary });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(weeklySummaryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
