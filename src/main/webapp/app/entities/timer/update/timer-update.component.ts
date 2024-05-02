import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { TimerFormService, TimerFormGroup } from './timer-form.service';
import { ITimer } from '../timer.model';
import { TimerService } from '../service/timer.service';
import { IUserDB } from 'app/entities/user-db/user-db.model';
import { UserDBService } from 'app/entities/user-db/service/user-db.service';

@Component({
  selector: 'jhi-timer-update',
  templateUrl: './timer-update.component.html',
})
export class TimerUpdateComponent implements OnInit {
  isSaving = false;
  timer: ITimer | null = null;

  userDBSSharedCollection: IUserDB[] = [];

  editForm: TimerFormGroup = this.timerFormService.createTimerFormGroup();

  constructor(
    protected timerService: TimerService,
    protected timerFormService: TimerFormService,
    protected userDBService: UserDBService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUserDB = (o1: IUserDB | null, o2: IUserDB | null): boolean => this.userDBService.compareUserDB(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ timer }) => {
      this.timer = timer;
      if (timer) {
        this.updateForm(timer);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const timer = this.timerFormService.getTimer(this.editForm);
    if (timer.id !== null) {
      this.subscribeToSaveResponse(this.timerService.update(timer));
    } else {
      this.subscribeToSaveResponse(this.timerService.create(timer));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITimer>>): void {
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

  protected updateForm(timer: ITimer): void {
    this.timer = timer;
    this.timerFormService.resetForm(this.editForm, timer);

    this.userDBSSharedCollection = this.userDBService.addUserDBToCollectionIfMissing<IUserDB>(this.userDBSSharedCollection, timer.timings);
  }

  protected loadRelationshipsOptions(): void {
    this.userDBService
      .query()
      .pipe(map((res: HttpResponse<IUserDB[]>) => res.body ?? []))
      .pipe(map((userDBS: IUserDB[]) => this.userDBService.addUserDBToCollectionIfMissing<IUserDB>(userDBS, this.timer?.timings)))
      .subscribe((userDBS: IUserDB[]) => (this.userDBSSharedCollection = userDBS));
  }
}
