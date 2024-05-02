import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IEmotionPage } from '../emotion-page.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../emotion-page.test-samples';

import { EmotionPageService, RestEmotionPage } from './emotion-page.service';

const requireRestSample: RestEmotionPage = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.format(DATE_FORMAT),
};

describe('EmotionPage Service', () => {
  let service: EmotionPageService;
  let httpMock: HttpTestingController;
  let expectedResult: IEmotionPage | IEmotionPage[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EmotionPageService);
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

    it('should create a EmotionPage', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const emotionPage = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(emotionPage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EmotionPage', () => {
      const emotionPage = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(emotionPage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EmotionPage', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EmotionPage', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a EmotionPage', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEmotionPageToCollectionIfMissing', () => {
      it('should add a EmotionPage to an empty array', () => {
        const emotionPage: IEmotionPage = sampleWithRequiredData;
        expectedResult = service.addEmotionPageToCollectionIfMissing([], emotionPage);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(emotionPage);
      });

      it('should not add a EmotionPage to an array that contains it', () => {
        const emotionPage: IEmotionPage = sampleWithRequiredData;
        const emotionPageCollection: IEmotionPage[] = [
          {
            ...emotionPage,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEmotionPageToCollectionIfMissing(emotionPageCollection, emotionPage);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EmotionPage to an array that doesn't contain it", () => {
        const emotionPage: IEmotionPage = sampleWithRequiredData;
        const emotionPageCollection: IEmotionPage[] = [sampleWithPartialData];
        expectedResult = service.addEmotionPageToCollectionIfMissing(emotionPageCollection, emotionPage);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(emotionPage);
      });

      it('should add only unique EmotionPage to an array', () => {
        const emotionPageArray: IEmotionPage[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const emotionPageCollection: IEmotionPage[] = [sampleWithRequiredData];
        expectedResult = service.addEmotionPageToCollectionIfMissing(emotionPageCollection, ...emotionPageArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const emotionPage: IEmotionPage = sampleWithRequiredData;
        const emotionPage2: IEmotionPage = sampleWithPartialData;
        expectedResult = service.addEmotionPageToCollectionIfMissing([], emotionPage, emotionPage2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(emotionPage);
        expect(expectedResult).toContain(emotionPage2);
      });

      it('should accept null and undefined values', () => {
        const emotionPage: IEmotionPage = sampleWithRequiredData;
        expectedResult = service.addEmotionPageToCollectionIfMissing([], null, emotionPage, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(emotionPage);
      });

      it('should return initial array if no EmotionPage is added', () => {
        const emotionPageCollection: IEmotionPage[] = [sampleWithRequiredData];
        expectedResult = service.addEmotionPageToCollectionIfMissing(emotionPageCollection, undefined, null);
        expect(expectedResult).toEqual(emotionPageCollection);
      });
    });

    describe('compareEmotionPage', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEmotionPage(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEmotionPage(entity1, entity2);
        const compareResult2 = service.compareEmotionPage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEmotionPage(entity1, entity2);
        const compareResult2 = service.compareEmotionPage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEmotionPage(entity1, entity2);
        const compareResult2 = service.compareEmotionPage(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
