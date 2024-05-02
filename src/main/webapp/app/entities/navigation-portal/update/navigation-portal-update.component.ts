import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { NavigationPortalFormService, NavigationPortalFormGroup } from './navigation-portal-form.service';
import { INavigationPortal } from '../navigation-portal.model';
import { NavigationPortalService } from '../service/navigation-portal.service';
import { IChallenges } from 'app/entities/challenges/challenges.model';
import { ChallengesService } from 'app/entities/challenges/service/challenges.service';
import { IHabit } from 'app/entities/habit/habit.model';
import { HabitService } from 'app/entities/habit/service/habit.service';
import { ILeaderBoards } from 'app/entities/leader-boards/leader-boards.model';
import { LeaderBoardsService } from 'app/entities/leader-boards/service/leader-boards.service';
import { IProfileCustomization } from 'app/entities/profile-customization/profile-customization.model';
import { ProfileCustomizationService } from 'app/entities/profile-customization/service/profile-customization.service';
import { IMoodJournalPage } from 'app/entities/mood-journal-page/mood-journal-page.model';
import { MoodJournalPageService } from 'app/entities/mood-journal-page/service/mood-journal-page.service';

@Component({
  selector: 'jhi-navigation-portal-update',
  templateUrl: './navigation-portal-update.component.html',
})
export class NavigationPortalUpdateComponent implements OnInit {
  isSaving = false;
  navigationPortal: INavigationPortal | null = null;

  challengesCollection: IChallenges[] = [];
  habitsCollection: IHabit[] = [];
  leaderBoardsCollection: ILeaderBoards[] = [];
  profileCustomizationsCollection: IProfileCustomization[] = [];
  moodJournalPagesCollection: IMoodJournalPage[] = [];

  editForm: NavigationPortalFormGroup = this.navigationPortalFormService.createNavigationPortalFormGroup();

  constructor(
    protected navigationPortalService: NavigationPortalService,
    protected navigationPortalFormService: NavigationPortalFormService,
    protected challengesService: ChallengesService,
    protected habitService: HabitService,
    protected leaderBoardsService: LeaderBoardsService,
    protected profileCustomizationService: ProfileCustomizationService,
    protected moodJournalPageService: MoodJournalPageService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareChallenges = (o1: IChallenges | null, o2: IChallenges | null): boolean => this.challengesService.compareChallenges(o1, o2);

  compareHabit = (o1: IHabit | null, o2: IHabit | null): boolean => this.habitService.compareHabit(o1, o2);

  compareLeaderBoards = (o1: ILeaderBoards | null, o2: ILeaderBoards | null): boolean =>
    this.leaderBoardsService.compareLeaderBoards(o1, o2);

  compareProfileCustomization = (o1: IProfileCustomization | null, o2: IProfileCustomization | null): boolean =>
    this.profileCustomizationService.compareProfileCustomization(o1, o2);

  compareMoodJournalPage = (o1: IMoodJournalPage | null, o2: IMoodJournalPage | null): boolean =>
    this.moodJournalPageService.compareMoodJournalPage(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ navigationPortal }) => {
      this.navigationPortal = navigationPortal;
      if (navigationPortal) {
        this.updateForm(navigationPortal);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const navigationPortal = this.navigationPortalFormService.getNavigationPortal(this.editForm);
    if (navigationPortal.id !== null) {
      this.subscribeToSaveResponse(this.navigationPortalService.update(navigationPortal));
    } else {
      this.subscribeToSaveResponse(this.navigationPortalService.create(navigationPortal));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INavigationPortal>>): void {
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

  protected updateForm(navigationPortal: INavigationPortal): void {
    this.navigationPortal = navigationPortal;
    this.navigationPortalFormService.resetForm(this.editForm, navigationPortal);

    this.challengesCollection = this.challengesService.addChallengesToCollectionIfMissing<IChallenges>(
      this.challengesCollection,
      navigationPortal.challenges
    );
    this.habitsCollection = this.habitService.addHabitToCollectionIfMissing<IHabit>(this.habitsCollection, navigationPortal.habit);
    this.leaderBoardsCollection = this.leaderBoardsService.addLeaderBoardsToCollectionIfMissing<ILeaderBoards>(
      this.leaderBoardsCollection,
      navigationPortal.leaderBoards
    );
    this.profileCustomizationsCollection =
      this.profileCustomizationService.addProfileCustomizationToCollectionIfMissing<IProfileCustomization>(
        this.profileCustomizationsCollection,
        navigationPortal.profileCustomization
      );
    this.moodJournalPagesCollection = this.moodJournalPageService.addMoodJournalPageToCollectionIfMissing<IMoodJournalPage>(
      this.moodJournalPagesCollection,
      navigationPortal.moodJournalPage
    );
  }

  protected loadRelationshipsOptions(): void {
    this.challengesService
      .query({ filter: 'navigationportal-is-null' })
      .pipe(map((res: HttpResponse<IChallenges[]>) => res.body ?? []))
      .pipe(
        map((challenges: IChallenges[]) =>
          this.challengesService.addChallengesToCollectionIfMissing<IChallenges>(challenges, this.navigationPortal?.challenges)
        )
      )
      .subscribe((challenges: IChallenges[]) => (this.challengesCollection = challenges));

    this.habitService
      .query({ filter: 'navigationportal-is-null' })
      .pipe(map((res: HttpResponse<IHabit[]>) => res.body ?? []))
      .pipe(map((habits: IHabit[]) => this.habitService.addHabitToCollectionIfMissing<IHabit>(habits, this.navigationPortal?.habit)))
      .subscribe((habits: IHabit[]) => (this.habitsCollection = habits));

    this.leaderBoardsService
      .query({ filter: 'navigationportal-is-null' })
      .pipe(map((res: HttpResponse<ILeaderBoards[]>) => res.body ?? []))
      .pipe(
        map((leaderBoards: ILeaderBoards[]) =>
          this.leaderBoardsService.addLeaderBoardsToCollectionIfMissing<ILeaderBoards>(leaderBoards, this.navigationPortal?.leaderBoards)
        )
      )
      .subscribe((leaderBoards: ILeaderBoards[]) => (this.leaderBoardsCollection = leaderBoards));

    this.profileCustomizationService
      .query({ filter: 'navigationportal-is-null' })
      .pipe(map((res: HttpResponse<IProfileCustomization[]>) => res.body ?? []))
      .pipe(
        map((profileCustomizations: IProfileCustomization[]) =>
          this.profileCustomizationService.addProfileCustomizationToCollectionIfMissing<IProfileCustomization>(
            profileCustomizations,
            this.navigationPortal?.profileCustomization
          )
        )
      )
      .subscribe((profileCustomizations: IProfileCustomization[]) => (this.profileCustomizationsCollection = profileCustomizations));

    this.moodJournalPageService
      .query({ filter: 'navigationportal-is-null' })
      .pipe(map((res: HttpResponse<IMoodJournalPage[]>) => res.body ?? []))
      .pipe(
        map((moodJournalPages: IMoodJournalPage[]) =>
          this.moodJournalPageService.addMoodJournalPageToCollectionIfMissing<IMoodJournalPage>(
            moodJournalPages,
            this.navigationPortal?.moodJournalPage
          )
        )
      )
      .subscribe((moodJournalPages: IMoodJournalPage[]) => (this.moodJournalPagesCollection = moodJournalPages));
  }
}
