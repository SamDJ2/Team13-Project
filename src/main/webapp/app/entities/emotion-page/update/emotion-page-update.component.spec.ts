import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EmotionPageFormService } from './emotion-page-form.service';
import { EmotionPageService } from '../service/emotion-page.service';
import { IEmotionPage } from '../emotion-page.model';
import { IMoodPicker } from 'app/entities/mood-picker/mood-picker.model';
import { MoodPickerService } from 'app/entities/mood-picker/service/mood-picker.service';

import { EmotionPageUpdateComponent } from './emotion-page-update.component';

describe('EmotionPage Management Update Component', () => {
  let comp: EmotionPageUpdateComponent;
  let fixture: ComponentFixture<EmotionPageUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let emotionPageFormService: EmotionPageFormService;
  let emotionPageService: EmotionPageService;
  let moodPickerService: MoodPickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EmotionPageUpdateComponent],
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
      .overrideTemplate(EmotionPageUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EmotionPageUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    emotionPageFormService = TestBed.inject(EmotionPageFormService);
    emotionPageService = TestBed.inject(EmotionPageService);
    moodPickerService = TestBed.inject(MoodPickerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call moodPicker query and add missing value', () => {
      const emotionPage: IEmotionPage = { id: 456 };
      const moodPicker: IMoodPicker = { id: 92434 };
      emotionPage.moodPicker = moodPicker;

      const moodPickerCollection: IMoodPicker[] = [{ id: 43613 }];
      jest.spyOn(moodPickerService, 'query').mockReturnValue(of(new HttpResponse({ body: moodPickerCollection })));
      const expectedCollection: IMoodPicker[] = [moodPicker, ...moodPickerCollection];
      jest.spyOn(moodPickerService, 'addMoodPickerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ emotionPage });
      comp.ngOnInit();

      expect(moodPickerService.query).toHaveBeenCalled();
      expect(moodPickerService.addMoodPickerToCollectionIfMissing).toHaveBeenCalledWith(moodPickerCollection, moodPicker);
      expect(comp.moodPickersCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const emotionPage: IEmotionPage = { id: 456 };
      const moodPicker: IMoodPicker = { id: 40716 };
      emotionPage.moodPicker = moodPicker;

      activatedRoute.data = of({ emotionPage });
      comp.ngOnInit();

      expect(comp.moodPickersCollection).toContain(moodPicker);
      expect(comp.emotionPage).toEqual(emotionPage);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmotionPage>>();
      const emotionPage = { id: 123 };
      jest.spyOn(emotionPageFormService, 'getEmotionPage').mockReturnValue(emotionPage);
      jest.spyOn(emotionPageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emotionPage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: emotionPage }));
      saveSubject.complete();

      // THEN
      expect(emotionPageFormService.getEmotionPage).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(emotionPageService.update).toHaveBeenCalledWith(expect.objectContaining(emotionPage));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmotionPage>>();
      const emotionPage = { id: 123 };
      jest.spyOn(emotionPageFormService, 'getEmotionPage').mockReturnValue({ id: null });
      jest.spyOn(emotionPageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emotionPage: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: emotionPage }));
      saveSubject.complete();

      // THEN
      expect(emotionPageFormService.getEmotionPage).toHaveBeenCalled();
      expect(emotionPageService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmotionPage>>();
      const emotionPage = { id: 123 };
      jest.spyOn(emotionPageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emotionPage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(emotionPageService.update).toHaveBeenCalled();
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
