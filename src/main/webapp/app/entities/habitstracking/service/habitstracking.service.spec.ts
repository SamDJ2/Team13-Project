import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IHabitstracking } from '../habitstracking.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../habitstracking.test-samples';

import { HabitstrackingService } from './habitstracking.service';

const requireRestSample: IHabitstracking = {
  ...sampleWithRequiredData,
};

describe('Habitstracking Service', () => {
  let service: HabitstrackingService;
  let httpMock: HttpTestingController;
  let expectedResult: IHabitstracking | IHabitstracking[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(HabitstrackingService);
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

    it('should create a Habitstracking', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const habitstracking = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(habitstracking).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Habitstracking', () => {
      const habitstracking = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(habitstracking).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Habitstracking', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Habitstracking', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Habitstracking', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addHabitstrackingToCollectionIfMissing', () => {
      it('should add a Habitstracking to an empty array', () => {
        const habitstracking: IHabitstracking = sampleWithRequiredData;
        expectedResult = service.addHabitstrackingToCollectionIfMissing([], habitstracking);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(habitstracking);
      });

      it('should not add a Habitstracking to an array that contains it', () => {
        const habitstracking: IHabitstracking = sampleWithRequiredData;
        const habitstrackingCollection: IHabitstracking[] = [
          {
            ...habitstracking,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addHabitstrackingToCollectionIfMissing(habitstrackingCollection, habitstracking);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Habitstracking to an array that doesn't contain it", () => {
        const habitstracking: IHabitstracking = sampleWithRequiredData;
        const habitstrackingCollection: IHabitstracking[] = [sampleWithPartialData];
        expectedResult = service.addHabitstrackingToCollectionIfMissing(habitstrackingCollection, habitstracking);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(habitstracking);
      });

      it('should add only unique Habitstracking to an array', () => {
        const habitstrackingArray: IHabitstracking[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const habitstrackingCollection: IHabitstracking[] = [sampleWithRequiredData];
        expectedResult = service.addHabitstrackingToCollectionIfMissing(habitstrackingCollection, ...habitstrackingArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const habitstracking: IHabitstracking = sampleWithRequiredData;
        const habitstracking2: IHabitstracking = sampleWithPartialData;
        expectedResult = service.addHabitstrackingToCollectionIfMissing([], habitstracking, habitstracking2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(habitstracking);
        expect(expectedResult).toContain(habitstracking2);
      });

      it('should accept null and undefined values', () => {
        const habitstracking: IHabitstracking = sampleWithRequiredData;
        expectedResult = service.addHabitstrackingToCollectionIfMissing([], null, habitstracking, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(habitstracking);
      });

      it('should return initial array if no Habitstracking is added', () => {
        const habitstrackingCollection: IHabitstracking[] = [sampleWithRequiredData];
        expectedResult = service.addHabitstrackingToCollectionIfMissing(habitstrackingCollection, undefined, null);
        expect(expectedResult).toEqual(habitstrackingCollection);
      });
    });

    describe('compareHabitstracking', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareHabitstracking(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareHabitstracking(entity1, entity2);
        const compareResult2 = service.compareHabitstracking(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareHabitstracking(entity1, entity2);
        const compareResult2 = service.compareHabitstracking(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareHabitstracking(entity1, entity2);
        const compareResult2 = service.compareHabitstracking(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
