import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { EntriesFeatureFormService, EntriesFeatureFormGroup } from './entries-feature-form.service';
import { EntriesFeature } from '../entries-feature.model';
import { EntriesFeatureService } from '../service/entries-feature.service';

@Component({
  selector: 'jhi-entries-feature-update',
  templateUrl: './entries-feature-update.component.html',
})
export class EntriesFeatureUpdateComponent implements OnInit {
  isSaving = false;
  entriesFeature: EntriesFeature | null = null;

  editForm: EntriesFeatureFormGroup = this.entriesFeatureFormService.createEntriesFeatureFormGroup();

  constructor(
    protected entriesFeatureService: EntriesFeatureService,
    protected entriesFeatureFormService: EntriesFeatureFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ entriesFeature }) => {
      this.entriesFeature = entriesFeature;
      if (entriesFeature) {
        this.updateForm(entriesFeature);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const entriesFeature = this.entriesFeatureFormService.getEntriesFeature(this.editForm);
    if (entriesFeature.id !== null) {
      this.subscribeToSaveResponse(this.entriesFeatureService.update(entriesFeature));
    } else {
      this.subscribeToSaveResponse(this.entriesFeatureService.create(entriesFeature));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<EntriesFeature>>): void {
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

  protected updateForm(entriesFeature: EntriesFeature): void {
    this.entriesFeature = entriesFeature;
    this.entriesFeatureFormService.resetForm(this.editForm, entriesFeature);
  }
}
