import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PromptsPageFormService, PromptsPageFormGroup } from './prompts-page-form.service';
import { IPromptsPage } from '../prompts-page.model';
import { PromptsPageService } from '../service/prompts-page.service';
import { IMoodPicker } from 'app/entities/mood-picker/mood-picker.model';
import { MoodPickerService } from 'app/entities/mood-picker/service/mood-picker.service';
import { IEmotionPage } from 'app/entities/emotion-page/emotion-page.model';
import { EmotionPageService } from 'app/entities/emotion-page/service/emotion-page.service';
import { IMoodJournalPage } from 'app/entities/mood-journal-page/mood-journal-page.model';
import { MoodJournalPageService } from 'app/entities/mood-journal-page/service/mood-journal-page.service';
import { TabLabel } from 'app/entities/enumerations/tab-label.model';

@Component({
  selector: 'jhi-prompts-page-update',
  templateUrl: './prompts-page-update.component.html',
})
export class PromptsPageUpdateComponent implements OnInit {
  isSaving = false;
  promptsPage: IPromptsPage | null = null;
  tabLabelValues = Object.keys(TabLabel);

  moodPickersCollection: IMoodPicker[] = [];
  emotionPagesCollection: IEmotionPage[] = [];
  moodJournalPagesSharedCollection: IMoodJournalPage[] = [];

  editForm: PromptsPageFormGroup = this.promptsPageFormService.createPromptsPageFormGroup();

  constructor(
    protected promptsPageService: PromptsPageService,
    protected promptsPageFormService: PromptsPageFormService,
    protected moodPickerService: MoodPickerService,
    protected emotionPageService: EmotionPageService,
    protected moodJournalPageService: MoodJournalPageService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareMoodPicker = (o1: IMoodPicker | null, o2: IMoodPicker | null): boolean => this.moodPickerService.compareMoodPicker(o1, o2);

  compareEmotionPage = (o1: IEmotionPage | null, o2: IEmotionPage | null): boolean => this.emotionPageService.compareEmotionPage(o1, o2);

  compareMoodJournalPage = (o1: IMoodJournalPage | null, o2: IMoodJournalPage | null): boolean =>
    this.moodJournalPageService.compareMoodJournalPage(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ promptsPage }) => {
      this.promptsPage = promptsPage;
      if (promptsPage) {
        this.updateForm(promptsPage);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const promptsPage = this.promptsPageFormService.getPromptsPage(this.editForm);
    if (promptsPage.id !== null) {
      this.subscribeToSaveResponse(this.promptsPageService.update(promptsPage));
    } else {
      this.subscribeToSaveResponse(this.promptsPageService.create(promptsPage));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPromptsPage>>): void {
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

  protected updateForm(promptsPage: IPromptsPage): void {
    this.promptsPage = promptsPage;
    this.promptsPageFormService.resetForm(this.editForm, promptsPage);

    this.moodPickersCollection = this.moodPickerService.addMoodPickerToCollectionIfMissing<IMoodPicker>(
      this.moodPickersCollection,
      promptsPage.moodPicker
    );
    this.emotionPagesCollection = this.emotionPageService.addEmotionPageToCollectionIfMissing<IEmotionPage>(
      this.emotionPagesCollection,
      promptsPage.emotionPage
    );
    this.moodJournalPagesSharedCollection = this.moodJournalPageService.addMoodJournalPageToCollectionIfMissing<IMoodJournalPage>(
      this.moodJournalPagesSharedCollection,
      promptsPage.moodJournalPage
    );
  }

  protected loadRelationshipsOptions(): void {
    this.moodPickerService
      .query({ filter: 'promptspage-is-null' })
      .pipe(map((res: HttpResponse<IMoodPicker[]>) => res.body ?? []))
      .pipe(
        map((moodPickers: IMoodPicker[]) =>
          this.moodPickerService.addMoodPickerToCollectionIfMissing<IMoodPicker>(moodPickers, this.promptsPage?.moodPicker)
        )
      )
      .subscribe((moodPickers: IMoodPicker[]) => (this.moodPickersCollection = moodPickers));

    this.emotionPageService
      .query({ filter: 'promptspage-is-null' })
      .pipe(map((res: HttpResponse<IEmotionPage[]>) => res.body ?? []))
      .pipe(
        map((emotionPages: IEmotionPage[]) =>
          this.emotionPageService.addEmotionPageToCollectionIfMissing<IEmotionPage>(emotionPages, this.promptsPage?.emotionPage)
        )
      )
      .subscribe((emotionPages: IEmotionPage[]) => (this.emotionPagesCollection = emotionPages));

    this.moodJournalPageService
      .query()
      .pipe(map((res: HttpResponse<IMoodJournalPage[]>) => res.body ?? []))
      .pipe(
        map((moodJournalPages: IMoodJournalPage[]) =>
          this.moodJournalPageService.addMoodJournalPageToCollectionIfMissing<IMoodJournalPage>(
            moodJournalPages,
            this.promptsPage?.moodJournalPage
          )
        )
      )
      .subscribe((moodJournalPages: IMoodJournalPage[]) => (this.moodJournalPagesSharedCollection = moodJournalPages));
  }
}
