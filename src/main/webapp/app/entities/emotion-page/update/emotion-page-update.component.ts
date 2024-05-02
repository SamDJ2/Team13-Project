import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { EmotionPageFormService, EmotionPageFormGroup } from './emotion-page-form.service';
import { IEmotionPage } from '../emotion-page.model';
import { EmotionPageService } from '../service/emotion-page.service';
import { IMoodPicker } from 'app/entities/mood-picker/mood-picker.model';
import { MoodPickerService } from 'app/entities/mood-picker/service/mood-picker.service';
import { AIGeneratedPrompts } from 'app/entities/enumerations/ai-generated-prompts.model';
import { TabLabel } from 'app/entities/enumerations/tab-label.model';

@Component({
  selector: 'jhi-emotion-page-update',
  templateUrl: './emotion-page-update.component.html',
})
export class EmotionPageUpdateComponent implements OnInit {
  isSaving = false;
  emotionPage: IEmotionPage | null = null;
  aIGeneratedPromptsValues = Object.keys(AIGeneratedPrompts);
  tabLabelValues = Object.keys(TabLabel);

  moodPickersCollection: IMoodPicker[] = [];

  editForm: EmotionPageFormGroup = this.emotionPageFormService.createEmotionPageFormGroup();

  constructor(
    protected emotionPageService: EmotionPageService,
    protected emotionPageFormService: EmotionPageFormService,
    protected moodPickerService: MoodPickerService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareMoodPicker = (o1: IMoodPicker | null, o2: IMoodPicker | null): boolean => this.moodPickerService.compareMoodPicker(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ emotionPage }) => {
      this.emotionPage = emotionPage;
      if (emotionPage) {
        this.updateForm(emotionPage);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const emotionPage = this.emotionPageFormService.getEmotionPage(this.editForm);
    if (emotionPage.id !== null) {
      this.subscribeToSaveResponse(this.emotionPageService.update(emotionPage));
    } else {
      this.subscribeToSaveResponse(this.emotionPageService.create(emotionPage));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmotionPage>>): void {
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

  protected updateForm(emotionPage: IEmotionPage): void {
    this.emotionPage = emotionPage;
    this.emotionPageFormService.resetForm(this.editForm, emotionPage);

    this.moodPickersCollection = this.moodPickerService.addMoodPickerToCollectionIfMissing<IMoodPicker>(
      this.moodPickersCollection,
      emotionPage.moodPicker
    );
  }

  protected loadRelationshipsOptions(): void {
    this.moodPickerService
      .query({ filter: 'emotionpage-is-null' })
      .pipe(map((res: HttpResponse<IMoodPicker[]>) => res.body ?? []))
      .pipe(
        map((moodPickers: IMoodPicker[]) =>
          this.moodPickerService.addMoodPickerToCollectionIfMissing<IMoodPicker>(moodPickers, this.emotionPage?.moodPicker)
        )
      )
      .subscribe((moodPickers: IMoodPicker[]) => (this.moodPickersCollection = moodPickers));
  }
}
