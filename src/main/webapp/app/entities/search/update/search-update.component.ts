import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { SearchFormService, SearchFormGroup } from './search-form.service';
import { ISearch } from '../search.model';
import { SearchService } from '../service/search.service';

@Component({
  selector: 'jhi-search-update',
  templateUrl: './search-update.component.html',
})
export class SearchUpdateComponent implements OnInit {
  isSaving = false;
  search: ISearch | null = null;

  editForm: SearchFormGroup = this.searchFormService.createSearchFormGroup();

  constructor(
    protected searchService: SearchService,
    protected searchFormService: SearchFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ search }) => {
      this.search = search;
      if (search) {
        this.updateForm(search);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const search = this.searchFormService.getSearch(this.editForm);
    if (search.id !== null) {
      this.subscribeToSaveResponse(this.searchService.update(search));
    } else {
      this.subscribeToSaveResponse(this.searchService.create(search));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISearch>>): void {
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

  protected updateForm(search: ISearch): void {
    this.search = search;
    this.searchFormService.resetForm(this.editForm, search);
  }
}
