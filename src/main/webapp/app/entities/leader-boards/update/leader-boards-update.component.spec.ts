import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LeaderBoardsFormService } from './leader-boards-form.service';
import { LeaderBoardsService } from '../service/leader-boards.service';
import { ILeaderBoards } from '../leader-boards.model';
import { IGrouping } from 'app/entities/grouping/grouping.model';
import { GroupingService } from 'app/entities/grouping/service/grouping.service';
import { IProgress } from 'app/entities/progress/progress.model';
import { ProgressService } from 'app/entities/progress/service/progress.service';

import { LeaderBoardsUpdateComponent } from './leader-boards-update.component';

describe('LeaderBoards Management Update Component', () => {
  let comp: LeaderBoardsUpdateComponent;
  let fixture: ComponentFixture<LeaderBoardsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let leaderBoardsFormService: LeaderBoardsFormService;
  let leaderBoardsService: LeaderBoardsService;
  let groupingService: GroupingService;
  let progressService: ProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LeaderBoardsUpdateComponent],
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
      .overrideTemplate(LeaderBoardsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LeaderBoardsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    leaderBoardsFormService = TestBed.inject(LeaderBoardsFormService);
    leaderBoardsService = TestBed.inject(LeaderBoardsService);
    groupingService = TestBed.inject(GroupingService);
    progressService = TestBed.inject(ProgressService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call grouping query and add missing value', () => {
      const leaderBoards: ILeaderBoards = { id: 456 };
      const grouping: IGrouping = { id: 16608 };
      leaderBoards.grouping = grouping;

      const groupingCollection: IGrouping[] = [{ id: 48911 }];
      jest.spyOn(groupingService, 'query').mockReturnValue(of(new HttpResponse({ body: groupingCollection })));
      const expectedCollection: IGrouping[] = [grouping, ...groupingCollection];
      jest.spyOn(groupingService, 'addGroupingToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ leaderBoards });
      comp.ngOnInit();

      expect(groupingService.query).toHaveBeenCalled();
      expect(groupingService.addGroupingToCollectionIfMissing).toHaveBeenCalledWith(groupingCollection, grouping);
      expect(comp.groupingsCollection).toEqual(expectedCollection);
    });

    it('Should call progress query and add missing value', () => {
      const leaderBoards: ILeaderBoards = { id: 456 };
      const progress: IProgress = { id: 46042 };
      leaderBoards.progress = progress;

      const progressCollection: IProgress[] = [{ id: 30897 }];
      jest.spyOn(progressService, 'query').mockReturnValue(of(new HttpResponse({ body: progressCollection })));
      const expectedCollection: IProgress[] = [progress, ...progressCollection];
      jest.spyOn(progressService, 'addProgressToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ leaderBoards });
      comp.ngOnInit();

      expect(progressService.query).toHaveBeenCalled();
      expect(progressService.addProgressToCollectionIfMissing).toHaveBeenCalledWith(progressCollection, progress);
      expect(comp.progressesCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const leaderBoards: ILeaderBoards = { id: 456 };
      const grouping: IGrouping = { id: 65693 };
      leaderBoards.grouping = grouping;
      const progress: IProgress = { id: 16392 };
      leaderBoards.progress = progress;

      activatedRoute.data = of({ leaderBoards });
      comp.ngOnInit();

      expect(comp.groupingsCollection).toContain(grouping);
      expect(comp.progressesCollection).toContain(progress);
      expect(comp.leaderBoards).toEqual(leaderBoards);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILeaderBoards>>();
      const leaderBoards = { id: 123 };
      jest.spyOn(leaderBoardsFormService, 'getLeaderBoards').mockReturnValue(leaderBoards);
      jest.spyOn(leaderBoardsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ leaderBoards });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: leaderBoards }));
      saveSubject.complete();

      // THEN
      expect(leaderBoardsFormService.getLeaderBoards).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(leaderBoardsService.update).toHaveBeenCalledWith(expect.objectContaining(leaderBoards));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILeaderBoards>>();
      const leaderBoards = { id: 123 };
      jest.spyOn(leaderBoardsFormService, 'getLeaderBoards').mockReturnValue({ id: null });
      jest.spyOn(leaderBoardsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ leaderBoards: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: leaderBoards }));
      saveSubject.complete();

      // THEN
      expect(leaderBoardsFormService.getLeaderBoards).toHaveBeenCalled();
      expect(leaderBoardsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILeaderBoards>>();
      const leaderBoards = { id: 123 };
      jest.spyOn(leaderBoardsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ leaderBoards });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(leaderBoardsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareGrouping', () => {
      it('Should forward to groupingService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(groupingService, 'compareGrouping');
        comp.compareGrouping(entity, entity2);
        expect(groupingService.compareGrouping).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareProgress', () => {
      it('Should forward to progressService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(progressService, 'compareProgress');
        comp.compareProgress(entity, entity2);
        expect(progressService.compareProgress).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
