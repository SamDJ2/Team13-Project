import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TimerFormService } from './timer-form.service';
import { TimerService } from '../service/timer.service';
import { ITimer } from '../timer.model';
import { IUserDB } from 'app/entities/user-db/user-db.model';
import { UserDBService } from 'app/entities/user-db/service/user-db.service';

import { TimerUpdateComponent } from './timer-update.component';

describe('Timer Management Update Component', () => {
  let comp: TimerUpdateComponent;
  let fixture: ComponentFixture<TimerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let timerFormService: TimerFormService;
  let timerService: TimerService;
  let userDBService: UserDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TimerUpdateComponent],
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
      .overrideTemplate(TimerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TimerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    timerFormService = TestBed.inject(TimerFormService);
    timerService = TestBed.inject(TimerService);
    userDBService = TestBed.inject(UserDBService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserDB query and add missing value', () => {
      const timer: ITimer = { id: 456 };
      const timings: IUserDB = { id: 16012 };
      timer.timings = timings;

      const userDBCollection: IUserDB[] = [{ id: 6959 }];
      jest.spyOn(userDBService, 'query').mockReturnValue(of(new HttpResponse({ body: userDBCollection })));
      const additionalUserDBS = [timings];
      const expectedCollection: IUserDB[] = [...additionalUserDBS, ...userDBCollection];
      jest.spyOn(userDBService, 'addUserDBToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ timer });
      comp.ngOnInit();

      expect(userDBService.query).toHaveBeenCalled();
      expect(userDBService.addUserDBToCollectionIfMissing).toHaveBeenCalledWith(
        userDBCollection,
        ...additionalUserDBS.map(expect.objectContaining)
      );
      expect(comp.userDBSSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const timer: ITimer = { id: 456 };
      const timings: IUserDB = { id: 19467 };
      timer.timings = timings;

      activatedRoute.data = of({ timer });
      comp.ngOnInit();

      expect(comp.userDBSSharedCollection).toContain(timings);
      expect(comp.timer).toEqual(timer);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITimer>>();
      const timer = { id: 123 };
      jest.spyOn(timerFormService, 'getTimer').mockReturnValue(timer);
      jest.spyOn(timerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ timer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: timer }));
      saveSubject.complete();

      // THEN
      expect(timerFormService.getTimer).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(timerService.update).toHaveBeenCalledWith(expect.objectContaining(timer));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITimer>>();
      const timer = { id: 123 };
      jest.spyOn(timerFormService, 'getTimer').mockReturnValue({ id: null });
      jest.spyOn(timerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ timer: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: timer }));
      saveSubject.complete();

      // THEN
      expect(timerFormService.getTimer).toHaveBeenCalled();
      expect(timerService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITimer>>();
      const timer = { id: 123 };
      jest.spyOn(timerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ timer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(timerService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUserDB', () => {
      it('Should forward to userDBService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userDBService, 'compareUserDB');
        comp.compareUserDB(entity, entity2);
        expect(userDBService.compareUserDB).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
