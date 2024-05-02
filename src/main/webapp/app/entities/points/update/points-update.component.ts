import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PointsFormService, PointsFormGroup } from './points-form.service';
import { IPoints } from '../points.model';
import { PointsService } from '../service/points.service';
import { ILeaderBoards } from 'app/entities/leader-boards/leader-boards.model';
import { LeaderBoardsService } from 'app/entities/leader-boards/service/leader-boards.service';

@Component({
  selector: 'jhi-points-update',
  templateUrl: './points-update.component.html',
})
export class PointsUpdateComponent implements OnInit {
  isSaving = false;
  points: IPoints | null = null;

  leaderBoardsSharedCollection: ILeaderBoards[] = [];

  editForm: PointsFormGroup = this.pointsFormService.createPointsFormGroup();

  constructor(
    protected pointsService: PointsService,
    protected pointsFormService: PointsFormService,
    protected leaderBoardsService: LeaderBoardsService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareLeaderBoards = (o1: ILeaderBoards | null, o2: ILeaderBoards | null): boolean =>
    this.leaderBoardsService.compareLeaderBoards(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ points }) => {
      this.points = points;
      if (points) {
        this.updateForm(points);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const points = this.pointsFormService.getPoints(this.editForm);
    if (points.id !== null) {
      this.subscribeToSaveResponse(this.pointsService.update(points));
    } else {
      this.subscribeToSaveResponse(this.pointsService.create(points));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPoints>>): void {
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

  protected updateForm(points: IPoints): void {
    this.points = points;
    this.pointsFormService.resetForm(this.editForm, points);

    this.leaderBoardsSharedCollection = this.leaderBoardsService.addLeaderBoardsToCollectionIfMissing<ILeaderBoards>(
      this.leaderBoardsSharedCollection,
      points.leaderBoards
    );
  }

  protected loadRelationshipsOptions(): void {
    this.leaderBoardsService
      .query()
      .pipe(map((res: HttpResponse<ILeaderBoards[]>) => res.body ?? []))
      .pipe(
        map((leaderBoards: ILeaderBoards[]) =>
          this.leaderBoardsService.addLeaderBoardsToCollectionIfMissing<ILeaderBoards>(leaderBoards, this.points?.leaderBoards)
        )
      )
      .subscribe((leaderBoards: ILeaderBoards[]) => (this.leaderBoardsSharedCollection = leaderBoards));
  }
}
