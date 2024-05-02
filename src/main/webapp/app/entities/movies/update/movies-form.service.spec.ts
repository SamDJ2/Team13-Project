import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../movies.test-samples';

import { MoviesFormService } from './movies-form.service';

describe('Movies Form Service', () => {
  let service: MoviesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoviesFormService);
  });

  describe('Service methods', () => {
    describe('createMoviesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMoviesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            levels: expect.any(Object),
            progress: expect.any(Object),
            timer: expect.any(Object),
          })
        );
      });

      it('passing IMovies should create a new form with FormGroup', () => {
        const formGroup = service.createMoviesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            levels: expect.any(Object),
            progress: expect.any(Object),
            timer: expect.any(Object),
          })
        );
      });
    });

    describe('getMovies', () => {
      it('should return NewMovies for default Movies initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMoviesFormGroup(sampleWithNewData);

        const movies = service.getMovies(formGroup) as any;

        expect(movies).toMatchObject(sampleWithNewData);
      });

      it('should return NewMovies for empty Movies initial value', () => {
        const formGroup = service.createMoviesFormGroup();

        const movies = service.getMovies(formGroup) as any;

        expect(movies).toMatchObject({});
      });

      it('should return IMovies', () => {
        const formGroup = service.createMoviesFormGroup(sampleWithRequiredData);

        const movies = service.getMovies(formGroup) as any;

        expect(movies).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMovies should not enable id FormControl', () => {
        const formGroup = service.createMoviesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMovies should disable id FormControl', () => {
        const formGroup = service.createMoviesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
