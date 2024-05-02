import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { SmokingFormService, SmokingFormGroup } from './smoking-form.service';
import { ISmoking } from '../smoking.model';
import { SmokingService } from '../service/smoking.service';

@Component({
  selector: 'jhi-smoking-update',
  templateUrl: './smoking-update.component.html',
})
export class SmokingUpdateComponent implements OnInit {
  isSaving = false;
  smoking: ISmoking | null = null;

  editForm: SmokingFormGroup = this.smokingFormService.createSmokingFormGroup();

  constructor(
    protected smokingService: SmokingService,
    protected smokingFormService: SmokingFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ smoking }) => {
      this.smoking = smoking;
      if (smoking) {
        this.updateForm(smoking);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const smoking = this.smokingFormService.getSmoking(this.editForm);
    if (smoking.id !== null) {
      this.subscribeToSaveResponse(this.smokingService.update(smoking));
    } else {
      this.subscribeToSaveResponse(this.smokingService.create(smoking));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISmoking>>): void {
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

  protected updateForm(smoking: ISmoking): void {
    this.smoking = smoking;
    this.smokingFormService.resetForm(this.editForm, smoking);
  }
}
