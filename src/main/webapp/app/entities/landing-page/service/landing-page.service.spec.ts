import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILandingPage } from '../landing-page.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../landing-page.test-samples';

import { LandingPageService } from './landing-page.service';

const requireRestSample: ILandingPage = {
  ...sampleWithRequiredData,
};

describe('LandingPage Service', () => {
  let service: LandingPageService;
  let httpMock: HttpTestingController;
  let expectedResult: ILandingPage | ILandingPage[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LandingPageService);
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

    it('should create a LandingPage', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const landingPage = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(landingPage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LandingPage', () => {
      const landingPage = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(landingPage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LandingPage', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LandingPage', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a LandingPage', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLandingPageToCollectionIfMissing', () => {
      it('should add a LandingPage to an empty array', () => {
        const landingPage: ILandingPage = sampleWithRequiredData;
        expectedResult = service.addLandingPageToCollectionIfMissing([], landingPage);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(landingPage);
      });

      it('should not add a LandingPage to an array that contains it', () => {
        const landingPage: ILandingPage = sampleWithRequiredData;
        const landingPageCollection: ILandingPage[] = [
          {
            ...landingPage,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLandingPageToCollectionIfMissing(landingPageCollection, landingPage);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LandingPage to an array that doesn't contain it", () => {
        const landingPage: ILandingPage = sampleWithRequiredData;
        const landingPageCollection: ILandingPage[] = [sampleWithPartialData];
        expectedResult = service.addLandingPageToCollectionIfMissing(landingPageCollection, landingPage);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(landingPage);
      });

      it('should add only unique LandingPage to an array', () => {
        const landingPageArray: ILandingPage[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const landingPageCollection: ILandingPage[] = [sampleWithRequiredData];
        expectedResult = service.addLandingPageToCollectionIfMissing(landingPageCollection, ...landingPageArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const landingPage: ILandingPage = sampleWithRequiredData;
        const landingPage2: ILandingPage = sampleWithPartialData;
        expectedResult = service.addLandingPageToCollectionIfMissing([], landingPage, landingPage2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(landingPage);
        expect(expectedResult).toContain(landingPage2);
      });

      it('should accept null and undefined values', () => {
        const landingPage: ILandingPage = sampleWithRequiredData;
        expectedResult = service.addLandingPageToCollectionIfMissing([], null, landingPage, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(landingPage);
      });

      it('should return initial array if no LandingPage is added', () => {
        const landingPageCollection: ILandingPage[] = [sampleWithRequiredData];
        expectedResult = service.addLandingPageToCollectionIfMissing(landingPageCollection, undefined, null);
        expect(expectedResult).toEqual(landingPageCollection);
      });
    });

    describe('compareLandingPage', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLandingPage(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLandingPage(entity1, entity2);
        const compareResult2 = service.compareLandingPage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLandingPage(entity1, entity2);
        const compareResult2 = service.compareLandingPage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLandingPage(entity1, entity2);
        const compareResult2 = service.compareLandingPage(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
