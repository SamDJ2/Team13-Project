import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEntriesPage } from '../entries-page.model';

@Component({
  selector: 'jhi-entries-page-detail',
  templateUrl: './entries-page-detail.component.html',
})
export class EntriesPageDetailComponent implements OnInit {
  entriesPage: IEntriesPage | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ entriesPage }) => {
      this.entriesPage = entriesPage;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
