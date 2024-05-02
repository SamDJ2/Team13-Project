import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MembersFormService } from './members-form.service';
import { MembersService } from '../service/members.service';
import { IMembers } from '../members.model';
import { IGrouping } from 'app/entities/grouping/grouping.model';
import { GroupingService } from 'app/entities/grouping/service/grouping.service';

import { MembersUpdateComponent } from './members-update.component';

describe('Members Management Update Component', () => {
  let comp: MembersUpdateComponent;
  let fixture: ComponentFixture<MembersUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let membersFormService: MembersFormService;
  let membersService: MembersService;
  let groupingService: GroupingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MembersUpdateComponent],
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
      .overrideTemplate(MembersUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MembersUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    membersFormService = TestBed.inject(MembersFormService);
    membersService = TestBed.inject(MembersService);
    groupingService = TestBed.inject(GroupingService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Grouping query and add missing value', () => {
      const members: IMembers = { id: 456 };
      const grouping: IGrouping = { id: 77156 };
      members.grouping = grouping;

      const groupingCollection: IGrouping[] = [{ id: 21163 }];
      jest.spyOn(groupingService, 'query').mockReturnValue(of(new HttpResponse({ body: groupingCollection })));
      const additionalGroupings = [grouping];
      const expectedCollection: IGrouping[] = [...additionalGroupings, ...groupingCollection];
      jest.spyOn(groupingService, 'addGroupingToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ members });
      comp.ngOnInit();

      expect(groupingService.query).toHaveBeenCalled();
      expect(groupingService.addGroupingToCollectionIfMissing).toHaveBeenCalledWith(
        groupingCollection,
        ...additionalGroupings.map(expect.objectContaining)
      );
      expect(comp.groupingsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const members: IMembers = { id: 456 };
      const grouping: IGrouping = { id: 11864 };
      members.grouping = grouping;

      activatedRoute.data = of({ members });
      comp.ngOnInit();

      expect(comp.groupingsSharedCollection).toContain(grouping);
      expect(comp.members).toEqual(members);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMembers>>();
      const members = { id: 123 };
      jest.spyOn(membersFormService, 'getMembers').mockReturnValue(members);
      jest.spyOn(membersService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ members });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: members }));
      saveSubject.complete();

      // THEN
      expect(membersFormService.getMembers).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(membersService.update).toHaveBeenCalledWith(expect.objectContaining(members));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMembers>>();
      const members = { id: 123 };
      jest.spyOn(membersFormService, 'getMembers').mockReturnValue({ id: null });
      jest.spyOn(membersService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ members: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: members }));
      saveSubject.complete();

      // THEN
      expect(membersFormService.getMembers).toHaveBeenCalled();
      expect(membersService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMembers>>();
      const members = { id: 123 };
      jest.spyOn(membersService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ members });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(membersService.update).toHaveBeenCalled();
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
