import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AchievementFormService } from './achievement-form.service';
import { AchievementService } from '../service/achievement.service';
import { IAchievement } from '../achievement.model';

import { AchievementUpdateComponent } from './achievement-update.component';

describe('Achievement Management Update Component', () => {
  let comp: AchievementUpdateComponent;
  let fixture: ComponentFixture<AchievementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let achievementFormService: AchievementFormService;
  let achievementService: AchievementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AchievementUpdateComponent],
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
      .overrideTemplate(AchievementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AchievementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    achievementFormService = TestBed.inject(AchievementFormService);
    achievementService = TestBed.inject(AchievementService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const achievement: IAchievement = { id: 456 };

      activatedRoute.data = of({ achievement });
      comp.ngOnInit();

      expect(comp.achievement).toEqual(achievement);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAchievement>>();
      const achievement = { id: 123 };
      jest.spyOn(achievementFormService, 'getAchievement').mockReturnValue(achievement);
      jest.spyOn(achievementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ achievement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: achievement }));
      saveSubject.complete();

      // THEN
      expect(achievementFormService.getAchievement).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(achievementService.update).toHaveBeenCalledWith(expect.objectContaining(achievement));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAchievement>>();
      const achievement = { id: 123 };
      jest.spyOn(achievementFormService, 'getAchievement').mockReturnValue({ id: null });
      jest.spyOn(achievementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ achievement: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: achievement }));
      saveSubject.complete();

      // THEN
      expect(achievementFormService.getAchievement).toHaveBeenCalled();
      expect(achievementService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAchievement>>();
      const achievement = { id: 123 };
      jest.spyOn(achievementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ achievement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(achievementService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
