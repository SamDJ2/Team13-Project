import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { PromptsFeature } from '../prompts-feature.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../prompts-feature.test-samples';

import { PromptsFeatureService, RestPromptsFeature } from './prompts-feature.service';

const requireRestSample: RestPromptsFeature = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.format(DATE_FORMAT),
};

describe('PromptsFeature Service', () => {
  let service: PromptsFeatureService;
  let httpMock: HttpTestingController;
  let expectedResult: PromptsFeature | PromptsFeature[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PromptsFeatureService);
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

    it('should create a PromptsFeature', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const promptsFeature = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(promptsFeature).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PromptsFeature', () => {
      const promptsFeature = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(promptsFeature).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PromptsFeature', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PromptsFeature', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PromptsFeature', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPromptsFeatureToCollectionIfMissing', () => {
      it('should add a PromptsFeature to an empty array', () => {
        const promptsFeature: PromptsFeature = sampleWithRequiredData;
        expectedResult = service.addPromptsFeatureToCollectionIfMissing([], promptsFeature);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(promptsFeature);
      });

      it('should not add a PromptsFeature to an array that contains it', () => {
        const promptsFeature: PromptsFeature = sampleWithRequiredData;
        const promptsFeatureCollection: PromptsFeature[] = [
          {
            ...promptsFeature,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPromptsFeatureToCollectionIfMissing(promptsFeatureCollection, promptsFeature);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PromptsFeature to an array that doesn't contain it", () => {
        const promptsFeature: PromptsFeature = sampleWithRequiredData;
        const promptsFeatureCollection: PromptsFeature[] = [sampleWithPartialData];
        expectedResult = service.addPromptsFeatureToCollectionIfMissing(promptsFeatureCollection, promptsFeature);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(promptsFeature);
      });

      it('should add only unique PromptsFeature to an array', () => {
        const promptsFeatureArray: PromptsFeature[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const promptsFeatureCollection: PromptsFeature[] = [sampleWithRequiredData];
        expectedResult = service.addPromptsFeatureToCollectionIfMissing(promptsFeatureCollection, ...promptsFeatureArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const promptsFeature: PromptsFeature = sampleWithRequiredData;
        const promptsFeature2: PromptsFeature = sampleWithPartialData;
        expectedResult = service.addPromptsFeatureToCollectionIfMissing([], promptsFeature, promptsFeature2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(promptsFeature);
        expect(expectedResult).toContain(promptsFeature2);
      });

      it('should accept null and undefined values', () => {
        const promptsFeature: PromptsFeature = sampleWithRequiredData;
        expectedResult = service.addPromptsFeatureToCollectionIfMissing([], null, promptsFeature, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(promptsFeature);
      });

      it('should return initial array if no PromptsFeature is added', () => {
        const promptsFeatureCollection: PromptsFeature[] = [sampleWithRequiredData];
        expectedResult = service.addPromptsFeatureToCollectionIfMissing(promptsFeatureCollection, undefined, null);
        expect(expectedResult).toEqual(promptsFeatureCollection);
      });
    });

    describe('comparePromptsFeature', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePromptsFeature(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePromptsFeature(entity1, entity2);
        const compareResult2 = service.comparePromptsFeature(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePromptsFeature(entity1, entity2);
        const compareResult2 = service.comparePromptsFeature(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePromptsFeature(entity1, entity2);
        const compareResult2 = service.comparePromptsFeature(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
