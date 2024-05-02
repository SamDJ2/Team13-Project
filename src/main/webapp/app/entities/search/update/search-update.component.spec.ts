import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SearchFormService } from './search-form.service';
import { SearchService } from '../service/search.service';
import { ISearch } from '../search.model';

import { SearchUpdateComponent } from './search-update.component';

describe('Search Management Update Component', () => {
  let comp: SearchUpdateComponent;
  let fixture: ComponentFixture<SearchUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let searchFormService: SearchFormService;
  let searchService: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SearchUpdateComponent],
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
      .overrideTemplate(SearchUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SearchUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    searchFormService = TestBed.inject(SearchFormService);
    searchService = TestBed.inject(SearchService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const search: ISearch = { id: 456 };

      activatedRoute.data = of({ search });
      comp.ngOnInit();

      expect(comp.search).toEqual(search);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISearch>>();
      const search = { id: 123 };
      jest.spyOn(searchFormService, 'getSearch').mockReturnValue(search);
      jest.spyOn(searchService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ search });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: search }));
      saveSubject.complete();

      // THEN
      expect(searchFormService.getSearch).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(searchService.update).toHaveBeenCalledWith(expect.objectContaining(search));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISearch>>();
      const search = { id: 123 };
      jest.spyOn(searchFormService, 'getSearch').mockReturnValue({ id: null });
      jest.spyOn(searchService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ search: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: search }));
      saveSubject.complete();

      // THEN
      expect(searchFormService.getSearch).toHaveBeenCalled();
      expect(searchService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISearch>>();
      const search = { id: 123 };
      jest.spyOn(searchService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ search });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(searchService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
