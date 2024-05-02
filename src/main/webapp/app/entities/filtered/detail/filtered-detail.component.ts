import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFiltered } from '../filtered.model';

@Component({
  selector: 'jhi-filtered-detail',
  templateUrl: './filtered-detail.component.html',
})
export class FilteredDetailComponent implements OnInit {
  filtered: IFiltered | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ filtered }) => {
      this.filtered = filtered;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
