import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EntriesPageFormService } from './entries-page-form.service';
import { EntriesPageService } from '../service/entries-page.service';
import { IEntriesPage } from '../entries-page.model';
import { IMoodJournalPage } from 'app/entities/mood-journal-page/mood-journal-page.model';
import { MoodJournalPageService } from 'app/entities/mood-journal-page/service/mood-journal-page.service';

import { EntriesPageUpdateComponent } from './entries-page-update.component';

describe('EntriesPage Management Update Component', () => {
  let comp: EntriesPageUpdateComponent;
  let fixture: ComponentFixture<EntriesPageUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let entriesPageFormService: EntriesPageFormService;
  let entriesPageService: EntriesPageService;
  let moodJournalPageService: MoodJournalPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EntriesPageUpdateComponent],
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
      .overrideTemplate(EntriesPageUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EntriesPageUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    entriesPageFormService = TestBed.inject(EntriesPageFormService);
    entriesPageService = TestBed.inject(EntriesPageService);
    moodJournalPageService = TestBed.inject(MoodJournalPageService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call MoodJournalPage query and add missing value', () => {
      const entriesPage: IEntriesPage = { id: 456 };
      const moodJournalPage: IMoodJournalPage = { id: 46984 };
      entriesPage.moodJournalPage = moodJournalPage;

      const moodJournalPageCollection: IMoodJournalPage[] = [{ id: 18328 }];
      jest.spyOn(moodJournalPageService, 'query').mockReturnValue(of(new HttpResponse({ body: moodJournalPageCollection })));
      const additionalMoodJournalPages = [moodJournalPage];
      const expectedCollection: IMoodJournalPage[] = [...additionalMoodJournalPages, ...moodJournalPageCollection];
      jest.spyOn(moodJournalPageService, 'addMoodJournalPageToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ entriesPage });
      comp.ngOnInit();

      expect(moodJournalPageService.query).toHaveBeenCalled();
      expect(moodJournalPageService.addMoodJournalPageToCollectionIfMissing).toHaveBeenCalledWith(
        moodJournalPageCollection,
        ...additionalMoodJournalPages.map(expect.objectContaining)
      );
      expect(comp.moodJournalPagesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const entriesPage: IEntriesPage = { id: 456 };
      const moodJournalPage: IMoodJournalPage = { id: 76076 };
      entriesPage.moodJournalPage = moodJournalPage;

      activatedRoute.data = of({ entriesPage });
      comp.ngOnInit();

      expect(comp.moodJournalPagesSharedCollection).toContain(moodJournalPage);
      expect(comp.entriesPage).toEqual(entriesPage);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEntriesPage>>();
      const entriesPage = { id: 123 };
      jest.spyOn(entriesPageFormService, 'getEntriesPage').mockReturnValue(entriesPage);
      jest.spyOn(entriesPageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ entriesPage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: entriesPage }));
      saveSubject.complete();

      // THEN
      expect(entriesPageFormService.getEntriesPage).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(entriesPageService.update).toHaveBeenCalledWith(expect.objectContaining(entriesPage));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEntriesPage>>();
      const entriesPage = { id: 123 };
      jest.spyOn(entriesPageFormService, 'getEntriesPage').mockReturnValue({ id: null });
      jest.spyOn(entriesPageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ entriesPage: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: entriesPage }));
      saveSubject.complete();

      // THEN
      expect(entriesPageFormService.getEntriesPage).toHaveBeenCalled();
      expect(entriesPageService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEntriesPage>>();
      const entriesPage = { id: 123 };
      jest.spyOn(entriesPageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ entriesPage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(entriesPageService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
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
