import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IWeeklySummary } from '../weekly-summary.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../weekly-summary.test-samples';

import { WeeklySummaryService } from './weekly-summary.service';

const requireRestSample: IWeeklySummary = {
  ...sampleWithRequiredData,
};

describe('WeeklySummary Service', () => {
  let service: WeeklySummaryService;
  let httpMock: HttpTestingController;
  let expectedResult: IWeeklySummary | IWeeklySummary[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(WeeklySummaryService);
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

    it('should create a WeeklySummary', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const weeklySummary = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(weeklySummary).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a WeeklySummary', () => {
      const weeklySummary = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(weeklySummary).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a WeeklySummary', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of WeeklySummary', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a WeeklySummary', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addWeeklySummaryToCollectionIfMissing', () => {
      it('should add a WeeklySummary to an empty array', () => {
        const weeklySummary: IWeeklySummary = sampleWithRequiredData;
        expectedResult = service.addWeeklySummaryToCollectionIfMissing([], weeklySummary);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(weeklySummary);
      });

      it('should not add a WeeklySummary to an array that contains it', () => {
        const weeklySummary: IWeeklySummary = sampleWithRequiredData;
        const weeklySummaryCollection: IWeeklySummary[] = [
          {
            ...weeklySummary,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addWeeklySummaryToCollectionIfMissing(weeklySummaryCollection, weeklySummary);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a WeeklySummary to an array that doesn't contain it", () => {
        const weeklySummary: IWeeklySummary = sampleWithRequiredData;
        const weeklySummaryCollection: IWeeklySummary[] = [sampleWithPartialData];
        expectedResult = service.addWeeklySummaryToCollectionIfMissing(weeklySummaryCollection, weeklySummary);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(weeklySummary);
      });

      it('should add only unique WeeklySummary to an array', () => {
        const weeklySummaryArray: IWeeklySummary[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const weeklySummaryCollection: IWeeklySummary[] = [sampleWithRequiredData];
        expectedResult = service.addWeeklySummaryToCollectionIfMissing(weeklySummaryCollection, ...weeklySummaryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const weeklySummary: IWeeklySummary = sampleWithRequiredData;
        const weeklySummary2: IWeeklySummary = sampleWithPartialData;
        expectedResult = service.addWeeklySummaryToCollectionIfMissing([], weeklySummary, weeklySummary2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(weeklySummary);
        expect(expectedResult).toContain(weeklySummary2);
      });

      it('should accept null and undefined values', () => {
        const weeklySummary: IWeeklySummary = sampleWithRequiredData;
        expectedResult = service.addWeeklySummaryToCollectionIfMissing([], null, weeklySummary, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(weeklySummary);
      });

      it('should return initial array if no WeeklySummary is added', () => {
        const weeklySummaryCollection: IWeeklySummary[] = [sampleWithRequiredData];
        expectedResult = service.addWeeklySummaryToCollectionIfMissing(weeklySummaryCollection, undefined, null);
        expect(expectedResult).toEqual(weeklySummaryCollection);
      });
    });

    describe('compareWeeklySummary', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareWeeklySummary(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareWeeklySummary(entity1, entity2);
        const compareResult2 = service.compareWeeklySummary(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareWeeklySummary(entity1, entity2);
        const compareResult2 = service.compareWeeklySummary(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareWeeklySummary(entity1, entity2);
        const compareResult2 = service.compareWeeklySummary(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
