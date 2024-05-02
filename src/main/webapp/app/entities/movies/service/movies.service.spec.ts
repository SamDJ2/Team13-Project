import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMovies } from '../movies.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../movies.test-samples';

import { MoviesService } from './movies.service';

const requireRestSample: IMovies = {
  ...sampleWithRequiredData,
};

describe('Movies Service', () => {
  let service: MoviesService;
  let httpMock: HttpTestingController;
  let expectedResult: IMovies | IMovies[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MoviesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Movies', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const movies = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(movies).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Movies', () => {
      const movies = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(movies).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Movies', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Movies', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Movies', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMoviesToCollectionIfMissing', () => {
      it('should add a Movies to an empty array', () => {
        const movies: IMovies = sampleWithRequiredData;
        expectedResult = service.addMoviesToCollectionIfMissing([], movies);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(movies);
      });

      it('should not add a Movies to an array that contains it', () => {
        const movies: IMovies = sampleWithRequiredData;
        const moviesCollection: IMovies[] = [
          {
            ...movies,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMoviesToCollectionIfMissing(moviesCollection, movies);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Movies to an array that doesn't contain it", () => {
        const movies: IMovies = sampleWithRequiredData;
        const moviesCollection: IMovies[] = [sampleWithPartialData];
        expectedResult = service.addMoviesToCollectionIfMissing(moviesCollection, movies);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(movies);
      });

      it('should add only unique Movies to an array', () => {
        const moviesArray: IMovies[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const moviesCollection: IMovies[] = [sampleWithRequiredData];
        expectedResult = service.addMoviesToCollectionIfMissing(moviesCollection, ...moviesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const movies: IMovies = sampleWithRequiredData;
        const movies2: IMovies = sampleWithPartialData;
        expectedResult = service.addMoviesToCollectionIfMissing([], movies, movies2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(movies);
        expect(expectedResult).toContain(movies2);
      });

      it('should accept null and undefined values', () => {
        const movies: IMovies = sampleWithRequiredData;
        expectedResult = service.addMoviesToCollectionIfMissing([], null, movies, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(movies);
      });

      it('should return initial array if no Movies is added', () => {
        const moviesCollection: IMovies[] = [sampleWithRequiredData];
        expectedResult = service.addMoviesToCollectionIfMissing(moviesCollection, undefined, null);
        expect(expectedResult).toEqual(moviesCollection);
      });
    });

    describe('compareMovies', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMovies(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMovies(entity1, entity2);
        const compareResult2 = service.compareMovies(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMovies(entity1, entity2);
        const compareResult2 = service.compareMovies(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMovies(entity1, entity2);
        const compareResult2 = service.compareMovies(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
