import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFiltered } from '../filtered.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../filtered.test-samples';

import { FilteredService } from './filtered.service';

const requireRestSample: IFiltered = {
  ...sampleWithRequiredData,
};

describe('Filtered Service', () => {
  let service: FilteredService;
  let httpMock: HttpTestingController;
  let expectedResult: IFiltered | IFiltered[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FilteredService);
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

    it('should create a Filtered', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const filtered = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(filtered).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Filtered', () => {
      const filtered = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(filtered).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Filtered', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Filtered', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Filtered', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFilteredToCollectionIfMissing', () => {
      it('should add a Filtered to an empty array', () => {
        const filtered: IFiltered = sampleWithRequiredData;
        expectedResult = service.addFilteredToCollectionIfMissing([], filtered);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(filtered);
      });

      it('should not add a Filtered to an array that contains it', () => {
        const filtered: IFiltered = sampleWithRequiredData;
        const filteredCollection: IFiltered[] = [
          {
            ...filtered,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFilteredToCollectionIfMissing(filteredCollection, filtered);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Filtered to an array that doesn't contain it", () => {
        const filtered: IFiltered = sampleWithRequiredData;
        const filteredCollection: IFiltered[] = [sampleWithPartialData];
        expectedResult = service.addFilteredToCollectionIfMissing(filteredCollection, filtered);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(filtered);
      });

      it('should add only unique Filtered to an array', () => {
        const filteredArray: IFiltered[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const filteredCollection: IFiltered[] = [sampleWithRequiredData];
        expectedResult = service.addFilteredToCollectionIfMissing(filteredCollection, ...filteredArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const filtered: IFiltered = sampleWithRequiredData;
        const filtered2: IFiltered = sampleWithPartialData;
        expectedResult = service.addFilteredToCollectionIfMissing([], filtered, filtered2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(filtered);
        expect(expectedResult).toContain(filtered2);
      });

      it('should accept null and undefined values', () => {
        const filtered: IFiltered = sampleWithRequiredData;
        expectedResult = service.addFilteredToCollectionIfMissing([], null, filtered, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(filtered);
      });

      it('should return initial array if no Filtered is added', () => {
        const filteredCollection: IFiltered[] = [sampleWithRequiredData];
        expectedResult = service.addFilteredToCollectionIfMissing(filteredCollection, undefined, null);
        expect(expectedResult).toEqual(filteredCollection);
      });
    });

    describe('compareFiltered', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFiltered(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFiltered(entity1, entity2);
        const compareResult2 = service.compareFiltered(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareFiltered(entity1, entity2);
        const compareResult2 = service.compareFiltered(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareFiltered(entity1, entity2);
        const compareResult2 = service.compareFiltered(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
