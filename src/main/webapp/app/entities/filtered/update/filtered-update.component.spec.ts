import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FilteredFormService } from './filtered-form.service';
import { FilteredService } from '../service/filtered.service';
import { IFiltered } from '../filtered.model';

import { FilteredUpdateComponent } from './filtered-update.component';

describe('Filtered Management Update Component', () => {
  let comp: FilteredUpdateComponent;
  let fixture: ComponentFixture<FilteredUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let filteredFormService: FilteredFormService;
  let filteredService: FilteredService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FilteredUpdateComponent],
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
      .overrideTemplate(FilteredUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FilteredUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    filteredFormService = TestBed.inject(FilteredFormService);
    filteredService = TestBed.inject(FilteredService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const filtered: IFiltered = { id: 456 };

      activatedRoute.data = of({ filtered });
      comp.ngOnInit();

      expect(comp.filtered).toEqual(filtered);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFiltered>>();
      const filtered = { id: 123 };
      jest.spyOn(filteredFormService, 'getFiltered').mockReturnValue(filtered);
      jest.spyOn(filteredService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ filtered });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: filtered }));
      saveSubject.complete();

      // THEN
      expect(filteredFormService.getFiltered).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(filteredService.update).toHaveBeenCalledWith(expect.objectContaining(filtered));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFiltered>>();
      const filtered = { id: 123 };
      jest.spyOn(filteredFormService, 'getFiltered').mockReturnValue({ id: null });
      jest.spyOn(filteredService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ filtered: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: filtered }));
      saveSubject.complete();

      // THEN
      expect(filteredFormService.getFiltered).toHaveBeenCalled();
      expect(filteredService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFiltered>>();
      const filtered = { id: 123 };
      jest.spyOn(filteredService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ filtered });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(filteredService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
