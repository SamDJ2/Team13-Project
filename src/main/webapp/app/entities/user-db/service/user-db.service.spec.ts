import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserDB } from '../user-db.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../user-db.test-samples';

import { UserDBService } from './user-db.service';

const requireRestSample: IUserDB = {
  ...sampleWithRequiredData,
};

describe('UserDB Service', () => {
  let service: UserDBService;
  let httpMock: HttpTestingController;
  let expectedResult: IUserDB | IUserDB[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserDBService);
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

    it('should create a UserDB', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userDB = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(userDB).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserDB', () => {
      const userDB = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(userDB).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserDB', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserDB', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UserDB', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUserDBToCollectionIfMissing', () => {
      it('should add a UserDB to an empty array', () => {
        const userDB: IUserDB = sampleWithRequiredData;
        expectedResult = service.addUserDBToCollectionIfMissing([], userDB);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userDB);
      });

      it('should not add a UserDB to an array that contains it', () => {
        const userDB: IUserDB = sampleWithRequiredData;
        const userDBCollection: IUserDB[] = [
          {
            ...userDB,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUserDBToCollectionIfMissing(userDBCollection, userDB);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserDB to an array that doesn't contain it", () => {
        const userDB: IUserDB = sampleWithRequiredData;
        const userDBCollection: IUserDB[] = [sampleWithPartialData];
        expectedResult = service.addUserDBToCollectionIfMissing(userDBCollection, userDB);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userDB);
      });

      it('should add only unique UserDB to an array', () => {
        const userDBArray: IUserDB[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const userDBCollection: IUserDB[] = [sampleWithRequiredData];
        expectedResult = service.addUserDBToCollectionIfMissing(userDBCollection, ...userDBArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userDB: IUserDB = sampleWithRequiredData;
        const userDB2: IUserDB = sampleWithPartialData;
        expectedResult = service.addUserDBToCollectionIfMissing([], userDB, userDB2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userDB);
        expect(expectedResult).toContain(userDB2);
      });

      it('should accept null and undefined values', () => {
        const userDB: IUserDB = sampleWithRequiredData;
        expectedResult = service.addUserDBToCollectionIfMissing([], null, userDB, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userDB);
      });

      it('should return initial array if no UserDB is added', () => {
        const userDBCollection: IUserDB[] = [sampleWithRequiredData];
        expectedResult = service.addUserDBToCollectionIfMissing(userDBCollection, undefined, null);
        expect(expectedResult).toEqual(userDBCollection);
      });
    });

    describe('compareUserDB', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUserDB(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUserDB(entity1, entity2);
        const compareResult2 = service.compareUserDB(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUserDB(entity1, entity2);
        const compareResult2 = service.compareUserDB(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUserDB(entity1, entity2);
        const compareResult2 = service.compareUserDB(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
