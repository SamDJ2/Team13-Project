import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBadges } from '../badges.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../badges.test-samples';

import { BadgesService } from './badges.service';

const requireRestSample: IBadges = {
  ...sampleWithRequiredData,
};

describe('Badges Service', () => {
  let service: BadgesService;
  let httpMock: HttpTestingController;
  let expectedResult: IBadges | IBadges[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BadgesService);
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

    it('should create a Badges', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const badges = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(badges).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Badges', () => {
      const badges = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(badges).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Badges', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Badges', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Badges', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBadgesToCollectionIfMissing', () => {
      it('should add a Badges to an empty array', () => {
        const badges: IBadges = sampleWithRequiredData;
        expectedResult = service.addBadgesToCollectionIfMissing([], badges);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(badges);
      });

      it('should not add a Badges to an array that contains it', () => {
        const badges: IBadges = sampleWithRequiredData;
        const badgesCollection: IBadges[] = [
          {
            ...badges,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBadgesToCollectionIfMissing(badgesCollection, badges);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Badges to an array that doesn't contain it", () => {
        const badges: IBadges = sampleWithRequiredData;
        const badgesCollection: IBadges[] = [sampleWithPartialData];
        expectedResult = service.addBadgesToCollectionIfMissing(badgesCollection, badges);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(badges);
      });

      it('should add only unique Badges to an array', () => {
        const badgesArray: IBadges[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const badgesCollection: IBadges[] = [sampleWithRequiredData];
        expectedResult = service.addBadgesToCollectionIfMissing(badgesCollection, ...badgesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const badges: IBadges = sampleWithRequiredData;
        const badges2: IBadges = sampleWithPartialData;
        expectedResult = service.addBadgesToCollectionIfMissing([], badges, badges2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(badges);
        expect(expectedResult).toContain(badges2);
      });

      it('should accept null and undefined values', () => {
        const badges: IBadges = sampleWithRequiredData;
        expectedResult = service.addBadgesToCollectionIfMissing([], null, badges, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(badges);
      });

      it('should return initial array if no Badges is added', () => {
        const badgesCollection: IBadges[] = [sampleWithRequiredData];
        expectedResult = service.addBadgesToCollectionIfMissing(badgesCollection, undefined, null);
        expect(expectedResult).toEqual(badgesCollection);
      });
    });

    describe('compareBadges', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBadges(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareBadges(entity1, entity2);
        const compareResult2 = service.compareBadges(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareBadges(entity1, entity2);
        const compareResult2 = service.compareBadges(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareBadges(entity1, entity2);
        const compareResult2 = service.compareBadges(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
