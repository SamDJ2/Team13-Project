import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { NewMoodPickerFormService, NewMoodPickerFormGroup } from './new-mood-picker-form.service';
import { INewMoodPicker } from '../new-mood-picker.model';
import { NewMoodPickerService } from '../service/new-mood-picker.service';

@Component({
  selector: 'jhi-new-mood-picker-update',
  templateUrl: './new-mood-picker-update.component.html',
})
export class NewMoodPickerUpdateComponent implements OnInit {
  isSaving = false;
  newMoodPicker: INewMoodPicker | null = null;

  editForm: NewMoodPickerFormGroup = this.newMoodPickerFormService.createNewMoodPickerFormGroup();

  constructor(
    protected newMoodPickerService: NewMoodPickerService,
    protected newMoodPickerFormService: NewMoodPickerFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ newMoodPicker }) => {
      this.newMoodPicker = newMoodPicker;
      if (newMoodPicker) {
        this.updateForm(newMoodPicker);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const newMoodPicker = this.newMoodPickerFormService.getNewMoodPicker(this.editForm);
    if (newMoodPicker.id !== null) {
      this.subscribeToSaveResponse(this.newMoodPickerService.update(newMoodPicker));
    } else {
      this.subscribeToSaveResponse(this.newMoodPickerService.create(newMoodPicker));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INewMoodPicker>>): void {
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

  protected updateForm(newMoodPicker: INewMoodPicker): void {
    this.newMoodPicker = newMoodPicker;
    this.newMoodPickerFormService.resetForm(this.editForm, newMoodPicker);
  }
}
