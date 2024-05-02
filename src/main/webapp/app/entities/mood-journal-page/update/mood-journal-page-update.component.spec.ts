import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MoodJournalPageFormService } from './mood-journal-page-form.service';
import { MoodJournalPageService } from '../service/mood-journal-page.service';
import { IMoodJournalPage } from '../mood-journal-page.model';

import { MoodJournalPageUpdateComponent } from './mood-journal-page-update.component';

describe('MoodJournalPage Management Update Component', () => {
  let comp: MoodJournalPageUpdateComponent;
  let fixture: ComponentFixture<MoodJournalPageUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let moodJournalPageFormService: MoodJournalPageFormService;
  let moodJournalPageService: MoodJournalPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MoodJournalPageUpdateComponent],
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
      .overrideTemplate(MoodJournalPageUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MoodJournalPageUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    moodJournalPageFormService = TestBed.inject(MoodJournalPageFormService);
    moodJournalPageService = TestBed.inject(MoodJournalPageService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const moodJournalPage: IMoodJournalPage = { id: 456 };

      activatedRoute.data = of({ moodJournalPage });
      comp.ngOnInit();

      expect(comp.moodJournalPage).toEqual(moodJournalPage);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMoodJournalPage>>();
      const moodJournalPage = { id: 123 };
      jest.spyOn(moodJournalPageFormService, 'getMoodJournalPage').mockReturnValue(moodJournalPage);
      jest.spyOn(moodJournalPageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ moodJournalPage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: moodJournalPage }));
      saveSubject.complete();

      // THEN
      expect(moodJournalPageFormService.getMoodJournalPage).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(moodJournalPageService.update).toHaveBeenCalledWith(expect.objectContaining(moodJournalPage));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMoodJournalPage>>();
      const moodJournalPage = { id: 123 };
      jest.spyOn(moodJournalPageFormService, 'getMoodJournalPage').mockReturnValue({ id: null });
      jest.spyOn(moodJournalPageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ moodJournalPage: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: moodJournalPage }));
      saveSubject.complete();

      // THEN
      expect(moodJournalPageFormService.getMoodJournalPage).toHaveBeenCalled();
      expect(moodJournalPageService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMoodJournalPage>>();
      const moodJournalPage = { id: 123 };
      jest.spyOn(moodJournalPageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ moodJournalPage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(moodJournalPageService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
