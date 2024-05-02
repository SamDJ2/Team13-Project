import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { GroupingFormService } from './grouping-form.service';
import { GroupingService } from '../service/grouping.service';
import { IGrouping } from '../grouping.model';

import { GroupingUpdateComponent } from './grouping-update.component';

describe('Grouping Management Update Component', () => {
  let comp: GroupingUpdateComponent;
  let fixture: ComponentFixture<GroupingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let groupingFormService: GroupingFormService;
  let groupingService: GroupingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [GroupingUpdateComponent],
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
      .overrideTemplate(GroupingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GroupingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    groupingFormService = TestBed.inject(GroupingFormService);
    groupingService = TestBed.inject(GroupingService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const grouping: IGrouping = { id: 456 };

      activatedRoute.data = of({ grouping });
      comp.ngOnInit();

      expect(comp.grouping).toEqual(grouping);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGrouping>>();
      const grouping = { id: 123 };
      jest.spyOn(groupingFormService, 'getGrouping').mockReturnValue(grouping);
      jest.spyOn(groupingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grouping });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grouping }));
      saveSubject.complete();

      // THEN
      expect(groupingFormService.getGrouping).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(groupingService.update).toHaveBeenCalledWith(expect.objectContaining(grouping));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGrouping>>();
      const grouping = { id: 123 };
      jest.spyOn(groupingFormService, 'getGrouping').mockReturnValue({ id: null });
      jest.spyOn(groupingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grouping: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grouping }));
      saveSubject.complete();

      // THEN
      expect(groupingFormService.getGrouping).toHaveBeenCalled();
      expect(groupingService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGrouping>>();
      const grouping = { id: 123 };
      jest.spyOn(groupingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grouping });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(groupingService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
