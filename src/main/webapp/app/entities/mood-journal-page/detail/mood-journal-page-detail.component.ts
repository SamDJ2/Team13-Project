import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMoodJournalPage } from '../mood-journal-page.model';

@Component({
  selector: 'jhi-mood-journal-page-detail',
  templateUrl: './mood-journal-page-detail.component.html',
})
export class MoodJournalPageDetailComponent implements OnInit {
  moodJournalPage: IMoodJournalPage | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ moodJournalPage }) => {
      this.moodJournalPage = moodJournalPage;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
