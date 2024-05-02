import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IHistory } from '../history.model';

@Component({
  selector: 'jhi-history-detail',
  templateUrl: './history-detail.component.html',
})
export class HistoryDetailComponent implements OnInit {
  history: IHistory | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ history }) => {
      this.history = history;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
