import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISmoking } from '../smoking.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../smoking.test-samples';

import { SmokingService } from './smoking.service';

const requireRestSample: ISmoking = {
  ...sampleWithRequiredData,
};

describe('Smoking Service', () => {
  let service: SmokingService;
  let httpMock: HttpTestingController;
  let expectedResult: ISmoking | ISmoking[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SmokingService);
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

    it('should create a Smoking', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const smoking = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(smoking).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Smoking', () => {
      const smoking = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(smoking).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Smoking', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Smoking', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Smoking', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSmokingToCollectionIfMissing', () => {
      it('should add a Smoking to an empty array', () => {
        const smoking: ISmoking = sampleWithRequiredData;
        expectedResult = service.addSmokingToCollectionIfMissing([], smoking);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(smoking);
      });

      it('should not add a Smoking to an array that contains it', () => {
        const smoking: ISmoking = sampleWithRequiredData;
        const smokingCollection: ISmoking[] = [
          {
            ...smoking,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSmokingToCollectionIfMissing(smokingCollection, smoking);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Smoking to an array that doesn't contain it", () => {
        const smoking: ISmoking = sampleWithRequiredData;
        const smokingCollection: ISmoking[] = [sampleWithPartialData];
        expectedResult = service.addSmokingToCollectionIfMissing(smokingCollection, smoking);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(smoking);
      });

      it('should add only unique Smoking to an array', () => {
        const smokingArray: ISmoking[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const smokingCollection: ISmoking[] = [sampleWithRequiredData];
        expectedResult = service.addSmokingToCollectionIfMissing(smokingCollection, ...smokingArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const smoking: ISmoking = sampleWithRequiredData;
        const smoking2: ISmoking = sampleWithPartialData;
        expectedResult = service.addSmokingToCollectionIfMissing([], smoking, smoking2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(smoking);
        expect(expectedResult).toContain(smoking2);
      });

      it('should accept null and undefined values', () => {
        const smoking: ISmoking = sampleWithRequiredData;
        expectedResult = service.addSmokingToCollectionIfMissing([], null, smoking, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(smoking);
      });

      it('should return initial array if no Smoking is added', () => {
        const smokingCollection: ISmoking[] = [sampleWithRequiredData];
        expectedResult = service.addSmokingToCollectionIfMissing(smokingCollection, undefined, null);
        expect(expectedResult).toEqual(smokingCollection);
      });
    });

    describe('compareSmoking', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSmoking(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSmoking(entity1, entity2);
        const compareResult2 = service.compareSmoking(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSmoking(entity1, entity2);
        const compareResult2 = service.compareSmoking(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSmoking(entity1, entity2);
        const compareResult2 = service.compareSmoking(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
