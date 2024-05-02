import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITimer } from '../timer.model';

@Component({
  selector: 'jhi-timer-detail',
  templateUrl: './timer-detail.component.html',
})
export class TimerDetailComponent implements OnInit {
  timer: ITimer | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ timer }) => {
      this.timer = timer;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
