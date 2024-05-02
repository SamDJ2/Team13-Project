import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProgress } from '../progress.model';

@Component({
  selector: 'jhi-progress-detail',
  templateUrl: './progress-detail.component.html',
})
export class ProgressDetailComponent implements OnInit {
  progress: IProgress | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ progress }) => {
      this.progress = progress;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
