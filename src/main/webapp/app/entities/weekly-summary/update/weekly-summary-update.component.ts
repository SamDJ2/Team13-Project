import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { WeeklySummaryFormService, WeeklySummaryFormGroup } from './weekly-summary-form.service';
import { IWeeklySummary } from '../weekly-summary.model';
import { WeeklySummaryService } from '../service/weekly-summary.service';

@Component({
  selector: 'jhi-weekly-summary-update',
  templateUrl: './weekly-summary-update.component.html',
})
export class WeeklySummaryUpdateComponent implements OnInit {
  isSaving = false;
  weeklySummary: IWeeklySummary | null = null;

  editForm: WeeklySummaryFormGroup = this.weeklySummaryFormService.createWeeklySummaryFormGroup();

  constructor(
    protected weeklySummaryService: WeeklySummaryService,
    protected weeklySummaryFormService: WeeklySummaryFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ weeklySummary }) => {
      this.weeklySummary = weeklySummary;
      if (weeklySummary) {
        this.updateForm(weeklySummary);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const weeklySummary = this.weeklySummaryFormService.getWeeklySummary(this.editForm);
    if (weeklySummary.id !== null) {
      this.subscribeToSaveResponse(this.weeklySummaryService.update(weeklySummary));
    } else {
      this.subscribeToSaveResponse(this.weeklySummaryService.create(weeklySummary));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWeeklySummary>>): void {
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

  protected updateForm(weeklySummary: IWeeklySummary): void {
    this.weeklySummary = weeklySummary;
    this.weeklySummaryFormService.resetForm(this.editForm, weeklySummary);
  }
}
