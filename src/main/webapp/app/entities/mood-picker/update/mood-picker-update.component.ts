import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MoodPickerFormService, MoodPickerFormGroup } from './mood-picker-form.service';
import { IMoodPicker } from '../mood-picker.model';
import { MoodPickerService } from '../service/mood-picker.service';
import { INavigationPortal } from 'app/entities/navigation-portal/navigation-portal.model';
import { NavigationPortalService } from 'app/entities/navigation-portal/service/navigation-portal.service';
import { Moods } from 'app/entities/enumerations/moods.model';

@Component({
  selector: 'jhi-mood-picker-update',
  templateUrl: './mood-picker-update.component.html',
})
export class MoodPickerUpdateComponent implements OnInit {
  isSaving = false;
  moodPicker: IMoodPicker | null = null;
  moodsValues = Object.keys(Moods);

  navigationPortalsCollection: INavigationPortal[] = [];

  editForm: MoodPickerFormGroup = this.moodPickerFormService.createMoodPickerFormGroup();

  constructor(
    protected moodPickerService: MoodPickerService,
    protected moodPickerFormService: MoodPickerFormService,
    protected navigationPortalService: NavigationPortalService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareNavigationPortal = (o1: INavigationPortal | null, o2: INavigationPortal | null): boolean =>
    this.navigationPortalService.compareNavigationPortal(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ moodPicker }) => {
      this.moodPicker = moodPicker;
      if (moodPicker) {
        this.updateForm(moodPicker);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const moodPicker = this.moodPickerFormService.getMoodPicker(this.editForm);
    if (moodPicker.id !== null) {
      this.subscribeToSaveResponse(this.moodPickerService.update(moodPicker));
    } else {
      this.subscribeToSaveResponse(this.moodPickerService.create(moodPicker));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMoodPicker>>): void {
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

  protected updateForm(moodPicker: IMoodPicker): void {
    this.moodPicker = moodPicker;
    this.moodPickerFormService.resetForm(this.editForm, moodPicker);

    this.navigationPortalsCollection = this.navigationPortalService.addNavigationPortalToCollectionIfMissing<INavigationPortal>(
      this.navigationPortalsCollection,
      moodPicker.navigationPortal
    );
  }

  protected loadRelationshipsOptions(): void {
    this.navigationPortalService
      .query({ filter: 'moodpicker-is-null' })
      .pipe(map((res: HttpResponse<INavigationPortal[]>) => res.body ?? []))
      .pipe(
        map((navigationPortals: INavigationPortal[]) =>
          this.navigationPortalService.addNavigationPortalToCollectionIfMissing<INavigationPortal>(
            navigationPortals,
            this.moodPicker?.navigationPortal
          )
        )
      )
      .subscribe((navigationPortals: INavigationPortal[]) => (this.navigationPortalsCollection = navigationPortals));
  }
}
