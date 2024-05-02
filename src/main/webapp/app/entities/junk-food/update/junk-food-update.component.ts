import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { JunkFoodFormService, JunkFoodFormGroup } from './junk-food-form.service';
import { IJunkFood } from '../junk-food.model';
import { JunkFoodService } from '../service/junk-food.service';

@Component({
  selector: 'jhi-junk-food-update',
  templateUrl: './junk-food-update.component.html',
})
export class JunkFoodUpdateComponent implements OnInit {
  isSaving = false;
  junkFood: IJunkFood | null = null;

  editForm: JunkFoodFormGroup = this.junkFoodFormService.createJunkFoodFormGroup();

  constructor(
    protected junkFoodService: JunkFoodService,
    protected junkFoodFormService: JunkFoodFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ junkFood }) => {
      this.junkFood = junkFood;
      if (junkFood) {
        this.updateForm(junkFood);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const junkFood = this.junkFoodFormService.getJunkFood(this.editForm);
    if (junkFood.id !== null) {
      this.subscribeToSaveResponse(this.junkFoodService.update(junkFood));
    } else {
      this.subscribeToSaveResponse(this.junkFoodService.create(junkFood));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJunkFood>>): void {
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

  protected updateForm(junkFood: IJunkFood): void {
    this.junkFood = junkFood;
    this.junkFoodFormService.resetForm(this.editForm, junkFood);
  }
}
