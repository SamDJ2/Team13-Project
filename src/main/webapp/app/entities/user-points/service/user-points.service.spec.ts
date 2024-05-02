import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserPoints } from '../user-points.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../user-points.test-samples';

import { UserPointsService } from './user-points.service';

const requireRestSample: IUserPoints = {
  ...sampleWithRequiredData,
};

describe('UserPoints Service', () => {
  let service: UserPointsService;
  let httpMock: HttpTestingController;
  let expectedResult: IUserPoints | IUserPoints[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserPointsService);
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

    it('should create a UserPoints', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userPoints = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(userPoints).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserPoints', () => {
      const userPoints = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(userPoints).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserPoints', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserPoints', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UserPoints', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUserPointsToCollectionIfMissing', () => {
      it('should add a UserPoints to an empty array', () => {
        const userPoints: IUserPoints = sampleWithRequiredData;
        expectedResult = service.addUserPointsToCollectionIfMissing([], userPoints);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userPoints);
      });

      it('should not add a UserPoints to an array that contains it', () => {
        const userPoints: IUserPoints = sampleWithRequiredData;
        const userPointsCollection: IUserPoints[] = [
          {
            ...userPoints,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUserPointsToCollectionIfMissing(userPointsCollection, userPoints);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserPoints to an array that doesn't contain it", () => {
        const userPoints: IUserPoints = sampleWithRequiredData;
        const userPointsCollection: IUserPoints[] = [sampleWithPartialData];
        expectedResult = service.addUserPointsToCollectionIfMissing(userPointsCollection, userPoints);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userPoints);
      });

      it('should add only unique UserPoints to an array', () => {
        const userPointsArray: IUserPoints[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const userPointsCollection: IUserPoints[] = [sampleWithRequiredData];
        expectedResult = service.addUserPointsToCollectionIfMissing(userPointsCollection, ...userPointsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userPoints: IUserPoints = sampleWithRequiredData;
        const userPoints2: IUserPoints = sampleWithPartialData;
        expectedResult = service.addUserPointsToCollectionIfMissing([], userPoints, userPoints2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userPoints);
        expect(expectedResult).toContain(userPoints2);
      });

      it('should accept null and undefined values', () => {
        const userPoints: IUserPoints = sampleWithRequiredData;
        expectedResult = service.addUserPointsToCollectionIfMissing([], null, userPoints, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userPoints);
      });

      it('should return initial array if no UserPoints is added', () => {
        const userPointsCollection: IUserPoints[] = [sampleWithRequiredData];
        expectedResult = service.addUserPointsToCollectionIfMissing(userPointsCollection, undefined, null);
        expect(expectedResult).toEqual(userPointsCollection);
      });
    });

    describe('compareUserPoints', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUserPoints(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUserPoints(entity1, entity2);
        const compareResult2 = service.compareUserPoints(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUserPoints(entity1, entity2);
        const compareResult2 = service.compareUserPoints(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUserPoints(entity1, entity2);
        const compareResult2 = service.compareUserPoints(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
