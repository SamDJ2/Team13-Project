import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BadgesFormService } from './badges-form.service';
import { BadgesService } from '../service/badges.service';
import { IBadges } from '../badges.model';
import { IGrouping } from 'app/entities/grouping/grouping.model';
import { GroupingService } from 'app/entities/grouping/service/grouping.service';

import { BadgesUpdateComponent } from './badges-update.component';

describe('Badges Management Update Component', () => {
  let comp: BadgesUpdateComponent;
  let fixture: ComponentFixture<BadgesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let badgesFormService: BadgesFormService;
  let badgesService: BadgesService;
  let groupingService: GroupingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BadgesUpdateComponent],
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
      .overrideTemplate(BadgesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BadgesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    badgesFormService = TestBed.inject(BadgesFormService);
    badgesService = TestBed.inject(BadgesService);
    groupingService = TestBed.inject(GroupingService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Grouping query and add missing value', () => {
      const badges: IBadges = { id: 456 };
      const grouping: IGrouping = { id: 26960 };
      badges.grouping = grouping;

      const groupingCollection: IGrouping[] = [{ id: 19788 }];
      jest.spyOn(groupingService, 'query').mockReturnValue(of(new HttpResponse({ body: groupingCollection })));
      const additionalGroupings = [grouping];
      const expectedCollection: IGrouping[] = [...additionalGroupings, ...groupingCollection];
      jest.spyOn(groupingService, 'addGroupingToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ badges });
      comp.ngOnInit();

      expect(groupingService.query).toHaveBeenCalled();
      expect(groupingService.addGroupingToCollectionIfMissing).toHaveBeenCalledWith(
        groupingCollection,
        ...additionalGroupings.map(expect.objectContaining)
      );
      expect(comp.groupingsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const badges: IBadges = { id: 456 };
      const grouping: IGrouping = { id: 1129 };
      badges.grouping = grouping;

      activatedRoute.data = of({ badges });
      comp.ngOnInit();

      expect(comp.groupingsSharedCollection).toContain(grouping);
      expect(comp.badges).toEqual(badges);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBadges>>();
      const badges = { id: 123 };
      jest.spyOn(badgesFormService, 'getBadges').mockReturnValue(badges);
      jest.spyOn(badgesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ badges });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: badges }));
      saveSubject.complete();

      // THEN
      expect(badgesFormService.getBadges).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(badgesService.update).toHaveBeenCalledWith(expect.objectContaining(badges));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBadges>>();
      const badges = { id: 123 };
      jest.spyOn(badgesFormService, 'getBadges').mockReturnValue({ id: null });
      jest.spyOn(badgesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ badges: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: badges }));
      saveSubject.complete();

      // THEN
      expect(badgesFormService.getBadges).toHaveBeenCalled();
      expect(badgesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBadges>>();
      const badges = { id: 123 };
      jest.spyOn(badgesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ badges });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(badgesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareGrouping', () => {
      it('Should forward to groupingService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(groupingService, 'compareGrouping');
        comp.compareGrouping(entity, entity2);
        expect(groupingService.compareGrouping).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
