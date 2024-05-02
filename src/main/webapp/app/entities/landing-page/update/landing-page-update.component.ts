import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LandingPageFormService, LandingPageFormGroup } from './landing-page-form.service';
import { ILandingPage } from '../landing-page.model';
import { LandingPageService } from '../service/landing-page.service';
import { IMoodPicker } from 'app/entities/mood-picker/mood-picker.model';
import { MoodPickerService } from 'app/entities/mood-picker/service/mood-picker.service';

@Component({
  selector: 'jhi-landing-page-update',
  templateUrl: './landing-page-update.component.html',
})
export class LandingPageUpdateComponent implements OnInit {
  isSaving = false;
  landingPage: ILandingPage | null = null;

  moodPickersCollection: IMoodPicker[] = [];

  editForm: LandingPageFormGroup = this.landingPageFormService.createLandingPageFormGroup();

  constructor(
    protected landingPageService: LandingPageService,
    protected landingPageFormService: LandingPageFormService,
    protected moodPickerService: MoodPickerService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareMoodPicker = (o1: IMoodPicker | null, o2: IMoodPicker | null): boolean => this.moodPickerService.compareMoodPicker(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ landingPage }) => {
      this.landingPage = landingPage;
      if (landingPage) {
        this.updateForm(landingPage);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const landingPage = this.landingPageFormService.getLandingPage(this.editForm);
    if (landingPage.id !== null) {
      this.subscribeToSaveResponse(this.landingPageService.update(landingPage));
    } else {
      this.subscribeToSaveResponse(this.landingPageService.create(landingPage));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILandingPage>>): void {
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

  protected updateForm(landingPage: ILandingPage): void {
    this.landingPage = landingPage;
    this.landingPageFormService.resetForm(this.editForm, landingPage);

    this.moodPickersCollection = this.moodPickerService.addMoodPickerToCollectionIfMissing<IMoodPicker>(
      this.moodPickersCollection,
      landingPage.moodPicker
    );
  }

  protected loadRelationshipsOptions(): void {
    this.moodPickerService
      .query({ filter: 'landingpage-is-null' })
      .pipe(map((res: HttpResponse<IMoodPicker[]>) => res.body ?? []))
      .pipe(
        map((moodPickers: IMoodPicker[]) =>
          this.moodPickerService.addMoodPickerToCollectionIfMissing<IMoodPicker>(moodPickers, this.landingPage?.moodPicker)
        )
      )
      .subscribe((moodPickers: IMoodPicker[]) => (this.moodPickersCollection = moodPickers));
  }
}
