import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LandingPageFormService } from './landing-page-form.service';
import { LandingPageService } from '../service/landing-page.service';
import { ILandingPage } from '../landing-page.model';
import { IMoodPicker } from 'app/entities/mood-picker/mood-picker.model';
import { MoodPickerService } from 'app/entities/mood-picker/service/mood-picker.service';

import { LandingPageUpdateComponent } from './landing-page-update.component';

describe('LandingPage Management Update Component', () => {
  let comp: LandingPageUpdateComponent;
  let fixture: ComponentFixture<LandingPageUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let landingPageFormService: LandingPageFormService;
  let landingPageService: LandingPageService;
  let moodPickerService: MoodPickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LandingPageUpdateComponent],
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
      .overrideTemplate(LandingPageUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LandingPageUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    landingPageFormService = TestBed.inject(LandingPageFormService);
    landingPageService = TestBed.inject(LandingPageService);
    moodPickerService = TestBed.inject(MoodPickerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call moodPicker query and add missing value', () => {
      const landingPage: ILandingPage = { id: 456 };
      const moodPicker: IMoodPicker = { id: 68562 };
      landingPage.moodPicker = moodPicker;

      const moodPickerCollection: IMoodPicker[] = [{ id: 73048 }];
      jest.spyOn(moodPickerService, 'query').mockReturnValue(of(new HttpResponse({ body: moodPickerCollection })));
      const expectedCollection: IMoodPicker[] = [moodPicker, ...moodPickerCollection];
      jest.spyOn(moodPickerService, 'addMoodPickerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ landingPage });
      comp.ngOnInit();

      expect(moodPickerService.query).toHaveBeenCalled();
      expect(moodPickerService.addMoodPickerToCollectionIfMissing).toHaveBeenCalledWith(moodPickerCollection, moodPicker);
      expect(comp.moodPickersCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const landingPage: ILandingPage = { id: 456 };
      const moodPicker: IMoodPicker = { id: 55874 };
      landingPage.moodPicker = moodPicker;

      activatedRoute.data = of({ landingPage });
      comp.ngOnInit();

      expect(comp.moodPickersCollection).toContain(moodPicker);
      expect(comp.landingPage).toEqual(landingPage);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILandingPage>>();
      const landingPage = { id: 123 };
      jest.spyOn(landingPageFormService, 'getLandingPage').mockReturnValue(landingPage);
      jest.spyOn(landingPageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ landingPage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: landingPage }));
      saveSubject.complete();

      // THEN
      expect(landingPageFormService.getLandingPage).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(landingPageService.update).toHaveBeenCalledWith(expect.objectContaining(landingPage));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILandingPage>>();
      const landingPage = { id: 123 };
      jest.spyOn(landingPageFormService, 'getLandingPage').mockReturnValue({ id: null });
      jest.spyOn(landingPageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ landingPage: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: landingPage }));
      saveSubject.complete();

      // THEN
      expect(landingPageFormService.getLandingPage).toHaveBeenCalled();
      expect(landingPageService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILandingPage>>();
      const landingPage = { id: 123 };
      jest.spyOn(landingPageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ landingPage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(landingPageService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareMoodPicker', () => {
      it('Should forward to moodPickerService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(moodPickerService, 'compareMoodPicker');
        comp.compareMoodPicker(entity, entity2);
        expect(moodPickerService.compareMoodPicker).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
