import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ChallengesFormService } from './challenges-form.service';
import { ChallengesService } from '../service/challenges.service';
import { IChallenges } from '../challenges.model';
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

import { ChallengesUpdateComponent } from './challenges-update.component';

describe('Challenges Management Update Component', () => {
  let comp: ChallengesUpdateComponent;
  let fixture: ComponentFixture<ChallengesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let challengesFormService: ChallengesFormService;
  let challengesService: ChallengesService;
  let progressService: ProgressService;
  let junkFoodService: JunkFoodService;
  let screenTimeService: ScreenTimeService;
  let alcoholService: AlcoholService;
  let smokingService: SmokingService;
  let searchService: SearchService;
  let filteredService: FilteredService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ChallengesUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ChallengesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChallengesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    challengesFormService = TestBed.inject(ChallengesFormService);
    challengesService = TestBed.inject(ChallengesService);
    progressService = TestBed.inject(ProgressService);
    junkFoodService = TestBed.inject(JunkFoodService);
    screenTimeService = TestBed.inject(ScreenTimeService);
    alcoholService = TestBed.inject(AlcoholService);
    smokingService = TestBed.inject(SmokingService);
    searchService = TestBed.inject(SearchService);
    filteredService = TestBed.inject(FilteredService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call progress query and add missing value', () => {
      const challenges: IChallenges = { id: 456 };
      const progress: IProgress = { id: 62070 };
      challenges.progress = progress;

      const progressCollection: IProgress[] = [{ id: 26595 }];
      jest.spyOn(progressService, 'query').mockReturnValue(of(new HttpResponse({ body: progressCollection })));
      const expectedCollection: IProgress[] = [progress, ...progressCollection];
      jest.spyOn(progressService, 'addProgressToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ challenges });
      comp.ngOnInit();

      expect(progressService.query).toHaveBeenCalled();
      expect(progressService.addProgressToCollectionIfMissing).toHaveBeenCalledWith(progressCollection, progress);
      expect(comp.progressesCollection).toEqual(expectedCollection);
    });

    it('Should call JunkFood query and add missing value', () => {
      const challenges: IChallenges = { id: 456 };
      const junkFood: IJunkFood = { id: 52347 };
      challenges.junkFood = junkFood;

      const junkFoodCollection: IJunkFood[] = [{ id: 34028 }];
      jest.spyOn(junkFoodService, 'query').mockReturnValue(of(new HttpResponse({ body: junkFoodCollection })));
      const additionalJunkFoods = [junkFood];
      const expectedCollection: IJunkFood[] = [...additionalJunkFoods, ...junkFoodCollection];
      jest.spyOn(junkFoodService, 'addJunkFoodToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ challenges });
      comp.ngOnInit();

      expect(junkFoodService.query).toHaveBeenCalled();
      expect(junkFoodService.addJunkFoodToCollectionIfMissing).toHaveBeenCalledWith(
        junkFoodCollection,
        ...additionalJunkFoods.map(expect.objectContaining)
      );
      expect(comp.junkFoodsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ScreenTime query and add missing value', () => {
      const challenges: IChallenges = { id: 456 };
      const screenTime: IScreenTime = { id: 50276 };
      challenges.screenTime = screenTime;

      const screenTimeCollection: IScreenTime[] = [{ id: 37448 }];
      jest.spyOn(screenTimeService, 'query').mockReturnValue(of(new HttpResponse({ body: screenTimeCollection })));
      const additionalScreenTimes = [screenTime];
      const expectedCollection: IScreenTime[] = [...additionalScreenTimes, ...screenTimeCollection];
      jest.spyOn(screenTimeService, 'addScreenTimeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ challenges });
      comp.ngOnInit();

      expect(screenTimeService.query).toHaveBeenCalled();
      expect(screenTimeService.addScreenTimeToCollectionIfMissing).toHaveBeenCalledWith(
        screenTimeCollection,
        ...additionalScreenTimes.map(expect.objectContaining)
      );
      expect(comp.screenTimesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Alcohol query and add missing value', () => {
      const challenges: IChallenges = { id: 456 };
      const alcohol: IAlcohol = { id: 74143 };
      challenges.alcohol = alcohol;

      const alcoholCollection: IAlcohol[] = [{ id: 22451 }];
      jest.spyOn(alcoholService, 'query').mockReturnValue(of(new HttpResponse({ body: alcoholCollection })));
      const additionalAlcohol = [alcohol];
      const expectedCollection: IAlcohol[] = [...additionalAlcohol, ...alcoholCollection];
      jest.spyOn(alcoholService, 'addAlcoholToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ challenges });
      comp.ngOnInit();

      expect(alcoholService.query).toHaveBeenCalled();
      expect(alcoholService.addAlcoholToCollectionIfMissing).toHaveBeenCalledWith(
        alcoholCollection,
        ...additionalAlcohol.map(expect.objectContaining)
      );
      expect(comp.alcoholSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Smoking query and add missing value', () => {
      const challenges: IChallenges = { id: 456 };
      const smoking: ISmoking = { id: 63506 };
      challenges.smoking = smoking;

      const smokingCollection: ISmoking[] = [{ id: 55094 }];
      jest.spyOn(smokingService, 'query').mockReturnValue(of(new HttpResponse({ body: smokingCollection })));
      const additionalSmokings = [smoking];
      const expectedCollection: ISmoking[] = [...additionalSmokings, ...smokingCollection];
      jest.spyOn(smokingService, 'addSmokingToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ challenges });
      comp.ngOnInit();

      expect(smokingService.query).toHaveBeenCalled();
      expect(smokingService.addSmokingToCollectionIfMissing).toHaveBeenCalledWith(
        smokingCollection,
        ...additionalSmokings.map(expect.objectContaining)
      );
      expect(comp.smokingsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Search query and add missing value', () => {
      const challenges: IChallenges = { id: 456 };
      const searches: ISearch[] = [{ id: 2786 }];
      challenges.searches = searches;

      const searchCollection: ISearch[] = [{ id: 53775 }];
      jest.spyOn(searchService, 'query').mockReturnValue(of(new HttpResponse({ body: searchCollection })));
      const additionalSearches = [...searches];
      const expectedCollection: ISearch[] = [...additionalSearches, ...searchCollection];
      jest.spyOn(searchService, 'addSearchToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ challenges });
      comp.ngOnInit();

      expect(searchService.query).toHaveBeenCalled();
      expect(searchService.addSearchToCollectionIfMissing).toHaveBeenCalledWith(
        searchCollection,
        ...additionalSearches.map(expect.objectContaining)
      );
      expect(comp.searchesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Filtered query and add missing value', () => {
      const challenges: IChallenges = { id: 456 };
      const filtereds: IFiltered[] = [{ id: 91510 }];
      challenges.filtereds = filtereds;

      const filteredCollection: IFiltered[] = [{ id: 81877 }];
      jest.spyOn(filteredService, 'query').mockReturnValue(of(new HttpResponse({ body: filteredCollection })));
      const additionalFiltereds = [...filtereds];
      const expectedCollection: IFiltered[] = [...additionalFiltereds, ...filteredCollection];
      jest.spyOn(filteredService, 'addFilteredToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ challenges });
      comp.ngOnInit();

      expect(filteredService.query).toHaveBeenCalled();
      expect(filteredService.addFilteredToCollectionIfMissing).toHaveBeenCalledWith(
        filteredCollection,
        ...additionalFiltereds.map(expect.objectContaining)
      );
      expect(comp.filteredsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const challenges: IChallenges = { id: 456 };
      const progress: IProgress = { id: 29877 };
      challenges.progress = progress;
      const junkFood: IJunkFood = { id: 51940 };
      challenges.junkFood = junkFood;
      const screenTime: IScreenTime = { id: 4845 };
      challenges.screenTime = screenTime;
      const alcohol: IAlcohol = { id: 13622 };
      challenges.alcohol = alcohol;
      const smoking: ISmoking = { id: 34384 };
      challenges.smoking = smoking;
      const search: ISearch = { id: 71706 };
      challenges.searches = [search];
      const filtered: IFiltered = { id: 54125 };
      challenges.filtereds = [filtered];

      activatedRoute.data = of({ challenges });
      comp.ngOnInit();

      expect(comp.progressesCollection).toContain(progress);
      expect(comp.junkFoodsSharedCollection).toContain(junkFood);
      expect(comp.screenTimesSharedCollection).toContain(screenTime);
      expect(comp.alcoholSharedCollection).toContain(alcohol);
      expect(comp.smokingsSharedCollection).toContain(smoking);
      expect(comp.searchesSharedCollection).toContain(search);
      expect(comp.filteredsSharedCollection).toContain(filtered);
      expect(comp.challenges).toEqual(challenges);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChallenges>>();
      const challenges = { id: 123 };
      jest.spyOn(challengesFormService, 'getChallenges').mockReturnValue(challenges);
      jest.spyOn(challengesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ challenges });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: challenges }));
      saveSubject.complete();

      // THEN
      expect(challengesFormService.getChallenges).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(challengesService.update).toHaveBeenCalledWith(expect.objectContaining(challenges));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChallenges>>();
      const challenges = { id: 123 };
      jest.spyOn(challengesFormService, 'getChallenges').mockReturnValue({ id: null });
      jest.spyOn(challengesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ challenges: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: challenges }));
      saveSubject.complete();

      // THEN
      expect(challengesFormService.getChallenges).toHaveBeenCalled();
      expect(challengesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChallenges>>();
      const challenges = { id: 123 };
      jest.spyOn(challengesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ challenges });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(challengesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareProgress', () => {
      it('Should forward to progressService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(progressService, 'compareProgress');
        comp.compareProgress(entity, entity2);
        expect(progressService.compareProgress).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareJunkFood', () => {
      it('Should forward to junkFoodService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(junkFoodService, 'compareJunkFood');
        comp.compareJunkFood(entity, entity2);
        expect(junkFoodService.compareJunkFood).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareScreenTime', () => {
      it('Should forward to screenTimeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(screenTimeService, 'compareScreenTime');
        comp.compareScreenTime(entity, entity2);
        expect(screenTimeService.compareScreenTime).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareAlcohol', () => {
      it('Should forward to alcoholService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(alcoholService, 'compareAlcohol');
        comp.compareAlcohol(entity, entity2);
        expect(alcoholService.compareAlcohol).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareSmoking', () => {
      it('Should forward to smokingService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(smokingService, 'compareSmoking');
        comp.compareSmoking(entity, entity2);
        expect(smokingService.compareSmoking).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareSearch', () => {
      it('Should forward to searchService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(searchService, 'compareSearch');
        comp.compareSearch(entity, entity2);
        expect(searchService.compareSearch).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareFiltered', () => {
      it('Should forward to filteredService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(filteredService, 'compareFiltered');
        comp.compareFiltered(entity, entity2);
        expect(filteredService.compareFiltered).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
