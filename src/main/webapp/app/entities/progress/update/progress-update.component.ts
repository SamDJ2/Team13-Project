import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ProgressFormService, ProgressFormGroup } from './progress-form.service';
import { IProgress } from '../progress.model';
import { ProgressService } from '../service/progress.service';

@Component({
  selector: 'jhi-progress-update',
  templateUrl: './progress-update.component.html',
})
export class ProgressUpdateComponent implements OnInit {
  isSaving = false;
  progress: IProgress | null = null;

  editForm: ProgressFormGroup = this.progressFormService.createProgressFormGroup();

  constructor(
    protected progressService: ProgressService,
    protected progressFormService: ProgressFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ progress }) => {
      this.progress = progress;
      if (progress) {
        this.updateForm(progress);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const progress = this.progressFormService.getProgress(this.editForm);
    if (progress.id !== null) {
      this.subscribeToSaveResponse(this.progressService.update(progress));
    } else {
      this.subscribeToSaveResponse(this.progressService.create(progress));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProgress>>): void {
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

  protected updateForm(progress: IProgress): void {
    this.progress = progress;
    this.progressFormService.resetForm(this.editForm, progress);
  }
}
