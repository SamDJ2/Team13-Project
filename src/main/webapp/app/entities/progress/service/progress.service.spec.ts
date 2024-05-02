import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProgress } from '../progress.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../progress.test-samples';

import { ProgressService } from './progress.service';

const requireRestSample: IProgress = {
  ...sampleWithRequiredData,
};

describe('Progress Service', () => {
  let service: ProgressService;
  let httpMock: HttpTestingController;
  let expectedResult: IProgress | IProgress[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProgressService);
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

    it('should create a Progress', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const progress = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(progress).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Progress', () => {
      const progress = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(progress).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Progress', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Progress', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Progress', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProgressToCollectionIfMissing', () => {
      it('should add a Progress to an empty array', () => {
        const progress: IProgress = sampleWithRequiredData;
        expectedResult = service.addProgressToCollectionIfMissing([], progress);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(progress);
      });

      it('should not add a Progress to an array that contains it', () => {
        const progress: IProgress = sampleWithRequiredData;
        const progressCollection: IProgress[] = [
          {
            ...progress,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProgressToCollectionIfMissing(progressCollection, progress);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Progress to an array that doesn't contain it", () => {
        const progress: IProgress = sampleWithRequiredData;
        const progressCollection: IProgress[] = [sampleWithPartialData];
        expectedResult = service.addProgressToCollectionIfMissing(progressCollection, progress);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(progress);
      });

      it('should add only unique Progress to an array', () => {
        const progressArray: IProgress[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const progressCollection: IProgress[] = [sampleWithRequiredData];
        expectedResult = service.addProgressToCollectionIfMissing(progressCollection, ...progressArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const progress: IProgress = sampleWithRequiredData;
        const progress2: IProgress = sampleWithPartialData;
        expectedResult = service.addProgressToCollectionIfMissing([], progress, progress2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(progress);
        expect(expectedResult).toContain(progress2);
      });

      it('should accept null and undefined values', () => {
        const progress: IProgress = sampleWithRequiredData;
        expectedResult = service.addProgressToCollectionIfMissing([], null, progress, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(progress);
      });

      it('should return initial array if no Progress is added', () => {
        const progressCollection: IProgress[] = [sampleWithRequiredData];
        expectedResult = service.addProgressToCollectionIfMissing(progressCollection, undefined, null);
        expect(expectedResult).toEqual(progressCollection);
      });
    });

    describe('compareProgress', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProgress(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProgress(entity1, entity2);
        const compareResult2 = service.compareProgress(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProgress(entity1, entity2);
        const compareResult2 = service.compareProgress(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProgress(entity1, entity2);
        const compareResult2 = service.compareProgress(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
