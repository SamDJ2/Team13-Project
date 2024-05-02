import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IHabitstracking } from '../habitstracking.model';

@Component({
  selector: 'jhi-habitstracking-detail',
  templateUrl: './habitstracking-detail.component.html',
})
export class HabitstrackingDetailComponent implements OnInit {
  habitstracking: IHabitstracking | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ habitstracking }) => {
      this.habitstracking = habitstracking;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
