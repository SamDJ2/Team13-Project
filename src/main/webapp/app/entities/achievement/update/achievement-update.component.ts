import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AchievementFormService, AchievementFormGroup } from './achievement-form.service';
import { IAchievement } from '../achievement.model';
import { AchievementService } from '../service/achievement.service';
import { AchievementType } from 'app/entities/enumerations/achievement-type.model';

@Component({
  selector: 'jhi-achievement-update',
  templateUrl: './achievement-update.component.html',
})
export class AchievementUpdateComponent implements OnInit {
  isSaving = false;
  achievement: IAchievement | null = null;
  achievementTypeValues = Object.keys(AchievementType);

  editForm: AchievementFormGroup = this.achievementFormService.createAchievementFormGroup();

  constructor(
    protected achievementService: AchievementService,
    protected achievementFormService: AchievementFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ achievement }) => {
      this.achievement = achievement;
      if (achievement) {
        this.updateForm(achievement);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const achievement = this.achievementFormService.getAchievement(this.editForm);
    if (achievement.id !== null) {
      this.subscribeToSaveResponse(this.achievementService.update(achievement));
    } else {
      this.subscribeToSaveResponse(this.achievementService.create(achievement));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAchievement>>): void {
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

  protected updateForm(achievement: IAchievement): void {
    this.achievement = achievement;
    this.achievementFormService.resetForm(this.editForm, achievement);
  }
}
