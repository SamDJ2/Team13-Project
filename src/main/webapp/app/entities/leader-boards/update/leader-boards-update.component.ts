import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LeaderBoardsFormService, LeaderBoardsFormGroup } from './leader-boards-form.service';
import { ILeaderBoards } from '../leader-boards.model';
import { LeaderBoardsService } from '../service/leader-boards.service';
import { IGrouping } from 'app/entities/grouping/grouping.model';
import { GroupingService } from 'app/entities/grouping/service/grouping.service';
import { IProgress } from 'app/entities/progress/progress.model';
import { ProgressService } from 'app/entities/progress/service/progress.service';

@Component({
  selector: 'jhi-leader-boards-update',
  templateUrl: './leader-boards-update.component.html',
})
export class LeaderBoardsUpdateComponent implements OnInit {
  isSaving = false;
  leaderBoards: ILeaderBoards | null = null;

  groupingsCollection: IGrouping[] = [];
  progressesCollection: IProgress[] = [];

  editForm: LeaderBoardsFormGroup = this.leaderBoardsFormService.createLeaderBoardsFormGroup();

  constructor(
    protected leaderBoardsService: LeaderBoardsService,
    protected leaderBoardsFormService: LeaderBoardsFormService,
    protected groupingService: GroupingService,
    protected progressService: ProgressService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareGrouping = (o1: IGrouping | null, o2: IGrouping | null): boolean => this.groupingService.compareGrouping(o1, o2);

  compareProgress = (o1: IProgress | null, o2: IProgress | null): boolean => this.progressService.compareProgress(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ leaderBoards }) => {
      this.leaderBoards = leaderBoards;
      if (leaderBoards) {
        this.updateForm(leaderBoards);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const leaderBoards = this.leaderBoardsFormService.getLeaderBoards(this.editForm);
    if (leaderBoards.id !== null) {
      this.subscribeToSaveResponse(this.leaderBoardsService.update(leaderBoards));
    } else {
      this.subscribeToSaveResponse(this.leaderBoardsService.create(leaderBoards));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILeaderBoards>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(leaderBoards: ILeaderBoards): void {
    this.leaderBoards = leaderBoards;
    this.leaderBoardsFormService.resetForm(this.editForm, leaderBoards);

    this.groupingsCollection = this.groupingService.addGroupingToCollectionIfMissing<IGrouping>(
      this.groupingsCollection,
      leaderBoards.grouping
    );
    this.progressesCollection = this.progressService.addProgressToCollectionIfMissing<IProgress>(
      this.progressesCollection,
      leaderBoards.progress
    );
  }

  protected loadRelationshipsOptions(): void {
    this.groupingService
      .query({ filter: 'leaderboards-is-null' })
      .pipe(map((res: HttpResponse<IGrouping[]>) => res.body ?? []))
      .pipe(
        map((groupings: IGrouping[]) =>
          this.groupingService.addGroupingToCollectionIfMissing<IGrouping>(groupings, this.leaderBoards?.grouping)
        )
      )
      .subscribe((groupings: IGrouping[]) => (this.groupingsCollection = groupings));

    this.progressService
      .query({ filter: 'leaderboards-is-null' })
      .pipe(map((res: HttpResponse<IProgress[]>) => res.body ?? []))
      .pipe(
        map((progresses: IProgress[]) =>
          this.progressService.addProgressToCollectionIfMissing<IProgress>(progresses, this.leaderBoards?.progress)
        )
      )
      .subscribe((progresses: IProgress[]) => (this.progressesCollection = progresses));
  }
}
