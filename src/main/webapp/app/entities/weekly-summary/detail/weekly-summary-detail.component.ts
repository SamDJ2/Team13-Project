import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWeeklySummary } from '../weekly-summary.model';

@Component({
  selector: 'jhi-weekly-summary-detail',
  templateUrl: './weekly-summary-detail.component.html',
})
export class WeeklySummaryDetailComponent implements OnInit {
  weeklySummary: IWeeklySummary | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ weeklySummary }) => {
      this.weeklySummary = weeklySummary;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
