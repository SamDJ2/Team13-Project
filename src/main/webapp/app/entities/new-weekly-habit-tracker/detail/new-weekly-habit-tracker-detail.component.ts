import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { INewWeeklyHabitTracker } from '../new-weekly-habit-tracker.model';

@Component({
  selector: 'jhi-new-weekly-habit-tracker-detail',
  templateUrl: './new-weekly-habit-tracker-detail.component.html',
})
export class NewWeeklyHabitTrackerDetailComponent implements OnInit {
  newWeeklyHabitTracker: INewWeeklyHabitTracker | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ newWeeklyHabitTracker }) => {
      this.newWeeklyHabitTracker = newWeeklyHabitTracker;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
