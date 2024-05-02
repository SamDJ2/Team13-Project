import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { HistoryFormService, HistoryFormGroup } from './history-form.service';
import { IHistory } from '../history.model';
import { HistoryService } from '../service/history.service';

@Component({
  selector: 'jhi-history-update',
  templateUrl: './history-update.component.html',
})
export class HistoryUpdateComponent implements OnInit {
  isSaving = false;
  history: IHistory | null = null;

  editForm: HistoryFormGroup = this.historyFormService.createHistoryFormGroup();

  constructor(
    protected historyService: HistoryService,
    protected historyFormService: HistoryFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ history }) => {
      this.history = history;
      if (history) {
        this.updateForm(history);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const history = this.historyFormService.getHistory(this.editForm);
    if (history.id !== null) {
      this.subscribeToSaveResponse(this.historyService.update(history));
    } else {
      this.subscribeToSaveResponse(this.historyService.create(history));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHistory>>): void {
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

  protected updateForm(history: IHistory): void {
    this.history = history;
    this.historyFormService.resetForm(this.editForm, history);
  }
}
