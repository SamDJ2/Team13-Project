import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { HabitFormService, HabitFormGroup } from './habit-form.service';
import { IHabit } from '../habit.model';
import { HabitService } from '../service/habit.service';

@Component({
  selector: 'jhi-habit-update',
  templateUrl: './habit-update.component.html',
})
export class HabitUpdateComponent implements OnInit {
  isSaving = false;
  habit: IHabit | null = null;

  editForm: HabitFormGroup = this.habitFormService.createHabitFormGroup();

  constructor(
    protected habitService: HabitService,
    protected habitFormService: HabitFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ habit }) => {
      this.habit = habit;
      if (habit) {
        this.updateForm(habit);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const habit = this.habitFormService.getHabit(this.editForm);
    if (habit.id !== null) {
      this.subscribeToSaveResponse(this.habitService.update(habit));
    } else {
      this.subscribeToSaveResponse(this.habitService.create(habit));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHabit>>): void {
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

  protected updateForm(habit: IHabit): void {
    this.habit = habit;
    this.habitFormService.resetForm(this.editForm, habit);
  }
}
