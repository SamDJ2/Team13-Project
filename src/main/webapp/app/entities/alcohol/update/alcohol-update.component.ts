import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AlcoholFormService, AlcoholFormGroup } from './alcohol-form.service';
import { IAlcohol } from '../alcohol.model';
import { AlcoholService } from '../service/alcohol.service';

@Component({
  selector: 'jhi-alcohol-update',
  templateUrl: './alcohol-update.component.html',
})
export class AlcoholUpdateComponent implements OnInit {
  isSaving = false;
  alcohol: IAlcohol | null = null;

  editForm: AlcoholFormGroup = this.alcoholFormService.createAlcoholFormGroup();

  constructor(
    protected alcoholService: AlcoholService,
    protected alcoholFormService: AlcoholFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ alcohol }) => {
      this.alcohol = alcohol;
      if (alcohol) {
        this.updateForm(alcohol);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const alcohol = this.alcoholFormService.getAlcohol(this.editForm);
    if (alcohol.id !== null) {
      this.subscribeToSaveResponse(this.alcoholService.update(alcohol));
    } else {
      this.subscribeToSaveResponse(this.alcoholService.create(alcohol));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAlcohol>>): void {
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

  protected updateForm(alcohol: IAlcohol): void {
    this.alcohol = alcohol;
    this.alcoholFormService.resetForm(this.editForm, alcohol);
  }
}
