import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MoodPickerFormService } from './mood-picker-form.service';
import { MoodPickerService } from '../service/mood-picker.service';
import { IMoodPicker } from '../mood-picker.model';
import { INavigationPortal } from 'app/entities/navigation-portal/navigation-portal.model';
import { NavigationPortalService } from 'app/entities/navigation-portal/service/navigation-portal.service';

import { MoodPickerUpdateComponent } from './mood-picker-update.component';

describe('MoodPicker Management Update Component', () => {
  let comp: MoodPickerUpdateComponent;
  let fixture: ComponentFixture<MoodPickerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let moodPickerFormService: MoodPickerFormService;
  let moodPickerService: MoodPickerService;
  let navigationPortalService: NavigationPortalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MoodPickerUpdateComponent],
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
      .overrideTemplate(MoodPickerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MoodPickerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    moodPickerFormService = TestBed.inject(MoodPickerFormService);
    moodPickerService = TestBed.inject(MoodPickerService);
    navigationPortalService = TestBed.inject(NavigationPortalService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call navigationPortal query and add missing value', () => {
      const moodPicker: IMoodPicker = { id: 456 };
      const navigationPortal: INavigationPortal = { id: 36099 };
      moodPicker.navigationPortal = navigationPortal;

      const navigationPortalCollection: INavigationPortal[] = [{ id: 84909 }];
      jest.spyOn(navigationPortalService, 'query').mockReturnValue(of(new HttpResponse({ body: navigationPortalCollection })));
      const expectedCollection: INavigationPortal[] = [navigationPortal, ...navigationPortalCollection];
      jest.spyOn(navigationPortalService, 'addNavigationPortalToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ moodPicker });
      comp.ngOnInit();

      expect(navigationPortalService.query).toHaveBeenCalled();
      expect(navigationPortalService.addNavigationPortalToCollectionIfMissing).toHaveBeenCalledWith(
        navigationPortalCollection,
        navigationPortal
      );
      expect(comp.navigationPortalsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const moodPicker: IMoodPicker = { id: 456 };
      const navigationPortal: INavigationPortal = { id: 61192 };
      moodPicker.navigationPortal = navigationPortal;

      activatedRoute.data = of({ moodPicker });
      comp.ngOnInit();

      expect(comp.navigationPortalsCollection).toContain(navigationPortal);
      expect(comp.moodPicker).toEqual(moodPicker);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMoodPicker>>();
      const moodPicker = { id: 123 };
      jest.spyOn(moodPickerFormService, 'getMoodPicker').mockReturnValue(moodPicker);
      jest.spyOn(moodPickerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ moodPicker });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: moodPicker }));
      saveSubject.complete();

      // THEN
      expect(moodPickerFormService.getMoodPicker).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(moodPickerService.update).toHaveBeenCalledWith(expect.objectContaining(moodPicker));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMoodPicker>>();
      const moodPicker = { id: 123 };
      jest.spyOn(moodPickerFormService, 'getMoodPicker').mockReturnValue({ id: null });
      jest.spyOn(moodPickerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ moodPicker: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: moodPicker }));
      saveSubject.complete();

      // THEN
      expect(moodPickerFormService.getMoodPicker).toHaveBeenCalled();
      expect(moodPickerService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMoodPicker>>();
      const moodPicker = { id: 123 };
      jest.spyOn(moodPickerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ moodPicker });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(moodPickerService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareNavigationPortal', () => {
      it('Should forward to navigationPortalService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(navigationPortalService, 'compareNavigationPortal');
        comp.compareNavigationPortal(entity, entity2);
        expect(navigationPortalService.compareNavigationPortal).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
