import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { INavigationPortal } from '../navigation-portal.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../navigation-portal.test-samples';

import { NavigationPortalService } from './navigation-portal.service';

const requireRestSample: INavigationPortal = {
  ...sampleWithRequiredData,
};

describe('NavigationPortal Service', () => {
  let service: NavigationPortalService;
  let httpMock: HttpTestingController;
  let expectedResult: INavigationPortal | INavigationPortal[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(NavigationPortalService);
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

    it('should create a NavigationPortal', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const navigationPortal = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(navigationPortal).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a NavigationPortal', () => {
      const navigationPortal = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(navigationPortal).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a NavigationPortal', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of NavigationPortal', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a NavigationPortal', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addNavigationPortalToCollectionIfMissing', () => {
      it('should add a NavigationPortal to an empty array', () => {
        const navigationPortal: INavigationPortal = sampleWithRequiredData;
        expectedResult = service.addNavigationPortalToCollectionIfMissing([], navigationPortal);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(navigationPortal);
      });

      it('should not add a NavigationPortal to an array that contains it', () => {
        const navigationPortal: INavigationPortal = sampleWithRequiredData;
        const navigationPortalCollection: INavigationPortal[] = [
          {
            ...navigationPortal,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addNavigationPortalToCollectionIfMissing(navigationPortalCollection, navigationPortal);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a NavigationPortal to an array that doesn't contain it", () => {
        const navigationPortal: INavigationPortal = sampleWithRequiredData;
        const navigationPortalCollection: INavigationPortal[] = [sampleWithPartialData];
        expectedResult = service.addNavigationPortalToCollectionIfMissing(navigationPortalCollection, navigationPortal);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(navigationPortal);
      });

      it('should add only unique NavigationPortal to an array', () => {
        const navigationPortalArray: INavigationPortal[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const navigationPortalCollection: INavigationPortal[] = [sampleWithRequiredData];
        expectedResult = service.addNavigationPortalToCollectionIfMissing(navigationPortalCollection, ...navigationPortalArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const navigationPortal: INavigationPortal = sampleWithRequiredData;
        const navigationPortal2: INavigationPortal = sampleWithPartialData;
        expectedResult = service.addNavigationPortalToCollectionIfMissing([], navigationPortal, navigationPortal2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(navigationPortal);
        expect(expectedResult).toContain(navigationPortal2);
      });

      it('should accept null and undefined values', () => {
        const navigationPortal: INavigationPortal = sampleWithRequiredData;
        expectedResult = service.addNavigationPortalToCollectionIfMissing([], null, navigationPortal, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(navigationPortal);
      });

      it('should return initial array if no NavigationPortal is added', () => {
        const navigationPortalCollection: INavigationPortal[] = [sampleWithRequiredData];
        expectedResult = service.addNavigationPortalToCollectionIfMissing(navigationPortalCollection, undefined, null);
        expect(expectedResult).toEqual(navigationPortalCollection);
      });
    });

    describe('compareNavigationPortal', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareNavigationPortal(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareNavigationPortal(entity1, entity2);
        const compareResult2 = service.compareNavigationPortal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareNavigationPortal(entity1, entity2);
        const compareResult2 = service.compareNavigationPortal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareNavigationPortal(entity1, entity2);
        const compareResult2 = service.compareNavigationPortal(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
