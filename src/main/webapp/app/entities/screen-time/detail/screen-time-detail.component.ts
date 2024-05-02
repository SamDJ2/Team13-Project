import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IScreenTime } from '../screen-time.model';

@Component({
  selector: 'jhi-screen-time-detail',
  templateUrl: './screen-time-detail.component.html',
})
export class ScreenTimeDetailComponent implements OnInit {
  screenTime: IScreenTime | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ screenTime }) => {
      this.screenTime = screenTime;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
