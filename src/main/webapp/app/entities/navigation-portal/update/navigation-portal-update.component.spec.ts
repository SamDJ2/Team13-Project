import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { NavigationPortalFormService } from './navigation-portal-form.service';
import { NavigationPortalService } from '../service/navigation-portal.service';
import { INavigationPortal } from '../navigation-portal.model';
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

import { NavigationPortalUpdateComponent } from './navigation-portal-update.component';

describe('NavigationPortal Management Update Component', () => {
  let comp: NavigationPortalUpdateComponent;
  let fixture: ComponentFixture<NavigationPortalUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let navigationPortalFormService: NavigationPortalFormService;
  let navigationPortalService: NavigationPortalService;
  let challengesService: ChallengesService;
  let habitService: HabitService;
  let leaderBoardsService: LeaderBoardsService;
  let profileCustomizationService: ProfileCustomizationService;
  let moodJournalPageService: MoodJournalPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [NavigationPortalUpdateComponent],
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
      .overrideTemplate(NavigationPortalUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NavigationPortalUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    navigationPortalFormService = TestBed.inject(NavigationPortalFormService);
    navigationPortalService = TestBed.inject(NavigationPortalService);
    challengesService = TestBed.inject(ChallengesService);
    habitService = TestBed.inject(HabitService);
    leaderBoardsService = TestBed.inject(LeaderBoardsService);
    profileCustomizationService = TestBed.inject(ProfileCustomizationService);
    moodJournalPageService = TestBed.inject(MoodJournalPageService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call challenges query and add missing value', () => {
      const navigationPortal: INavigationPortal = { id: 456 };
      const challenges: IChallenges = { id: 42584 };
      navigationPortal.challenges = challenges;

      const challengesCollection: IChallenges[] = [{ id: 70913 }];
      jest.spyOn(challengesService, 'query').mockReturnValue(of(new HttpResponse({ body: challengesCollection })));
      const expectedCollection: IChallenges[] = [challenges, ...challengesCollection];
      jest.spyOn(challengesService, 'addChallengesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ navigationPortal });
      comp.ngOnInit();

      expect(challengesService.query).toHaveBeenCalled();
      expect(challengesService.addChallengesToCollectionIfMissing).toHaveBeenCalledWith(challengesCollection, challenges);
      expect(comp.challengesCollection).toEqual(expectedCollection);
    });

    it('Should call habit query and add missing value', () => {
      const navigationPortal: INavigationPortal = { id: 456 };
      const habit: IHabit = { id: 79813 };
      navigationPortal.habit = habit;

      const habitCollection: IHabit[] = [{ id: 46252 }];
      jest.spyOn(habitService, 'query').mockReturnValue(of(new HttpResponse({ body: habitCollection })));
      const expectedCollection: IHabit[] = [habit, ...habitCollection];
      jest.spyOn(habitService, 'addHabitToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ navigationPortal });
      comp.ngOnInit();

      expect(habitService.query).toHaveBeenCalled();
      expect(habitService.addHabitToCollectionIfMissing).toHaveBeenCalledWith(habitCollection, habit);
      expect(comp.habitsCollection).toEqual(expectedCollection);
    });

    it('Should call leaderBoards query and add missing value', () => {
      const navigationPortal: INavigationPortal = { id: 456 };
      const leaderBoards: ILeaderBoards = { id: 66923 };
      navigationPortal.leaderBoards = leaderBoards;

      const leaderBoardsCollection: ILeaderBoards[] = [{ id: 81024 }];
      jest.spyOn(leaderBoardsService, 'query').mockReturnValue(of(new HttpResponse({ body: leaderBoardsCollection })));
      const expectedCollection: ILeaderBoards[] = [leaderBoards, ...leaderBoardsCollection];
      jest.spyOn(leaderBoardsService, 'addLeaderBoardsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ navigationPortal });
      comp.ngOnInit();

      expect(leaderBoardsService.query).toHaveBeenCalled();
      expect(leaderBoardsService.addLeaderBoardsToCollectionIfMissing).toHaveBeenCalledWith(leaderBoardsCollection, leaderBoards);
      expect(comp.leaderBoardsCollection).toEqual(expectedCollection);
    });

    it('Should call profileCustomization query and add missing value', () => {
      const navigationPortal: INavigationPortal = { id: 456 };
      const profileCustomization: IProfileCustomization = { id: 4281 };
      navigationPortal.profileCustomization = profileCustomization;

      const profileCustomizationCollection: IProfileCustomization[] = [{ id: 61964 }];
      jest.spyOn(profileCustomizationService, 'query').mockReturnValue(of(new HttpResponse({ body: profileCustomizationCollection })));
      const expectedCollection: IProfileCustomization[] = [profileCustomization, ...profileCustomizationCollection];
      jest.spyOn(profileCustomizationService, 'addProfileCustomizationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ navigationPortal });
      comp.ngOnInit();

      expect(profileCustomizationService.query).toHaveBeenCalled();
      expect(profileCustomizationService.addProfileCustomizationToCollectionIfMissing).toHaveBeenCalledWith(
        profileCustomizationCollection,
        profileCustomization
      );
      expect(comp.profileCustomizationsCollection).toEqual(expectedCollection);
    });

    it('Should call moodJournalPage query and add missing value', () => {
      const navigationPortal: INavigationPortal = { id: 456 };
      const moodJournalPage: IMoodJournalPage = { id: 51598 };
      navigationPortal.moodJournalPage = moodJournalPage;

      const moodJournalPageCollection: IMoodJournalPage[] = [{ id: 22641 }];
      jest.spyOn(moodJournalPageService, 'query').mockReturnValue(of(new HttpResponse({ body: moodJournalPageCollection })));
      const expectedCollection: IMoodJournalPage[] = [moodJournalPage, ...moodJournalPageCollection];
      jest.spyOn(moodJournalPageService, 'addMoodJournalPageToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ navigationPortal });
      comp.ngOnInit();

      expect(moodJournalPageService.query).toHaveBeenCalled();
      expect(moodJournalPageService.addMoodJournalPageToCollectionIfMissing).toHaveBeenCalledWith(
        moodJournalPageCollection,
        moodJournalPage
      );
      expect(comp.moodJournalPagesCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const navigationPortal: INavigationPortal = { id: 456 };
      const challenges: IChallenges = { id: 17329 };
      navigationPortal.challenges = challenges;
      const habit: IHabit = { id: 59237 };
      navigationPortal.habit = habit;
      const leaderBoards: ILeaderBoards = { id: 15245 };
      navigationPortal.leaderBoards = leaderBoards;
      const profileCustomization: IProfileCustomization = { id: 11306 };
      navigationPortal.profileCustomization = profileCustomization;
      const moodJournalPage: IMoodJournalPage = { id: 90013 };
      navigationPortal.moodJournalPage = moodJournalPage;

      activatedRoute.data = of({ navigationPortal });
      comp.ngOnInit();

      expect(comp.challengesCollection).toContain(challenges);
      expect(comp.habitsCollection).toContain(habit);
      expect(comp.leaderBoardsCollection).toContain(leaderBoards);
      expect(comp.profileCustomizationsCollection).toContain(profileCustomization);
      expect(comp.moodJournalPagesCollection).toContain(moodJournalPage);
      expect(comp.navigationPortal).toEqual(navigationPortal);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INavigationPortal>>();
      const navigationPortal = { id: 123 };
      jest.spyOn(navigationPortalFormService, 'getNavigationPortal').mockReturnValue(navigationPortal);
      jest.spyOn(navigationPortalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ navigationPortal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: navigationPortal }));
      saveSubject.complete();

      // THEN
      expect(navigationPortalFormService.getNavigationPortal).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(navigationPortalService.update).toHaveBeenCalledWith(expect.objectContaining(navigationPortal));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INavigationPortal>>();
      const navigationPortal = { id: 123 };
      jest.spyOn(navigationPortalFormService, 'getNavigationPortal').mockReturnValue({ id: null });
      jest.spyOn(navigationPortalService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ navigationPortal: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: navigationPortal }));
      saveSubject.complete();

      // THEN
      expect(navigationPortalFormService.getNavigationPortal).toHaveBeenCalled();
      expect(navigationPortalService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INavigationPortal>>();
      const navigationPortal = { id: 123 };
      jest.spyOn(navigationPortalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ navigationPortal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(navigationPortalService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareChallenges', () => {
      it('Should forward to challengesService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(challengesService, 'compareChallenges');
        comp.compareChallenges(entity, entity2);
        expect(challengesService.compareChallenges).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareHabit', () => {
      it('Should forward to habitService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(habitService, 'compareHabit');
        comp.compareHabit(entity, entity2);
        expect(habitService.compareHabit).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareLeaderBoards', () => {
      it('Should forward to leaderBoardsService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(leaderBoardsService, 'compareLeaderBoards');
        comp.compareLeaderBoards(entity, entity2);
        expect(leaderBoardsService.compareLeaderBoards).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareProfileCustomization', () => {
      it('Should forward to profileCustomizationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(profileCustomizationService, 'compareProfileCustomization');
        comp.compareProfileCustomization(entity, entity2);
        expect(profileCustomizationService.compareProfileCustomization).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareMoodJournalPage', () => {
      it('Should forward to moodJournalPageService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(moodJournalPageService, 'compareMoodJournalPage');
        comp.compareMoodJournalPage(entity, entity2);
        expect(moodJournalPageService.compareMoodJournalPage).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
