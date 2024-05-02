import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IPromptsPage } from '../prompts-page.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../prompts-page.test-samples';

import { PromptsPageService, RestPromptsPage } from './prompts-page.service';

const requireRestSample: RestPromptsPage = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.format(DATE_FORMAT),
};

describe('PromptsPage Service', () => {
  let service: PromptsPageService;
  let httpMock: HttpTestingController;
  let expectedResult: IPromptsPage | IPromptsPage[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PromptsPageService);
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

    it('should create a PromptsPage', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const promptsPage = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(promptsPage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PromptsPage', () => {
      const promptsPage = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(promptsPage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PromptsPage', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PromptsPage', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PromptsPage', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPromptsPageToCollectionIfMissing', () => {
      it('should add a PromptsPage to an empty array', () => {
        const promptsPage: IPromptsPage = sampleWithRequiredData;
        expectedResult = service.addPromptsPageToCollectionIfMissing([], promptsPage);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(promptsPage);
      });

      it('should not add a PromptsPage to an array that contains it', () => {
        const promptsPage: IPromptsPage = sampleWithRequiredData;
        const promptsPageCollection: IPromptsPage[] = [
          {
            ...promptsPage,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPromptsPageToCollectionIfMissing(promptsPageCollection, promptsPage);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PromptsPage to an array that doesn't contain it", () => {
        const promptsPage: IPromptsPage = sampleWithRequiredData;
        const promptsPageCollection: IPromptsPage[] = [sampleWithPartialData];
        expectedResult = service.addPromptsPageToCollectionIfMissing(promptsPageCollection, promptsPage);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(promptsPage);
      });

      it('should add only unique PromptsPage to an array', () => {
        const promptsPageArray: IPromptsPage[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const promptsPageCollection: IPromptsPage[] = [sampleWithRequiredData];
        expectedResult = service.addPromptsPageToCollectionIfMissing(promptsPageCollection, ...promptsPageArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const promptsPage: IPromptsPage = sampleWithRequiredData;
        const promptsPage2: IPromptsPage = sampleWithPartialData;
        expectedResult = service.addPromptsPageToCollectionIfMissing([], promptsPage, promptsPage2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(promptsPage);
        expect(expectedResult).toContain(promptsPage2);
      });

      it('should accept null and undefined values', () => {
        const promptsPage: IPromptsPage = sampleWithRequiredData;
        expectedResult = service.addPromptsPageToCollectionIfMissing([], null, promptsPage, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(promptsPage);
      });

      it('should return initial array if no PromptsPage is added', () => {
        const promptsPageCollection: IPromptsPage[] = [sampleWithRequiredData];
        expectedResult = service.addPromptsPageToCollectionIfMissing(promptsPageCollection, undefined, null);
        expect(expectedResult).toEqual(promptsPageCollection);
      });
    });

    describe('comparePromptsPage', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePromptsPage(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePromptsPage(entity1, entity2);
        const compareResult2 = service.comparePromptsPage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePromptsPage(entity1, entity2);
        const compareResult2 = service.comparePromptsPage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePromptsPage(entity1, entity2);
        const compareResult2 = service.comparePromptsPage(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
