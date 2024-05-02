import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IScreenTime } from '../screen-time.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../screen-time.test-samples';

import { ScreenTimeService } from './screen-time.service';

const requireRestSample: IScreenTime = {
  ...sampleWithRequiredData,
};

describe('ScreenTime Service', () => {
  let service: ScreenTimeService;
  let httpMock: HttpTestingController;
  let expectedResult: IScreenTime | IScreenTime[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ScreenTimeService);
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

    it('should create a ScreenTime', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const screenTime = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(screenTime).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ScreenTime', () => {
      const screenTime = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(screenTime).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ScreenTime', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ScreenTime', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ScreenTime', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addScreenTimeToCollectionIfMissing', () => {
      it('should add a ScreenTime to an empty array', () => {
        const screenTime: IScreenTime = sampleWithRequiredData;
        expectedResult = service.addScreenTimeToCollectionIfMissing([], screenTime);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(screenTime);
      });

      it('should not add a ScreenTime to an array that contains it', () => {
        const screenTime: IScreenTime = sampleWithRequiredData;
        const screenTimeCollection: IScreenTime[] = [
          {
            ...screenTime,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addScreenTimeToCollectionIfMissing(screenTimeCollection, screenTime);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ScreenTime to an array that doesn't contain it", () => {
        const screenTime: IScreenTime = sampleWithRequiredData;
        const screenTimeCollection: IScreenTime[] = [sampleWithPartialData];
        expectedResult = service.addScreenTimeToCollectionIfMissing(screenTimeCollection, screenTime);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(screenTime);
      });

      it('should add only unique ScreenTime to an array', () => {
        const screenTimeArray: IScreenTime[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const screenTimeCollection: IScreenTime[] = [sampleWithRequiredData];
        expectedResult = service.addScreenTimeToCollectionIfMissing(screenTimeCollection, ...screenTimeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const screenTime: IScreenTime = sampleWithRequiredData;
        const screenTime2: IScreenTime = sampleWithPartialData;
        expectedResult = service.addScreenTimeToCollectionIfMissing([], screenTime, screenTime2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(screenTime);
        expect(expectedResult).toContain(screenTime2);
      });

      it('should accept null and undefined values', () => {
        const screenTime: IScreenTime = sampleWithRequiredData;
        expectedResult = service.addScreenTimeToCollectionIfMissing([], null, screenTime, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(screenTime);
      });

      it('should return initial array if no ScreenTime is added', () => {
        const screenTimeCollection: IScreenTime[] = [sampleWithRequiredData];
        expectedResult = service.addScreenTimeToCollectionIfMissing(screenTimeCollection, undefined, null);
        expect(expectedResult).toEqual(screenTimeCollection);
      });
    });

    describe('compareScreenTime', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareScreenTime(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareScreenTime(entity1, entity2);
        const compareResult2 = service.compareScreenTime(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareScreenTime(entity1, entity2);
        const compareResult2 = service.compareScreenTime(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareScreenTime(entity1, entity2);
        const compareResult2 = service.compareScreenTime(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
