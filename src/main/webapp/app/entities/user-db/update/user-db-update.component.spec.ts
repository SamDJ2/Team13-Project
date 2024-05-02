import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserDBFormService } from './user-db-form.service';
import { UserDBService } from '../service/user-db.service';
import { IUserDB } from '../user-db.model';
import { ILandingPage } from 'app/entities/landing-page/landing-page.model';
import { LandingPageService } from 'app/entities/landing-page/service/landing-page.service';
import { IProgress } from 'app/entities/progress/progress.model';
import { ProgressService } from 'app/entities/progress/service/progress.service';

import { UserDBUpdateComponent } from './user-db-update.component';

describe('UserDB Management Update Component', () => {
  let comp: UserDBUpdateComponent;
  let fixture: ComponentFixture<UserDBUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userDBFormService: UserDBFormService;
  let userDBService: UserDBService;
  let landingPageService: LandingPageService;
  let progressService: ProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserDBUpdateComponent],
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
      .overrideTemplate(UserDBUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserDBUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userDBFormService = TestBed.inject(UserDBFormService);
    userDBService = TestBed.inject(UserDBService);
    landingPageService = TestBed.inject(LandingPageService);
    progressService = TestBed.inject(ProgressService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call landingPage query and add missing value', () => {
      const userDB: IUserDB = { id: 456 };
      const landingPage: ILandingPage = { id: 57780 };
      userDB.landingPage = landingPage;

      const landingPageCollection: ILandingPage[] = [{ id: 99850 }];
      jest.spyOn(landingPageService, 'query').mockReturnValue(of(new HttpResponse({ body: landingPageCollection })));
      const expectedCollection: ILandingPage[] = [landingPage, ...landingPageCollection];
      jest.spyOn(landingPageService, 'addLandingPageToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userDB });
      comp.ngOnInit();

      expect(landingPageService.query).toHaveBeenCalled();
      expect(landingPageService.addLandingPageToCollectionIfMissing).toHaveBeenCalledWith(landingPageCollection, landingPage);
      expect(comp.landingPagesCollection).toEqual(expectedCollection);
    });

    it('Should call progress query and add missing value', () => {
      const userDB: IUserDB = { id: 456 };
      const progress: IProgress = { id: 50627 };
      userDB.progress = progress;

      const progressCollection: IProgress[] = [{ id: 70256 }];
      jest.spyOn(progressService, 'query').mockReturnValue(of(new HttpResponse({ body: progressCollection })));
      const expectedCollection: IProgress[] = [progress, ...progressCollection];
      jest.spyOn(progressService, 'addProgressToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userDB });
      comp.ngOnInit();

      expect(progressService.query).toHaveBeenCalled();
      expect(progressService.addProgressToCollectionIfMissing).toHaveBeenCalledWith(progressCollection, progress);
      expect(comp.progressesCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userDB: IUserDB = { id: 456 };
      const landingPage: ILandingPage = { id: 23393 };
      userDB.landingPage = landingPage;
      const progress: IProgress = { id: 65186 };
      userDB.progress = progress;

      activatedRoute.data = of({ userDB });
      comp.ngOnInit();

      expect(comp.landingPagesCollection).toContain(landingPage);
      expect(comp.progressesCollection).toContain(progress);
      expect(comp.userDB).toEqual(userDB);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserDB>>();
      const userDB = { id: 123 };
      jest.spyOn(userDBFormService, 'getUserDB').mockReturnValue(userDB);
      jest.spyOn(userDBService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userDB });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userDB }));
      saveSubject.complete();

      // THEN
      expect(userDBFormService.getUserDB).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userDBService.update).toHaveBeenCalledWith(expect.objectContaining(userDB));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserDB>>();
      const userDB = { id: 123 };
      jest.spyOn(userDBFormService, 'getUserDB').mockReturnValue({ id: null });
      jest.spyOn(userDBService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userDB: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userDB }));
      saveSubject.complete();

      // THEN
      expect(userDBFormService.getUserDB).toHaveBeenCalled();
      expect(userDBService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserDB>>();
      const userDB = { id: 123 };
      jest.spyOn(userDBService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userDB });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userDBService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareLandingPage', () => {
      it('Should forward to landingPageService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(landingPageService, 'compareLandingPage');
        comp.compareLandingPage(entity, entity2);
        expect(landingPageService.compareLandingPage).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareProgress', () => {
      it('Should forward to progressService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(progressService, 'compareProgress');
        comp.compareProgress(entity, entity2);
        expect(progressService.compareProgress).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
