import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IMoodJournalPage } from '../mood-journal-page.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../mood-journal-page.test-samples';

import { MoodJournalPageService, RestMoodJournalPage } from './mood-journal-page.service';

const requireRestSample: RestMoodJournalPage = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.format(DATE_FORMAT),
};

describe('MoodJournalPage Service', () => {
  let service: MoodJournalPageService;
  let httpMock: HttpTestingController;
  let expectedResult: IMoodJournalPage | IMoodJournalPage[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MoodJournalPageService);
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

    it('should create a MoodJournalPage', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const moodJournalPage = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(moodJournalPage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MoodJournalPage', () => {
      const moodJournalPage = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(moodJournalPage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a MoodJournalPage', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of MoodJournalPage', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a MoodJournalPage', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMoodJournalPageToCollectionIfMissing', () => {
      it('should add a MoodJournalPage to an empty array', () => {
        const moodJournalPage: IMoodJournalPage = sampleWithRequiredData;
        expectedResult = service.addMoodJournalPageToCollectionIfMissing([], moodJournalPage);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(moodJournalPage);
      });

      it('should not add a MoodJournalPage to an array that contains it', () => {
        const moodJournalPage: IMoodJournalPage = sampleWithRequiredData;
        const moodJournalPageCollection: IMoodJournalPage[] = [
          {
            ...moodJournalPage,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMoodJournalPageToCollectionIfMissing(moodJournalPageCollection, moodJournalPage);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MoodJournalPage to an array that doesn't contain it", () => {
        const moodJournalPage: IMoodJournalPage = sampleWithRequiredData;
        const moodJournalPageCollection: IMoodJournalPage[] = [sampleWithPartialData];
        expectedResult = service.addMoodJournalPageToCollectionIfMissing(moodJournalPageCollection, moodJournalPage);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(moodJournalPage);
      });

      it('should add only unique MoodJournalPage to an array', () => {
        const moodJournalPageArray: IMoodJournalPage[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const moodJournalPageCollection: IMoodJournalPage[] = [sampleWithRequiredData];
        expectedResult = service.addMoodJournalPageToCollectionIfMissing(moodJournalPageCollection, ...moodJournalPageArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const moodJournalPage: IMoodJournalPage = sampleWithRequiredData;
        const moodJournalPage2: IMoodJournalPage = sampleWithPartialData;
        expectedResult = service.addMoodJournalPageToCollectionIfMissing([], moodJournalPage, moodJournalPage2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(moodJournalPage);
        expect(expectedResult).toContain(moodJournalPage2);
      });

      it('should accept null and undefined values', () => {
        const moodJournalPage: IMoodJournalPage = sampleWithRequiredData;
        expectedResult = service.addMoodJournalPageToCollectionIfMissing([], null, moodJournalPage, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(moodJournalPage);
      });

      it('should return initial array if no MoodJournalPage is added', () => {
        const moodJournalPageCollection: IMoodJournalPage[] = [sampleWithRequiredData];
        expectedResult = service.addMoodJournalPageToCollectionIfMissing(moodJournalPageCollection, undefined, null);
        expect(expectedResult).toEqual(moodJournalPageCollection);
      });
    });

    describe('compareMoodJournalPage', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMoodJournalPage(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMoodJournalPage(entity1, entity2);
        const compareResult2 = service.compareMoodJournalPage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMoodJournalPage(entity1, entity2);
        const compareResult2 = service.compareMoodJournalPage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMoodJournalPage(entity1, entity2);
        const compareResult2 = service.compareMoodJournalPage(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
