import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProgressFormService } from './progress-form.service';
import { ProgressService } from '../service/progress.service';
import { IProgress } from '../progress.model';

import { ProgressUpdateComponent } from './progress-update.component';

describe('Progress Management Update Component', () => {
  let comp: ProgressUpdateComponent;
  let fixture: ComponentFixture<ProgressUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let progressFormService: ProgressFormService;
  let progressService: ProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProgressUpdateComponent],
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
      .overrideTemplate(ProgressUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProgressUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    progressFormService = TestBed.inject(ProgressFormService);
    progressService = TestBed.inject(ProgressService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const progress: IProgress = { id: 456 };

      activatedRoute.data = of({ progress });
      comp.ngOnInit();

      expect(comp.progress).toEqual(progress);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProgress>>();
      const progress = { id: 123 };
      jest.spyOn(progressFormService, 'getProgress').mockReturnValue(progress);
      jest.spyOn(progressService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ progress });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: progress }));
      saveSubject.complete();

      // THEN
      expect(progressFormService.getProgress).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(progressService.update).toHaveBeenCalledWith(expect.objectContaining(progress));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProgress>>();
      const progress = { id: 123 };
      jest.spyOn(progressFormService, 'getProgress').mockReturnValue({ id: null });
      jest.spyOn(progressService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ progress: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: progress }));
      saveSubject.complete();

      // THEN
      expect(progressFormService.getProgress).toHaveBeenCalled();
      expect(progressService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProgress>>();
      const progress = { id: 123 };
      jest.spyOn(progressService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ progress });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(progressService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
