import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { FilteredFormService, FilteredFormGroup } from './filtered-form.service';
import { IFiltered } from '../filtered.model';
import { FilteredService } from '../service/filtered.service';

@Component({
  selector: 'jhi-filtered-update',
  templateUrl: './filtered-update.component.html',
})
export class FilteredUpdateComponent implements OnInit {
  isSaving = false;
  filtered: IFiltered | null = null;

  editForm: FilteredFormGroup = this.filteredFormService.createFilteredFormGroup();

  constructor(
    protected filteredService: FilteredService,
    protected filteredFormService: FilteredFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ filtered }) => {
      this.filtered = filtered;
      if (filtered) {
        this.updateForm(filtered);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const filtered = this.filteredFormService.getFiltered(this.editForm);
    if (filtered.id !== null) {
      this.subscribeToSaveResponse(this.filteredService.update(filtered));
    } else {
      this.subscribeToSaveResponse(this.filteredService.create(filtered));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFiltered>>): void {
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

  protected updateForm(filtered: IFiltered): void {
    this.filtered = filtered;
    this.filteredFormService.resetForm(this.editForm, filtered);
  }
}
