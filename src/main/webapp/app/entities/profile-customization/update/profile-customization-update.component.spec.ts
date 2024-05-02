import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProfileCustomizationFormService } from './profile-customization-form.service';
import { ProfileCustomizationService } from '../service/profile-customization.service';
import { IProfileCustomization } from '../profile-customization.model';
import { IJoinedTeams } from 'app/entities/joined-teams/joined-teams.model';
import { JoinedTeamsService } from 'app/entities/joined-teams/service/joined-teams.service';
import { ISetting } from 'app/entities/setting/setting.model';
import { SettingService } from 'app/entities/setting/service/setting.service';
import { IAchievement } from 'app/entities/achievement/achievement.model';
import { AchievementService } from 'app/entities/achievement/service/achievement.service';

import { ProfileCustomizationUpdateComponent } from './profile-customization-update.component';

describe('ProfileCustomization Management Update Component', () => {
  let comp: ProfileCustomizationUpdateComponent;
  let fixture: ComponentFixture<ProfileCustomizationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let profileCustomizationFormService: ProfileCustomizationFormService;
  let profileCustomizationService: ProfileCustomizationService;
  let joinedTeamsService: JoinedTeamsService;
  let settingService: SettingService;
  let achievementService: AchievementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProfileCustomizationUpdateComponent],
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
      .overrideTemplate(ProfileCustomizationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProfileCustomizationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    profileCustomizationFormService = TestBed.inject(ProfileCustomizationFormService);
    profileCustomizationService = TestBed.inject(ProfileCustomizationService);
    joinedTeamsService = TestBed.inject(JoinedTeamsService);
    settingService = TestBed.inject(SettingService);
    achievementService = TestBed.inject(AchievementService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call joinedTeams query and add missing value', () => {
      const profileCustomization: IProfileCustomization = { id: 456 };
      const joinedTeams: IJoinedTeams = { id: 4884 };
      profileCustomization.joinedTeams = joinedTeams;

      const joinedTeamsCollection: IJoinedTeams[] = [{ id: 86345 }];
      jest.spyOn(joinedTeamsService, 'query').mockReturnValue(of(new HttpResponse({ body: joinedTeamsCollection })));
      const expectedCollection: IJoinedTeams[] = [joinedTeams, ...joinedTeamsCollection];
      jest.spyOn(joinedTeamsService, 'addJoinedTeamsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ profileCustomization });
      comp.ngOnInit();

      expect(joinedTeamsService.query).toHaveBeenCalled();
      expect(joinedTeamsService.addJoinedTeamsToCollectionIfMissing).toHaveBeenCalledWith(joinedTeamsCollection, joinedTeams);
      expect(comp.joinedTeamsCollection).toEqual(expectedCollection);
    });

    it('Should call setting query and add missing value', () => {
      const profileCustomization: IProfileCustomization = { id: 456 };
      const setting: ISetting = { id: 70131 };
      profileCustomization.setting = setting;

      const settingCollection: ISetting[] = [{ id: 27164 }];
      jest.spyOn(settingService, 'query').mockReturnValue(of(new HttpResponse({ body: settingCollection })));
      const expectedCollection: ISetting[] = [setting, ...settingCollection];
      jest.spyOn(settingService, 'addSettingToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ profileCustomization });
      comp.ngOnInit();

      expect(settingService.query).toHaveBeenCalled();
      expect(settingService.addSettingToCollectionIfMissing).toHaveBeenCalledWith(settingCollection, setting);
      expect(comp.settingsCollection).toEqual(expectedCollection);
    });

    it('Should call achievement query and add missing value', () => {
      const profileCustomization: IProfileCustomization = { id: 456 };
      const achievement: IAchievement = { id: 15045 };
      profileCustomization.achievement = achievement;

      const achievementCollection: IAchievement[] = [{ id: 95016 }];
      jest.spyOn(achievementService, 'query').mockReturnValue(of(new HttpResponse({ body: achievementCollection })));
      const expectedCollection: IAchievement[] = [achievement, ...achievementCollection];
      jest.spyOn(achievementService, 'addAchievementToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ profileCustomization });
      comp.ngOnInit();

      expect(achievementService.query).toHaveBeenCalled();
      expect(achievementService.addAchievementToCollectionIfMissing).toHaveBeenCalledWith(achievementCollection, achievement);
      expect(comp.achievementsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const profileCustomization: IProfileCustomization = { id: 456 };
      const joinedTeams: IJoinedTeams = { id: 3199 };
      profileCustomization.joinedTeams = joinedTeams;
      const setting: ISetting = { id: 42324 };
      profileCustomization.setting = setting;
      const achievement: IAchievement = { id: 31936 };
      profileCustomization.achievement = achievement;

      activatedRoute.data = of({ profileCustomization });
      comp.ngOnInit();

      expect(comp.joinedTeamsCollection).toContain(joinedTeams);
      expect(comp.settingsCollection).toContain(setting);
      expect(comp.achievementsCollection).toContain(achievement);
      expect(comp.profileCustomization).toEqual(profileCustomization);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProfileCustomization>>();
      const profileCustomization = { id: 123 };
      jest.spyOn(profileCustomizationFormService, 'getProfileCustomization').mockReturnValue(profileCustomization);
      jest.spyOn(profileCustomizationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ profileCustomization });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: profileCustomization }));
      saveSubject.complete();

      // THEN
      expect(profileCustomizationFormService.getProfileCustomization).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(profileCustomizationService.update).toHaveBeenCalledWith(expect.objectContaining(profileCustomization));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProfileCustomization>>();
      const profileCustomization = { id: 123 };
      jest.spyOn(profileCustomizationFormService, 'getProfileCustomization').mockReturnValue({ id: null });
      jest.spyOn(profileCustomizationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ profileCustomization: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: profileCustomization }));
      saveSubject.complete();

      // THEN
      expect(profileCustomizationFormService.getProfileCustomization).toHaveBeenCalled();
      expect(profileCustomizationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProfileCustomization>>();
      const profileCustomization = { id: 123 };
      jest.spyOn(profileCustomizationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ profileCustomization });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(profileCustomizationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareJoinedTeams', () => {
      it('Should forward to joinedTeamsService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(joinedTeamsService, 'compareJoinedTeams');
        comp.compareJoinedTeams(entity, entity2);
        expect(joinedTeamsService.compareJoinedTeams).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareSetting', () => {
      it('Should forward to settingService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(settingService, 'compareSetting');
        comp.compareSetting(entity, entity2);
        expect(settingService.compareSetting).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareAchievement', () => {
      it('Should forward to achievementService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(achievementService, 'compareAchievement');
        comp.compareAchievement(entity, entity2);
        expect(achievementService.compareAchievement).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
