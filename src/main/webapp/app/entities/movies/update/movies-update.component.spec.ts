import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MoviesFormService } from './movies-form.service';
import { MoviesService } from '../service/movies.service';
import { IMovies } from '../movies.model';

import { MoviesUpdateComponent } from './movies-update.component';

describe('Movies Management Update Component', () => {
  let comp: MoviesUpdateComponent;
  let fixture: ComponentFixture<MoviesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let moviesFormService: MoviesFormService;
  let moviesService: MoviesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MoviesUpdateComponent],
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
      .overrideTemplate(MoviesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MoviesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    moviesFormService = TestBed.inject(MoviesFormService);
    moviesService = TestBed.inject(MoviesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const movies: IMovies = { id: 456 };

      activatedRoute.data = of({ movies });
      comp.ngOnInit();

      expect(comp.movies).toEqual(movies);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMovies>>();
      const movies = { id: 123 };
      jest.spyOn(moviesFormService, 'getMovies').mockReturnValue(movies);
      jest.spyOn(moviesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ movies });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: movies }));
      saveSubject.complete();

      // THEN
      expect(moviesFormService.getMovies).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(moviesService.update).toHaveBeenCalledWith(expect.objectContaining(movies));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMovies>>();
      const movies = { id: 123 };
      jest.spyOn(moviesFormService, 'getMovies').mockReturnValue({ id: null });
      jest.spyOn(moviesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ movies: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: movies }));
      saveSubject.complete();

      // THEN
      expect(moviesFormService.getMovies).toHaveBeenCalled();
      expect(moviesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMovies>>();
      const movies = { id: 123 };
      jest.spyOn(moviesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ movies });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(moviesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
