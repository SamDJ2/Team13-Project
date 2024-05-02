import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IChallenges } from '../challenges.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../challenges.test-samples';

import { ChallengesService } from './challenges.service';

const requireRestSample: IChallenges = {
  ...sampleWithRequiredData,
};

describe('Challenges Service', () => {
  let service: ChallengesService;
  let httpMock: HttpTestingController;
  let expectedResult: IChallenges | IChallenges[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ChallengesService);
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

    it('should create a Challenges', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const challenges = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(challenges).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Challenges', () => {
      const challenges = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(challenges).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Challenges', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Challenges', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Challenges', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addChallengesToCollectionIfMissing', () => {
      it('should add a Challenges to an empty array', () => {
        const challenges: IChallenges = sampleWithRequiredData;
        expectedResult = service.addChallengesToCollectionIfMissing([], challenges);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(challenges);
      });

      it('should not add a Challenges to an array that contains it', () => {
        const challenges: IChallenges = sampleWithRequiredData;
        const challengesCollection: IChallenges[] = [
          {
            ...challenges,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addChallengesToCollectionIfMissing(challengesCollection, challenges);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Challenges to an array that doesn't contain it", () => {
        const challenges: IChallenges = sampleWithRequiredData;
        const challengesCollection: IChallenges[] = [sampleWithPartialData];
        expectedResult = service.addChallengesToCollectionIfMissing(challengesCollection, challenges);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(challenges);
      });

      it('should add only unique Challenges to an array', () => {
        const challengesArray: IChallenges[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const challengesCollection: IChallenges[] = [sampleWithRequiredData];
        expectedResult = service.addChallengesToCollectionIfMissing(challengesCollection, ...challengesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const challenges: IChallenges = sampleWithRequiredData;
        const challenges2: IChallenges = sampleWithPartialData;
        expectedResult = service.addChallengesToCollectionIfMissing([], challenges, challenges2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(challenges);
        expect(expectedResult).toContain(challenges2);
      });

      it('should accept null and undefined values', () => {
        const challenges: IChallenges = sampleWithRequiredData;
        expectedResult = service.addChallengesToCollectionIfMissing([], null, challenges, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(challenges);
      });

      it('should return initial array if no Challenges is added', () => {
        const challengesCollection: IChallenges[] = [sampleWithRequiredData];
        expectedResult = service.addChallengesToCollectionIfMissing(challengesCollection, undefined, null);
        expect(expectedResult).toEqual(challengesCollection);
      });
    });

    describe('compareChallenges', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareChallenges(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareChallenges(entity1, entity2);
        const compareResult2 = service.compareChallenges(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareChallenges(entity1, entity2);
        const compareResult2 = service.compareChallenges(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareChallenges(entity1, entity2);
        const compareResult2 = service.compareChallenges(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
