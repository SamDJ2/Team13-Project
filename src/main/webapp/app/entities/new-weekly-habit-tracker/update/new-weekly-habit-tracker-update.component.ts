import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { NewWeeklyHabitTrackerFormService, NewWeeklyHabitTrackerFormGroup } from './new-weekly-habit-tracker-form.service';
import { INewWeeklyHabitTracker } from '../new-weekly-habit-tracker.model';
import { NewWeeklyHabitTrackerService } from '../service/new-weekly-habit-tracker.service';
import { IWeeklySummary } from 'app/entities/weekly-summary/weekly-summary.model';
import { WeeklySummaryService } from 'app/entities/weekly-summary/service/weekly-summary.service';
import { IHabit } from 'app/entities/habit/habit.model';
import { HabitService } from 'app/entities/habit/service/habit.service';

@Component({
  selector: 'jhi-new-weekly-habit-tracker-update',
  templateUrl: './new-weekly-habit-tracker-update.component.html',
})
export class NewWeeklyHabitTrackerUpdateComponent implements OnInit {
  isSaving = false;
  newWeeklyHabitTracker: INewWeeklyHabitTracker | null = null;

  weeklySummariesCollection: IWeeklySummary[] = [];
  habitsSharedCollection: IHabit[] = [];

  editForm: NewWeeklyHabitTrackerFormGroup = this.newWeeklyHabitTrackerFormService.createNewWeeklyHabitTrackerFormGroup();

  constructor(
    protected newWeeklyHabitTrackerService: NewWeeklyHabitTrackerService,
    protected newWeeklyHabitTrackerFormService: NewWeeklyHabitTrackerFormService,
    protected weeklySummaryService: WeeklySummaryService,
    protected habitService: HabitService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareWeeklySummary = (o1: IWeeklySummary | null, o2: IWeeklySummary | null): boolean =>
    this.weeklySummaryService.compareWeeklySummary(o1, o2);

  compareHabit = (o1: IHabit | null, o2: IHabit | null): boolean => this.habitService.compareHabit(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ newWeeklyHabitTracker }) => {
      this.newWeeklyHabitTracker = newWeeklyHabitTracker;
      if (newWeeklyHabitTracker) {
        this.updateForm(newWeeklyHabitTracker);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const newWeeklyHabitTracker = this.newWeeklyHabitTrackerFormService.getNewWeeklyHabitTracker(this.editForm);
    if (newWeeklyHabitTracker.id !== null) {
      this.subscribeToSaveResponse(this.newWeeklyHabitTrackerService.update(newWeeklyHabitTracker));
    } else {
      this.subscribeToSaveResponse(this.newWeeklyHabitTrackerService.create(newWeeklyHabitTracker));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INewWeeklyHabitTracker>>): void {
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

  protected updateForm(newWeeklyHabitTracker: INewWeeklyHabitTracker): void {
    this.newWeeklyHabitTracker = newWeeklyHabitTracker;
    this.newWeeklyHabitTrackerFormService.resetForm(this.editForm, newWeeklyHabitTracker);

    this.weeklySummariesCollection = this.weeklySummaryService.addWeeklySummaryToCollectionIfMissing<IWeeklySummary>(
      this.weeklySummariesCollection,
      newWeeklyHabitTracker.weeklySummary
    );
    this.habitsSharedCollection = this.habitService.addHabitToCollectionIfMissing<IHabit>(
      this.habitsSharedCollection,
      newWeeklyHabitTracker.habit
    );
  }

  protected loadRelationshipsOptions(): void {
    this.weeklySummaryService
      .query({ filter: 'newweeklyhabittracker-is-null' })
      .pipe(map((res: HttpResponse<IWeeklySummary[]>) => res.body ?? []))
      .pipe(
        map((weeklySummaries: IWeeklySummary[]) =>
          this.weeklySummaryService.addWeeklySummaryToCollectionIfMissing<IWeeklySummary>(
            weeklySummaries,
            this.newWeeklyHabitTracker?.weeklySummary
          )
        )
      )
      .subscribe((weeklySummaries: IWeeklySummary[]) => (this.weeklySummariesCollection = weeklySummaries));

    this.habitService
      .query()
      .pipe(map((res: HttpResponse<IHabit[]>) => res.body ?? []))
      .pipe(map((habits: IHabit[]) => this.habitService.addHabitToCollectionIfMissing<IHabit>(habits, this.newWeeklyHabitTracker?.habit)))
      .subscribe((habits: IHabit[]) => (this.habitsSharedCollection = habits));
  }
}
