import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { HabitstrackingFormService, HabitstrackingFormGroup } from './habitstracking-form.service';
import { IHabitstracking } from '../habitstracking.model';
import { HabitstrackingService } from '../service/habitstracking.service';

@Component({
  selector: 'jhi-habitstracking-update',
  templateUrl: './habitstracking-update.component.html',
})
export class HabitstrackingUpdateComponent implements OnInit {
  isSaving = false;
  habitstracking: IHabitstracking | null = null;

  editForm: HabitstrackingFormGroup = this.habitstrackingFormService.createHabitstrackingFormGroup();

  constructor(
    protected habitstrackingService: HabitstrackingService,
    protected habitstrackingFormService: HabitstrackingFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ habitstracking }) => {
      this.habitstracking = habitstracking;
      if (habitstracking) {
        this.updateForm(habitstracking);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const habitstracking = this.habitstrackingFormService.getHabitstracking(this.editForm);
    if (habitstracking.id !== null) {
      this.subscribeToSaveResponse(this.habitstrackingService.update(habitstracking));
    } else {
      this.subscribeToSaveResponse(this.habitstrackingService.create(habitstracking));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHabitstracking>>): void {
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

  protected updateForm(habitstracking: IHabitstracking): void {
    this.habitstracking = habitstracking;
    this.habitstrackingFormService.resetForm(this.editForm, habitstracking);
  }
}
