import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserPointsFormService } from './user-points-form.service';
import { UserPointsService } from '../service/user-points.service';
import { IUserPoints } from '../user-points.model';
import { ILeaderBoards } from 'app/entities/leader-boards/leader-boards.model';
import { LeaderBoardsService } from 'app/entities/leader-boards/service/leader-boards.service';

import { UserPointsUpdateComponent } from './user-points-update.component';

describe('UserPoints Management Update Component', () => {
  let comp: UserPointsUpdateComponent;
  let fixture: ComponentFixture<UserPointsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userPointsFormService: UserPointsFormService;
  let userPointsService: UserPointsService;
  let leaderBoardsService: LeaderBoardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserPointsUpdateComponent],
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
      .overrideTemplate(UserPointsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserPointsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userPointsFormService = TestBed.inject(UserPointsFormService);
    userPointsService = TestBed.inject(UserPointsService);
    leaderBoardsService = TestBed.inject(LeaderBoardsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call LeaderBoards query and add missing value', () => {
      const userPoints: IUserPoints = { id: 456 };
      const leaderBoards: ILeaderBoards = { id: 20359 };
      userPoints.leaderBoards = leaderBoards;

      const leaderBoardsCollection: ILeaderBoards[] = [{ id: 56653 }];
      jest.spyOn(leaderBoardsService, 'query').mockReturnValue(of(new HttpResponse({ body: leaderBoardsCollection })));
      const additionalLeaderBoards = [leaderBoards];
      const expectedCollection: ILeaderBoards[] = [...additionalLeaderBoards, ...leaderBoardsCollection];
      jest.spyOn(leaderBoardsService, 'addLeaderBoardsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userPoints });
      comp.ngOnInit();

      expect(leaderBoardsService.query).toHaveBeenCalled();
      expect(leaderBoardsService.addLeaderBoardsToCollectionIfMissing).toHaveBeenCalledWith(
        leaderBoardsCollection,
        ...additionalLeaderBoards.map(expect.objectContaining)
      );
      expect(comp.leaderBoardsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userPoints: IUserPoints = { id: 456 };
      const leaderBoards: ILeaderBoards = { id: 94922 };
      userPoints.leaderBoards = leaderBoards;

      activatedRoute.data = of({ userPoints });
      comp.ngOnInit();

      expect(comp.leaderBoardsSharedCollection).toContain(leaderBoards);
      expect(comp.userPoints).toEqual(userPoints);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserPoints>>();
      const userPoints = { id: 123 };
      jest.spyOn(userPointsFormService, 'getUserPoints').mockReturnValue(userPoints);
      jest.spyOn(userPointsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userPoints });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userPoints }));
      saveSubject.complete();

      // THEN
      expect(userPointsFormService.getUserPoints).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userPointsService.update).toHaveBeenCalledWith(expect.objectContaining(userPoints));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserPoints>>();
      const userPoints = { id: 123 };
      jest.spyOn(userPointsFormService, 'getUserPoints').mockReturnValue({ id: null });
      jest.spyOn(userPointsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userPoints: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userPoints }));
      saveSubject.complete();

      // THEN
      expect(userPointsFormService.getUserPoints).toHaveBeenCalled();
      expect(userPointsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserPoints>>();
      const userPoints = { id: 123 };
      jest.spyOn(userPointsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userPoints });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userPointsService.update).toHaveBeenCalled();
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
