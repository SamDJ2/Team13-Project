import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PromptsPageFormService } from './prompts-page-form.service';
import { PromptsPageService } from '../service/prompts-page.service';
import { IPromptsPage } from '../prompts-page.model';
import { IMoodPicker } from 'app/entities/mood-picker/mood-picker.model';
import { MoodPickerService } from 'app/entities/mood-picker/service/mood-picker.service';
import { IEmotionPage } from 'app/entities/emotion-page/emotion-page.model';
import { EmotionPageService } from 'app/entities/emotion-page/service/emotion-page.service';
import { IMoodJournalPage } from 'app/entities/mood-journal-page/mood-journal-page.model';
import { MoodJournalPageService } from 'app/entities/mood-journal-page/service/mood-journal-page.service';

import { PromptsPageUpdateComponent } from './prompts-page-update.component';

describe('PromptsPage Management Update Component', () => {
  let comp: PromptsPageUpdateComponent;
  let fixture: ComponentFixture<PromptsPageUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let promptsPageFormService: PromptsPageFormService;
  let promptsPageService: PromptsPageService;
  let moodPickerService: MoodPickerService;
  let emotionPageService: EmotionPageService;
  let moodJournalPageService: MoodJournalPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PromptsPageUpdateComponent],
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
      .overrideTemplate(PromptsPageUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PromptsPageUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    promptsPageFormService = TestBed.inject(PromptsPageFormService);
    promptsPageService = TestBed.inject(PromptsPageService);
    moodPickerService = TestBed.inject(MoodPickerService);
    emotionPageService = TestBed.inject(EmotionPageService);
    moodJournalPageService = TestBed.inject(MoodJournalPageService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call moodPicker query and add missing value', () => {
      const promptsPage: IPromptsPage = { id: 456 };
      const moodPicker: IMoodPicker = { id: 17214 };
      promptsPage.moodPicker = moodPicker;

      const moodPickerCollection: IMoodPicker[] = [{ id: 87436 }];
      jest.spyOn(moodPickerService, 'query').mockReturnValue(of(new HttpResponse({ body: moodPickerCollection })));
      const expectedCollection: IMoodPicker[] = [moodPicker, ...moodPickerCollection];
      jest.spyOn(moodPickerService, 'addMoodPickerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ promptsPage });
      comp.ngOnInit();

      expect(moodPickerService.query).toHaveBeenCalled();
      expect(moodPickerService.addMoodPickerToCollectionIfMissing).toHaveBeenCalledWith(moodPickerCollection, moodPicker);
      expect(comp.moodPickersCollection).toEqual(expectedCollection);
    });

    it('Should call emotionPage query and add missing value', () => {
      const promptsPage: IPromptsPage = { id: 456 };
      const emotionPage: IEmotionPage = { id: 87501 };
      promptsPage.emotionPage = emotionPage;

      const emotionPageCollection: IEmotionPage[] = [{ id: 17988 }];
      jest.spyOn(emotionPageService, 'query').mockReturnValue(of(new HttpResponse({ body: emotionPageCollection })));
      const expectedCollection: IEmotionPage[] = [emotionPage, ...emotionPageCollection];
      jest.spyOn(emotionPageService, 'addEmotionPageToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ promptsPage });
      comp.ngOnInit();

      expect(emotionPageService.query).toHaveBeenCalled();
      expect(emotionPageService.addEmotionPageToCollectionIfMissing).toHaveBeenCalledWith(emotionPageCollection, emotionPage);
      expect(comp.emotionPagesCollection).toEqual(expectedCollection);
    });

    it('Should call MoodJournalPage query and add missing value', () => {
      const promptsPage: IPromptsPage = { id: 456 };
      const moodJournalPage: IMoodJournalPage = { id: 10585 };
      promptsPage.moodJournalPage = moodJournalPage;

      const moodJournalPageCollection: IMoodJournalPage[] = [{ id: 87325 }];
      jest.spyOn(moodJournalPageService, 'query').mockReturnValue(of(new HttpResponse({ body: moodJournalPageCollection })));
      const additionalMoodJournalPages = [moodJournalPage];
      const expectedCollection: IMoodJournalPage[] = [...additionalMoodJournalPages, ...moodJournalPageCollection];
      jest.spyOn(moodJournalPageService, 'addMoodJournalPageToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ promptsPage });
      comp.ngOnInit();

      expect(moodJournalPageService.query).toHaveBeenCalled();
      expect(moodJournalPageService.addMoodJournalPageToCollectionIfMissing).toHaveBeenCalledWith(
        moodJournalPageCollection,
        ...additionalMoodJournalPages.map(expect.objectContaining)
      );
      expect(comp.moodJournalPagesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const promptsPage: IPromptsPage = { id: 456 };
      const moodPicker: IMoodPicker = { id: 55444 };
      promptsPage.moodPicker = moodPicker;
      const emotionPage: IEmotionPage = { id: 79379 };
      promptsPage.emotionPage = emotionPage;
      const moodJournalPage: IMoodJournalPage = { id: 84036 };
      promptsPage.moodJournalPage = moodJournalPage;

      activatedRoute.data = of({ promptsPage });
      comp.ngOnInit();

      expect(comp.moodPickersCollection).toContain(moodPicker);
      expect(comp.emotionPagesCollection).toContain(emotionPage);
      expect(comp.moodJournalPagesSharedCollection).toContain(moodJournalPage);
      expect(comp.promptsPage).toEqual(promptsPage);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPromptsPage>>();
      const promptsPage = { id: 123 };
      jest.spyOn(promptsPageFormService, 'getPromptsPage').mockReturnValue(promptsPage);
      jest.spyOn(promptsPageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ promptsPage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: promptsPage }));
      saveSubject.complete();

      // THEN
      expect(promptsPageFormService.getPromptsPage).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(promptsPageService.update).toHaveBeenCalledWith(expect.objectContaining(promptsPage));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPromptsPage>>();
      const promptsPage = { id: 123 };
      jest.spyOn(promptsPageFormService, 'getPromptsPage').mockReturnValue({ id: null });
      jest.spyOn(promptsPageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ promptsPage: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: promptsPage }));
      saveSubject.complete();

      // THEN
      expect(promptsPageFormService.getPromptsPage).toHaveBeenCalled();
      expect(promptsPageService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPromptsPage>>();
      const promptsPage = { id: 123 };
      jest.spyOn(promptsPageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ promptsPage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(promptsPageService.update).toHaveBeenCalled();
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

    describe('compareEmotionPage', () => {
      it('Should forward to emotionPageService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(emotionPageService, 'compareEmotionPage');
        comp.compareEmotionPage(entity, entity2);
        expect(emotionPageService.compareEmotionPage).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareMoodJournalPage', () => {
      it('Should forward to moodJournalPageService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(moodJournalPageService, 'compareMoodJournalPage');
        comp.compareMoodJournalPage(entity, entity2);
        expect(moodJournalPageService.compareMoodJournalPage).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
