import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IJoinedTeams } from '../joined-teams.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../joined-teams.test-samples';

import { JoinedTeamsService, RestJoinedTeams } from './joined-teams.service';

const requireRestSample: RestJoinedTeams = {
  ...sampleWithRequiredData,
  memberSince: sampleWithRequiredData.memberSince?.format(DATE_FORMAT),
};

describe('JoinedTeams Service', () => {
  let service: JoinedTeamsService;
  let httpMock: HttpTestingController;
  let expectedResult: IJoinedTeams | IJoinedTeams[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(JoinedTeamsService);
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

    it('should create a JoinedTeams', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const joinedTeams = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(joinedTeams).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a JoinedTeams', () => {
      const joinedTeams = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(joinedTeams).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a JoinedTeams', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of JoinedTeams', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a JoinedTeams', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addJoinedTeamsToCollectionIfMissing', () => {
      it('should add a JoinedTeams to an empty array', () => {
        const joinedTeams: IJoinedTeams = sampleWithRequiredData;
        expectedResult = service.addJoinedTeamsToCollectionIfMissing([], joinedTeams);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(joinedTeams);
      });

      it('should not add a JoinedTeams to an array that contains it', () => {
        const joinedTeams: IJoinedTeams = sampleWithRequiredData;
        const joinedTeamsCollection: IJoinedTeams[] = [
          {
            ...joinedTeams,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addJoinedTeamsToCollectionIfMissing(joinedTeamsCollection, joinedTeams);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a JoinedTeams to an array that doesn't contain it", () => {
        const joinedTeams: IJoinedTeams = sampleWithRequiredData;
        const joinedTeamsCollection: IJoinedTeams[] = [sampleWithPartialData];
        expectedResult = service.addJoinedTeamsToCollectionIfMissing(joinedTeamsCollection, joinedTeams);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(joinedTeams);
      });

      it('should add only unique JoinedTeams to an array', () => {
        const joinedTeamsArray: IJoinedTeams[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const joinedTeamsCollection: IJoinedTeams[] = [sampleWithRequiredData];
        expectedResult = service.addJoinedTeamsToCollectionIfMissing(joinedTeamsCollection, ...joinedTeamsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const joinedTeams: IJoinedTeams = sampleWithRequiredData;
        const joinedTeams2: IJoinedTeams = sampleWithPartialData;
        expectedResult = service.addJoinedTeamsToCollectionIfMissing([], joinedTeams, joinedTeams2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(joinedTeams);
        expect(expectedResult).toContain(joinedTeams2);
      });

      it('should accept null and undefined values', () => {
        const joinedTeams: IJoinedTeams = sampleWithRequiredData;
        expectedResult = service.addJoinedTeamsToCollectionIfMissing([], null, joinedTeams, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(joinedTeams);
      });

      it('should return initial array if no JoinedTeams is added', () => {
        const joinedTeamsCollection: IJoinedTeams[] = [sampleWithRequiredData];
        expectedResult = service.addJoinedTeamsToCollectionIfMissing(joinedTeamsCollection, undefined, null);
        expect(expectedResult).toEqual(joinedTeamsCollection);
      });
    });

    describe('compareJoinedTeams', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareJoinedTeams(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareJoinedTeams(entity1, entity2);
        const compareResult2 = service.compareJoinedTeams(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareJoinedTeams(entity1, entity2);
        const compareResult2 = service.compareJoinedTeams(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareJoinedTeams(entity1, entity2);
        const compareResult2 = service.compareJoinedTeams(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
