import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UserPointsFormService, UserPointsFormGroup } from './user-points-form.service';
import { IUserPoints } from '../user-points.model';
import { UserPointsService } from '../service/user-points.service';
import { ILeaderBoards } from 'app/entities/leader-boards/leader-boards.model';
import { LeaderBoardsService } from 'app/entities/leader-boards/service/leader-boards.service';

@Component({
  selector: 'jhi-user-points-update',
  templateUrl: './user-points-update.component.html',
})
export class UserPointsUpdateComponent implements OnInit {
  isSaving = false;
  userPoints: IUserPoints | null = null;

  leaderBoardsSharedCollection: ILeaderBoards[] = [];

  editForm: UserPointsFormGroup = this.userPointsFormService.createUserPointsFormGroup();

  constructor(
    protected userPointsService: UserPointsService,
    protected userPointsFormService: UserPointsFormService,
    protected leaderBoardsService: LeaderBoardsService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareLeaderBoards = (o1: ILeaderBoards | null, o2: ILeaderBoards | null): boolean =>
    this.leaderBoardsService.compareLeaderBoards(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userPoints }) => {
      this.userPoints = userPoints;
      if (userPoints) {
        this.updateForm(userPoints);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userPoints = this.userPointsFormService.getUserPoints(this.editForm);
    if (userPoints.id !== null) {
      this.subscribeToSaveResponse(this.userPointsService.update(userPoints));
    } else {
      this.subscribeToSaveResponse(this.userPointsService.create(userPoints));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserPoints>>): void {
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

  protected updateForm(userPoints: IUserPoints): void {
    this.userPoints = userPoints;
    this.userPointsFormService.resetForm(this.editForm, userPoints);

    this.leaderBoardsSharedCollection = this.leaderBoardsService.addLeaderBoardsToCollectionIfMissing<ILeaderBoards>(
      this.leaderBoardsSharedCollection,
      userPoints.leaderBoards
    );
  }

  protected loadRelationshipsOptions(): void {
    this.leaderBoardsService
      .query()
      .pipe(map((res: HttpResponse<ILeaderBoards[]>) => res.body ?? []))
      .pipe(
        map((leaderBoards: ILeaderBoards[]) =>
          this.leaderBoardsService.addLeaderBoardsToCollectionIfMissing<ILeaderBoards>(leaderBoards, this.userPoints?.leaderBoards)
        )
      )
      .subscribe((leaderBoards: ILeaderBoards[]) => (this.leaderBoardsSharedCollection = leaderBoards));
  }
}
