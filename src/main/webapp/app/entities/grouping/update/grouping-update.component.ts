import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { GroupingFormService, GroupingFormGroup } from './grouping-form.service';
import { IGrouping } from '../grouping.model';
import { GroupingService } from '../service/grouping.service';

@Component({
  selector: 'jhi-grouping-update',
  templateUrl: './grouping-update.component.html',
})
export class GroupingUpdateComponent implements OnInit {
  isSaving = false;
  grouping: IGrouping | null = null;

  editForm: GroupingFormGroup = this.groupingFormService.createGroupingFormGroup();

  constructor(
    protected groupingService: GroupingService,
    protected groupingFormService: GroupingFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ grouping }) => {
      this.grouping = grouping;
      if (grouping) {
        this.updateForm(grouping);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const grouping = this.groupingFormService.getGrouping(this.editForm);
    if (grouping.id !== null) {
      this.subscribeToSaveResponse(this.groupingService.update(grouping));
    } else {
      this.subscribeToSaveResponse(this.groupingService.create(grouping));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGrouping>>): void {
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

  protected updateForm(grouping: IGrouping): void {
    this.grouping = grouping;
    this.groupingFormService.resetForm(this.editForm, grouping);
  }
}
