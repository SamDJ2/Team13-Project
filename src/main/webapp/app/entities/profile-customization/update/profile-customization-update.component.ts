import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ProfileCustomizationFormService, ProfileCustomizationFormGroup } from './profile-customization-form.service';
import { IProfileCustomization } from '../profile-customization.model';
import { ProfileCustomizationService } from '../service/profile-customization.service';
import { IJoinedTeams } from 'app/entities/joined-teams/joined-teams.model';
import { JoinedTeamsService } from 'app/entities/joined-teams/service/joined-teams.service';
import { ISetting } from 'app/entities/setting/setting.model';
import { SettingService } from 'app/entities/setting/service/setting.service';
import { IAchievement } from 'app/entities/achievement/achievement.model';
import { AchievementService } from 'app/entities/achievement/service/achievement.service';

@Component({
  selector: 'jhi-profile-customization-update',
  templateUrl: './profile-customization-update.component.html',
})
export class ProfileCustomizationUpdateComponent implements OnInit {
  isSaving = false;
  profileCustomization: IProfileCustomization | null = null;

  joinedTeamsCollection: IJoinedTeams[] = [];
  settingsCollection: ISetting[] = [];
  achievementsCollection: IAchievement[] = [];

  editForm: ProfileCustomizationFormGroup = this.profileCustomizationFormService.createProfileCustomizationFormGroup();

  constructor(
    protected profileCustomizationService: ProfileCustomizationService,
    protected profileCustomizationFormService: ProfileCustomizationFormService,
    protected joinedTeamsService: JoinedTeamsService,
    protected settingService: SettingService,
    protected achievementService: AchievementService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareJoinedTeams = (o1: IJoinedTeams | null, o2: IJoinedTeams | null): boolean => this.joinedTeamsService.compareJoinedTeams(o1, o2);

  compareSetting = (o1: ISetting | null, o2: ISetting | null): boolean => this.settingService.compareSetting(o1, o2);

  compareAchievement = (o1: IAchievement | null, o2: IAchievement | null): boolean => this.achievementService.compareAchievement(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ profileCustomization }) => {
      this.profileCustomization = profileCustomization;
      if (profileCustomization) {
        this.updateForm(profileCustomization);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const profileCustomization = this.profileCustomizationFormService.getProfileCustomization(this.editForm);
    if (profileCustomization.id !== null) {
      this.subscribeToSaveResponse(this.profileCustomizationService.update(profileCustomization));
    } else {
      this.subscribeToSaveResponse(this.profileCustomizationService.create(profileCustomization));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProfileCustomization>>): void {
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

  protected updateForm(profileCustomization: IProfileCustomization): void {
    this.profileCustomization = profileCustomization;
    this.profileCustomizationFormService.resetForm(this.editForm, profileCustomization);

    this.joinedTeamsCollection = this.joinedTeamsService.addJoinedTeamsToCollectionIfMissing<IJoinedTeams>(
      this.joinedTeamsCollection,
      profileCustomization.joinedTeams
    );
    this.settingsCollection = this.settingService.addSettingToCollectionIfMissing<ISetting>(
      this.settingsCollection,
      profileCustomization.setting
    );
    this.achievementsCollection = this.achievementService.addAchievementToCollectionIfMissing<IAchievement>(
      this.achievementsCollection,
      profileCustomization.achievement
    );
  }

  protected loadRelationshipsOptions(): void {
    this.joinedTeamsService
      .query({ filter: 'profilecustomization-is-null' })
      .pipe(map((res: HttpResponse<IJoinedTeams[]>) => res.body ?? []))
      .pipe(
        map((joinedTeams: IJoinedTeams[]) =>
          this.joinedTeamsService.addJoinedTeamsToCollectionIfMissing<IJoinedTeams>(joinedTeams, this.profileCustomization?.joinedTeams)
        )
      )
      .subscribe((joinedTeams: IJoinedTeams[]) => (this.joinedTeamsCollection = joinedTeams));

    this.settingService
      .query({ filter: 'profilecustomization-is-null' })
      .pipe(map((res: HttpResponse<ISetting[]>) => res.body ?? []))
      .pipe(
        map((settings: ISetting[]) =>
          this.settingService.addSettingToCollectionIfMissing<ISetting>(settings, this.profileCustomization?.setting)
        )
      )
      .subscribe((settings: ISetting[]) => (this.settingsCollection = settings));

    this.achievementService
      .query({ filter: 'profilecustomization-is-null' })
      .pipe(map((res: HttpResponse<IAchievement[]>) => res.body ?? []))
      .pipe(
        map((achievements: IAchievement[]) =>
          this.achievementService.addAchievementToCollectionIfMissing<IAchievement>(achievements, this.profileCustomization?.achievement)
        )
      )
      .subscribe((achievements: IAchievement[]) => (this.achievementsCollection = achievements));
  }
}
