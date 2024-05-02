import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ChallengesFormService, ChallengesFormGroup } from './challenges-form.service';
import { IChallenges } from '../challenges.model';
import { ChallengesService } from '../service/challenges.service';
import { IProgress } from 'app/entities/progress/progress.model';
import { ProgressService } from 'app/entities/progress/service/progress.service';
import { IJunkFood } from 'app/entities/junk-food/junk-food.model';
import { JunkFoodService } from 'app/entities/junk-food/service/junk-food.service';
import { IScreenTime } from 'app/entities/screen-time/screen-time.model';
import { ScreenTimeService } from 'app/entities/screen-time/service/screen-time.service';
import { IAlcohol } from 'app/entities/alcohol/alcohol.model';
import { AlcoholService } from 'app/entities/alcohol/service/alcohol.service';
import { ISmoking } from 'app/entities/smoking/smoking.model';
import { SmokingService } from 'app/entities/smoking/service/smoking.service';
import { ISearch } from 'app/entities/search/search.model';
import { SearchService } from 'app/entities/search/service/search.service';
import { IFiltered } from 'app/entities/filtered/filtered.model';
import { FilteredService } from 'app/entities/filtered/service/filtered.service';

@Component({
  selector: 'jhi-challenges-update',
  templateUrl: './challenges-update.component.html',
})
export class ChallengesUpdateComponent implements OnInit {
  isSaving = false;
  challenges: IChallenges | null = null;

  progressesCollection: IProgress[] = [];
  junkFoodsSharedCollection: IJunkFood[] = [];
  screenTimesSharedCollection: IScreenTime[] = [];
  alcoholSharedCollection: IAlcohol[] = [];
  smokingsSharedCollection: ISmoking[] = [];
  searchesSharedCollection: ISearch[] = [];
  filteredsSharedCollection: IFiltered[] = [];

  editForm: ChallengesFormGroup = this.challengesFormService.createChallengesFormGroup();

  constructor(
    protected challengesService: ChallengesService,
    protected challengesFormService: ChallengesFormService,
    protected progressService: ProgressService,
    protected junkFoodService: JunkFoodService,
    protected screenTimeService: ScreenTimeService,
    protected alcoholService: AlcoholService,
    protected smokingService: SmokingService,
    protected searchService: SearchService,
    protected filteredService: FilteredService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareProgress = (o1: IProgress | null, o2: IProgress | null): boolean => this.progressService.compareProgress(o1, o2);

  compareJunkFood = (o1: IJunkFood | null, o2: IJunkFood | null): boolean => this.junkFoodService.compareJunkFood(o1, o2);

  compareScreenTime = (o1: IScreenTime | null, o2: IScreenTime | null): boolean => this.screenTimeService.compareScreenTime(o1, o2);

  compareAlcohol = (o1: IAlcohol | null, o2: IAlcohol | null): boolean => this.alcoholService.compareAlcohol(o1, o2);

  compareSmoking = (o1: ISmoking | null, o2: ISmoking | null): boolean => this.smokingService.compareSmoking(o1, o2);

  compareSearch = (o1: ISearch | null, o2: ISearch | null): boolean => this.searchService.compareSearch(o1, o2);

  compareFiltered = (o1: IFiltered | null, o2: IFiltered | null): boolean => this.filteredService.compareFiltered(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ challenges }) => {
      this.challenges = challenges;
      if (challenges) {
        this.updateForm(challenges);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const challenges = this.challengesFormService.getChallenges(this.editForm);
    if (challenges.id !== null) {
      this.subscribeToSaveResponse(this.challengesService.update(challenges));
    } else {
      this.subscribeToSaveResponse(this.challengesService.create(challenges));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChallenges>>): void {
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

  protected updateForm(challenges: IChallenges): void {
    this.challenges = challenges;
    this.challengesFormService.resetForm(this.editForm, challenges);

    this.progressesCollection = this.progressService.addProgressToCollectionIfMissing<IProgress>(
      this.progressesCollection,
      challenges.progress
    );
    this.junkFoodsSharedCollection = this.junkFoodService.addJunkFoodToCollectionIfMissing<IJunkFood>(
      this.junkFoodsSharedCollection,
      challenges.junkFood
    );
    this.screenTimesSharedCollection = this.screenTimeService.addScreenTimeToCollectionIfMissing<IScreenTime>(
      this.screenTimesSharedCollection,
      challenges.screenTime
    );
    this.alcoholSharedCollection = this.alcoholService.addAlcoholToCollectionIfMissing<IAlcohol>(
      this.alcoholSharedCollection,
      challenges.alcohol
    );
    this.smokingsSharedCollection = this.smokingService.addSmokingToCollectionIfMissing<ISmoking>(
      this.smokingsSharedCollection,
      challenges.smoking
    );
    this.searchesSharedCollection = this.searchService.addSearchToCollectionIfMissing<ISearch>(
      this.searchesSharedCollection,
      ...(challenges.searches ?? [])
    );
    this.filteredsSharedCollection = this.filteredService.addFilteredToCollectionIfMissing<IFiltered>(
      this.filteredsSharedCollection,
      ...(challenges.filtereds ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.progressService
      .query({ filter: 'challenges-is-null' })
      .pipe(map((res: HttpResponse<IProgress[]>) => res.body ?? []))
      .pipe(
        map((progresses: IProgress[]) =>
          this.progressService.addProgressToCollectionIfMissing<IProgress>(progresses, this.challenges?.progress)
        )
      )
      .subscribe((progresses: IProgress[]) => (this.progressesCollection = progresses));

    this.junkFoodService
      .query()
      .pipe(map((res: HttpResponse<IJunkFood[]>) => res.body ?? []))
      .pipe(
        map((junkFoods: IJunkFood[]) =>
          this.junkFoodService.addJunkFoodToCollectionIfMissing<IJunkFood>(junkFoods, this.challenges?.junkFood)
        )
      )
      .subscribe((junkFoods: IJunkFood[]) => (this.junkFoodsSharedCollection = junkFoods));

    this.screenTimeService
      .query()
      .pipe(map((res: HttpResponse<IScreenTime[]>) => res.body ?? []))
      .pipe(
        map((screenTimes: IScreenTime[]) =>
          this.screenTimeService.addScreenTimeToCollectionIfMissing<IScreenTime>(screenTimes, this.challenges?.screenTime)
        )
      )
      .subscribe((screenTimes: IScreenTime[]) => (this.screenTimesSharedCollection = screenTimes));

    this.alcoholService
      .query()
      .pipe(map((res: HttpResponse<IAlcohol[]>) => res.body ?? []))
      .pipe(map((alcohol: IAlcohol[]) => this.alcoholService.addAlcoholToCollectionIfMissing<IAlcohol>(alcohol, this.challenges?.alcohol)))
      .subscribe((alcohol: IAlcohol[]) => (this.alcoholSharedCollection = alcohol));

    this.smokingService
      .query()
      .pipe(map((res: HttpResponse<ISmoking[]>) => res.body ?? []))
      .pipe(
        map((smokings: ISmoking[]) => this.smokingService.addSmokingToCollectionIfMissing<ISmoking>(smokings, this.challenges?.smoking))
      )
      .subscribe((smokings: ISmoking[]) => (this.smokingsSharedCollection = smokings));

    this.searchService
      .query()
      .pipe(map((res: HttpResponse<ISearch[]>) => res.body ?? []))
      .pipe(
        map((searches: ISearch[]) =>
          this.searchService.addSearchToCollectionIfMissing<ISearch>(searches, ...(this.challenges?.searches ?? []))
        )
      )
      .subscribe((searches: ISearch[]) => (this.searchesSharedCollection = searches));

    this.filteredService
      .query()
      .pipe(map((res: HttpResponse<IFiltered[]>) => res.body ?? []))
      .pipe(
        map((filtereds: IFiltered[]) =>
          this.filteredService.addFilteredToCollectionIfMissing<IFiltered>(filtereds, ...(this.challenges?.filtereds ?? []))
        )
      )
      .subscribe((filtereds: IFiltered[]) => (this.filteredsSharedCollection = filtereds));
  }
}
