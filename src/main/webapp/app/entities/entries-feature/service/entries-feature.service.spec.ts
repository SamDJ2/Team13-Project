import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { EntriesFeature } from '../entries-feature.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../entries-feature.test-samples';

import { EntriesFeatureService, RestEntriesFeature } from './entries-feature.service';

const requireRestSample: RestEntriesFeature = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.format(DATE_FORMAT),
};

describe('EntriesFeature Service', () => {
  let service: EntriesFeatureService;
  let httpMock: HttpTestingController;
  let expectedResult: EntriesFeature | EntriesFeature[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EntriesFeatureService);
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

    it('should create a EntriesFeature', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const entriesFeature = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(entriesFeature).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EntriesFeature', () => {
      const entriesFeature = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(entriesFeature).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EntriesFeature', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EntriesFeature', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a EntriesFeature', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEntriesFeatureToCollectionIfMissing', () => {
      it('should add a EntriesFeature to an empty array', () => {
        const entriesFeature: EntriesFeature = sampleWithRequiredData;
        expectedResult = service.addEntriesFeatureToCollectionIfMissing([], entriesFeature);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(entriesFeature);
      });

      it('should not add a EntriesFeature to an array that contains it', () => {
        const entriesFeature: EntriesFeature = sampleWithRequiredData;
        const entriesFeatureCollection: EntriesFeature[] = [
          {
            ...entriesFeature,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEntriesFeatureToCollectionIfMissing(entriesFeatureCollection, entriesFeature);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EntriesFeature to an array that doesn't contain it", () => {
        const entriesFeature: EntriesFeature = sampleWithRequiredData;
        const entriesFeatureCollection: EntriesFeature[] = [sampleWithPartialData];
        expectedResult = service.addEntriesFeatureToCollectionIfMissing(entriesFeatureCollection, entriesFeature);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(entriesFeature);
      });

      it('should add only unique EntriesFeature to an array', () => {
        const entriesFeatureArray: EntriesFeature[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const entriesFeatureCollection: EntriesFeature[] = [sampleWithRequiredData];
        expectedResult = service.addEntriesFeatureToCollectionIfMissing(entriesFeatureCollection, ...entriesFeatureArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const entriesFeature: EntriesFeature = sampleWithRequiredData;
        const entriesFeature2: EntriesFeature = sampleWithPartialData;
        expectedResult = service.addEntriesFeatureToCollectionIfMissing([], entriesFeature, entriesFeature2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(entriesFeature);
        expect(expectedResult).toContain(entriesFeature2);
      });

      it('should accept null and undefined values', () => {
        const entriesFeature: EntriesFeature = sampleWithRequiredData;
        expectedResult = service.addEntriesFeatureToCollectionIfMissing([], null, entriesFeature, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(entriesFeature);
      });

      it('should return initial array if no EntriesFeature is added', () => {
        const entriesFeatureCollection: EntriesFeature[] = [sampleWithRequiredData];
        expectedResult = service.addEntriesFeatureToCollectionIfMissing(entriesFeatureCollection, undefined, null);
        expect(expectedResult).toEqual(entriesFeatureCollection);
      });
    });

    describe('compareEntriesFeature', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEntriesFeature(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEntriesFeature(entity1, entity2);
        const compareResult2 = service.compareEntriesFeature(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEntriesFeature(entity1, entity2);
        const compareResult2 = service.compareEntriesFeature(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEntriesFeature(entity1, entity2);
        const compareResult2 = service.compareEntriesFeature(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
