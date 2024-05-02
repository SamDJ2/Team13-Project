import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { EntriesPageFormService, EntriesPageFormGroup } from './entries-page-form.service';
import { IEntriesPage } from '../entries-page.model';
import { EntriesPageService } from '../service/entries-page.service';
import { IMoodJournalPage } from 'app/entities/mood-journal-page/mood-journal-page.model';
import { MoodJournalPageService } from 'app/entities/mood-journal-page/service/mood-journal-page.service';
import { TabLabel } from 'app/entities/enumerations/tab-label.model';

@Component({
  selector: 'jhi-entries-page-update',
  templateUrl: './entries-page-update.component.html',
})
export class EntriesPageUpdateComponent implements OnInit {
  isSaving = false;
  entriesPage: IEntriesPage | null = null;
  tabLabelValues = Object.keys(TabLabel);

  moodJournalPagesSharedCollection: IMoodJournalPage[] = [];

  editForm: EntriesPageFormGroup = this.entriesPageFormService.createEntriesPageFormGroup();

  constructor(
    protected entriesPageService: EntriesPageService,
    protected entriesPageFormService: EntriesPageFormService,
    protected moodJournalPageService: MoodJournalPageService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareMoodJournalPage = (o1: IMoodJournalPage | null, o2: IMoodJournalPage | null): boolean =>
    this.moodJournalPageService.compareMoodJournalPage(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ entriesPage }) => {
      this.entriesPage = entriesPage;
      if (entriesPage) {
        this.updateForm(entriesPage);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const entriesPage = this.entriesPageFormService.getEntriesPage(this.editForm);
    if (entriesPage.id !== null) {
      this.subscribeToSaveResponse(this.entriesPageService.update(entriesPage));
    } else {
      this.subscribeToSaveResponse(this.entriesPageService.create(entriesPage));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEntriesPage>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(entriesPage: IEntriesPage): void {
    this.entriesPage = entriesPage;
    this.entriesPageFormService.resetForm(this.editForm, entriesPage);

    this.moodJournalPagesSharedCollection = this.moodJournalPageService.addMoodJournalPageToCollectionIfMissing<IMoodJournalPage>(
      this.moodJournalPagesSharedCollection,
      entriesPage.moodJournalPage
    );
  }

  protected loadRelationshipsOptions(): void {
    this.moodJournalPageService
      .query()
      .pipe(map((res: HttpResponse<IMoodJournalPage[]>) => res.body ?? []))
      .pipe(
        map((moodJournalPages: IMoodJournalPage[]) =>
          this.moodJournalPageService.addMoodJournalPageToCollectionIfMissing<IMoodJournalPage>(
            moodJournalPages,
            this.entriesPage?.moodJournalPage
          )
        )
      )
      .subscribe((moodJournalPages: IMoodJournalPage[]) => (this.moodJournalPagesSharedCollection = moodJournalPages));
  }
}
