import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILeaderBoards } from '../leader-boards.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../leader-boards.test-samples';

import { LeaderBoardsService } from './leader-boards.service';

const requireRestSample: ILeaderBoards = {
  ...sampleWithRequiredData,
};

describe('LeaderBoards Service', () => {
  let service: LeaderBoardsService;
  let httpMock: HttpTestingController;
  let expectedResult: ILeaderBoards | ILeaderBoards[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LeaderBoardsService);
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

    it('should create a LeaderBoards', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const leaderBoards = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(leaderBoards).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LeaderBoards', () => {
      const leaderBoards = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(leaderBoards).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LeaderBoards', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LeaderBoards', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a LeaderBoards', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLeaderBoardsToCollectionIfMissing', () => {
      it('should add a LeaderBoards to an empty array', () => {
        const leaderBoards: ILeaderBoards = sampleWithRequiredData;
        expectedResult = service.addLeaderBoardsToCollectionIfMissing([], leaderBoards);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(leaderBoards);
      });

      it('should not add a LeaderBoards to an array that contains it', () => {
        const leaderBoards: ILeaderBoards = sampleWithRequiredData;
        const leaderBoardsCollection: ILeaderBoards[] = [
          {
            ...leaderBoards,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLeaderBoardsToCollectionIfMissing(leaderBoardsCollection, leaderBoards);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LeaderBoards to an array that doesn't contain it", () => {
        const leaderBoards: ILeaderBoards = sampleWithRequiredData;
        const leaderBoardsCollection: ILeaderBoards[] = [sampleWithPartialData];
        expectedResult = service.addLeaderBoardsToCollectionIfMissing(leaderBoardsCollection, leaderBoards);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(leaderBoards);
      });

      it('should add only unique LeaderBoards to an array', () => {
        const leaderBoardsArray: ILeaderBoards[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const leaderBoardsCollection: ILeaderBoards[] = [sampleWithRequiredData];
        expectedResult = service.addLeaderBoardsToCollectionIfMissing(leaderBoardsCollection, ...leaderBoardsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const leaderBoards: ILeaderBoards = sampleWithRequiredData;
        const leaderBoards2: ILeaderBoards = sampleWithPartialData;
        expectedResult = service.addLeaderBoardsToCollectionIfMissing([], leaderBoards, leaderBoards2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(leaderBoards);
        expect(expectedResult).toContain(leaderBoards2);
      });

      it('should accept null and undefined values', () => {
        const leaderBoards: ILeaderBoards = sampleWithRequiredData;
        expectedResult = service.addLeaderBoardsToCollectionIfMissing([], null, leaderBoards, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(leaderBoards);
      });

      it('should return initial array if no LeaderBoards is added', () => {
        const leaderBoardsCollection: ILeaderBoards[] = [sampleWithRequiredData];
        expectedResult = service.addLeaderBoardsToCollectionIfMissing(leaderBoardsCollection, undefined, null);
        expect(expectedResult).toEqual(leaderBoardsCollection);
      });
    });

    describe('compareLeaderBoards', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLeaderBoards(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLeaderBoards(entity1, entity2);
        const compareResult2 = service.compareLeaderBoards(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLeaderBoards(entity1, entity2);
        const compareResult2 = service.compareLeaderBoards(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLeaderBoards(entity1, entity2);
        const compareResult2 = service.compareLeaderBoards(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
