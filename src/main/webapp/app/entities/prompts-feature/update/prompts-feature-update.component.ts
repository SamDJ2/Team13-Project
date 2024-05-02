import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { PromptsFeatureFormService, PromptsFeatureFormGroup } from './prompts-feature-form.service';
import { PromptsFeature } from '../prompts-feature.model';
import { PromptsFeatureService } from '../service/prompts-feature.service';

@Component({
  selector: 'jhi-prompts-feature-update',
  templateUrl: './prompts-feature-update.component.html',
})
export class PromptsFeatureUpdateComponent implements OnInit {
  isSaving = false;
  promptsFeature: PromptsFeature | null = null;

  editForm: PromptsFeatureFormGroup = this.promptsFeatureFormService.createPromptsFeatureFormGroup();

  constructor(
    protected promptsFeatureService: PromptsFeatureService,
    protected promptsFeatureFormService: PromptsFeatureFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ promptsFeature }) => {
      this.promptsFeature = promptsFeature;
      if (promptsFeature) {
        this.updateForm(promptsFeature);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const promptsFeature = this.promptsFeatureFormService.getPromptsFeature(this.editForm);
    if (promptsFeature.id !== null) {
      this.subscribeToSaveResponse(this.promptsFeatureService.update(promptsFeature));
    } else {
      this.subscribeToSaveResponse(this.promptsFeatureService.create(promptsFeature));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<PromptsFeature>>): void {
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

  protected updateForm(promptsFeature: PromptsFeature): void {
    this.promptsFeature = promptsFeature;
    this.promptsFeatureFormService.resetForm(this.editForm, promptsFeature);
  }
}
