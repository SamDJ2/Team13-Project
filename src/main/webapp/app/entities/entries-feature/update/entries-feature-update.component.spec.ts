import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EntriesFeatureFormService } from './entries-feature-form.service';
import { EntriesFeatureService } from '../service/entries-feature.service';
import { EntriesFeature } from '../entries-feature.model';

import { EntriesFeatureUpdateComponent } from './entries-feature-update.component';

describe('EntriesFeature Management Update Component', () => {
  let comp: EntriesFeatureUpdateComponent;
  let fixture: ComponentFixture<EntriesFeatureUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let entriesFeatureFormService: EntriesFeatureFormService;
  let entriesFeatureService: EntriesFeatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EntriesFeatureUpdateComponent],
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
      .overrideTemplate(EntriesFeatureUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EntriesFeatureUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    entriesFeatureFormService = TestBed.inject(EntriesFeatureFormService);
    entriesFeatureService = TestBed.inject(EntriesFeatureService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const entriesFeature: EntriesFeature = { id: 456 };

      activatedRoute.data = of({ entriesFeature });
      comp.ngOnInit();

      expect(comp.entriesFeature).toEqual(entriesFeature);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EntriesFeature>>();
      const entriesFeature = { id: 123 };
      jest.spyOn(entriesFeatureFormService, 'getEntriesFeature').mockReturnValue(entriesFeature);
      jest.spyOn(entriesFeatureService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ entriesFeature });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: entriesFeature }));
      saveSubject.complete();

      // THEN
      expect(entriesFeatureFormService.getEntriesFeature).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(entriesFeatureService.update).toHaveBeenCalledWith(expect.objectContaining(entriesFeature));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EntriesFeature>>();
      const entriesFeature = { id: 123 };
      jest.spyOn(entriesFeatureFormService, 'getEntriesFeature').mockReturnValue({ id: null });
      jest.spyOn(entriesFeatureService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ entriesFeature: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: entriesFeature }));
      saveSubject.complete();

      // THEN
      expect(entriesFeatureFormService.getEntriesFeature).toHaveBeenCalled();
      expect(entriesFeatureService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EntriesFeature>>();
      const entriesFeature = { id: 123 };
      jest.spyOn(entriesFeatureService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ entriesFeature });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(entriesFeatureService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
