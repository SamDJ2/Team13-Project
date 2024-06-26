import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PointsFormService } from './points-form.service';
import { PointsService } from '../service/points.service';
import { IPoints } from '../points.model';
import { ILeaderBoards } from 'app/entities/leader-boards/leader-boards.model';
import { LeaderBoardsService } from 'app/entities/leader-boards/service/leader-boards.service';

import { PointsUpdateComponent } from './points-update.component';

describe('Points Management Update Component', () => {
  let comp: PointsUpdateComponent;
  let fixture: ComponentFixture<PointsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pointsFormService: PointsFormService;
  let pointsService: PointsService;
  let leaderBoardsService: LeaderBoardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PointsUpdateComponent],
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
      .overrideTemplate(PointsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PointsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pointsFormService = TestBed.inject(PointsFormService);
    pointsService = TestBed.inject(PointsService);
    leaderBoardsService = TestBed.inject(LeaderBoardsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call LeaderBoards query and add missing value', () => {
      const points: IPoints = { id: 456 };
      const leaderBoards: ILeaderBoards = { id: 24989 };
      points.leaderBoards = leaderBoards;

      const leaderBoardsCollection: ILeaderBoards[] = [{ id: 26904 }];
      jest.spyOn(leaderBoardsService, 'query').mockReturnValue(of(new HttpResponse({ body: leaderBoardsCollection })));
      const additionalLeaderBoards = [leaderBoards];
      const expectedCollection: ILeaderBoards[] = [...additionalLeaderBoards, ...leaderBoardsCollection];
      jest.spyOn(leaderBoardsService, 'addLeaderBoardsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ points });
      comp.ngOnInit();

      expect(leaderBoardsService.query).toHaveBeenCalled();
      expect(leaderBoardsService.addLeaderBoardsToCollectionIfMissing).toHaveBeenCalledWith(
        leaderBoardsCollection,
        ...additionalLeaderBoards.map(expect.objectContaining)
      );
      expect(comp.leaderBoardsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const points: IPoints = { id: 456 };
      const leaderBoards: ILeaderBoards = { id: 83133 };
      points.leaderBoards = leaderBoards;

      activatedRoute.data = of({ points });
      comp.ngOnInit();

      expect(comp.leaderBoardsSharedCollection).toContain(leaderBoards);
      expect(comp.points).toEqual(points);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPoints>>();
      const points = { id: 123 };
      jest.spyOn(pointsFormService, 'getPoints').mockReturnValue(points);
      jest.spyOn(pointsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ points });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: points }));
      saveSubject.complete();

      // THEN
      expect(pointsFormService.getPoints).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(pointsService.update).toHaveBeenCalledWith(expect.objectContaining(points));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPoints>>();
      const points = { id: 123 };
      jest.spyOn(pointsFormService, 'getPoints').mockReturnValue({ id: null });
      jest.spyOn(pointsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ points: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: points }));
      saveSubject.complete();

      // THEN
      expect(pointsFormService.getPoints).toHaveBeenCalled();
      expect(pointsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPoints>>();
      const points = { id: 123 };
      jest.spyOn(pointsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ points });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pointsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareLeaderBoards', () => {
      it('Should forward to leaderBoardsService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(leaderBoardsService, 'compareLeaderBoards');
        comp.compareLeaderBoards(entity, entity2);
        expect(leaderBoardsService.compareLeaderBoards).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
