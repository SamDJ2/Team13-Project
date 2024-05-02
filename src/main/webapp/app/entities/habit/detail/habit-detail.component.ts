import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IHabit } from '../habit.model';

@Component({
  selector: 'jhi-habit-detail',
  templateUrl: './habit-detail.component.html',
})
export class HabitDetailComponent implements OnInit {
  habit: IHabit | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ habit }) => {
      this.habit = habit;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
