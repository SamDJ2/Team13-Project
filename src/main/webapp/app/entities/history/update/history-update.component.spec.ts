import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { HistoryFormService } from './history-form.service';
import { HistoryService } from '../service/history.service';
import { IHistory } from '../history.model';

import { HistoryUpdateComponent } from './history-update.component';

describe('History Management Update Component', () => {
  let comp: HistoryUpdateComponent;
  let fixture: ComponentFixture<HistoryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let historyFormService: HistoryFormService;
  let historyService: HistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [HistoryUpdateComponent],
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
      .overrideTemplate(HistoryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HistoryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    historyFormService = TestBed.inject(HistoryFormService);
    historyService = TestBed.inject(HistoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const history: IHistory = { id: 456 };

      activatedRoute.data = of({ history });
      comp.ngOnInit();

      expect(comp.history).toEqual(history);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHistory>>();
      const history = { id: 123 };
      jest.spyOn(historyFormService, 'getHistory').mockReturnValue(history);
      jest.spyOn(historyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ history });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: history }));
      saveSubject.complete();

      // THEN
      expect(historyFormService.getHistory).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(historyService.update).toHaveBeenCalledWith(expect.objectContaining(history));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHistory>>();
      const history = { id: 123 };
      jest.spyOn(historyFormService, 'getHistory').mockReturnValue({ id: null });
      jest.spyOn(historyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ history: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: history }));
      saveSubject.complete();

      // THEN
      expect(historyFormService.getHistory).toHaveBeenCalled();
      expect(historyService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHistory>>();
      const history = { id: 123 };
      jest.spyOn(historyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ history });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(historyService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
