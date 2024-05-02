import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { MoodJournalPageFormService, MoodJournalPageFormGroup } from './mood-journal-page-form.service';
import { IMoodJournalPage } from '../mood-journal-page.model';
import { MoodJournalPageService } from '../service/mood-journal-page.service';
import { TabLabel } from 'app/entities/enumerations/tab-label.model';

@Component({
  selector: 'jhi-mood-journal-page-update',
  templateUrl: './mood-journal-page-update.component.html',
})
export class MoodJournalPageUpdateComponent implements OnInit {
  isSaving = false;
  moodJournalPage: IMoodJournalPage | null = null;
  tabLabelValues = Object.keys(TabLabel);

  editForm: MoodJournalPageFormGroup = this.moodJournalPageFormService.createMoodJournalPageFormGroup();

  constructor(
    protected moodJournalPageService: MoodJournalPageService,
    protected moodJournalPageFormService: MoodJournalPageFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ moodJournalPage }) => {
      this.moodJournalPage = moodJournalPage;
      if (moodJournalPage) {
        this.updateForm(moodJournalPage);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const moodJournalPage = this.moodJournalPageFormService.getMoodJournalPage(this.editForm);
    if (moodJournalPage.id !== null) {
      this.subscribeToSaveResponse(this.moodJournalPageService.update(moodJournalPage));
    } else {
      this.subscribeToSaveResponse(this.moodJournalPageService.create(moodJournalPage));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMoodJournalPage>>): void {
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

  protected updateForm(moodJournalPage: IMoodJournalPage): void {
    this.moodJournalPage = moodJournalPage;
    this.moodJournalPageFormService.resetForm(this.editForm, moodJournalPage);
  }
}
