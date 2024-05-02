import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IJunkFood } from '../junk-food.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../junk-food.test-samples';

import { JunkFoodService } from './junk-food.service';

const requireRestSample: IJunkFood = {
  ...sampleWithRequiredData,
};

describe('JunkFood Service', () => {
  let service: JunkFoodService;
  let httpMock: HttpTestingController;
  let expectedResult: IJunkFood | IJunkFood[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(JunkFoodService);
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

    it('should create a JunkFood', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const junkFood = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(junkFood).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a JunkFood', () => {
      const junkFood = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(junkFood).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a JunkFood', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of JunkFood', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a JunkFood', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addJunkFoodToCollectionIfMissing', () => {
      it('should add a JunkFood to an empty array', () => {
        const junkFood: IJunkFood = sampleWithRequiredData;
        expectedResult = service.addJunkFoodToCollectionIfMissing([], junkFood);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(junkFood);
      });

      it('should not add a JunkFood to an array that contains it', () => {
        const junkFood: IJunkFood = sampleWithRequiredData;
        const junkFoodCollection: IJunkFood[] = [
          {
            ...junkFood,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addJunkFoodToCollectionIfMissing(junkFoodCollection, junkFood);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a JunkFood to an array that doesn't contain it", () => {
        const junkFood: IJunkFood = sampleWithRequiredData;
        const junkFoodCollection: IJunkFood[] = [sampleWithPartialData];
        expectedResult = service.addJunkFoodToCollectionIfMissing(junkFoodCollection, junkFood);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(junkFood);
      });

      it('should add only unique JunkFood to an array', () => {
        const junkFoodArray: IJunkFood[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const junkFoodCollection: IJunkFood[] = [sampleWithRequiredData];
        expectedResult = service.addJunkFoodToCollectionIfMissing(junkFoodCollection, ...junkFoodArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const junkFood: IJunkFood = sampleWithRequiredData;
        const junkFood2: IJunkFood = sampleWithPartialData;
        expectedResult = service.addJunkFoodToCollectionIfMissing([], junkFood, junkFood2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(junkFood);
        expect(expectedResult).toContain(junkFood2);
      });

      it('should accept null and undefined values', () => {
        const junkFood: IJunkFood = sampleWithRequiredData;
        expectedResult = service.addJunkFoodToCollectionIfMissing([], null, junkFood, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(junkFood);
      });

      it('should return initial array if no JunkFood is added', () => {
        const junkFoodCollection: IJunkFood[] = [sampleWithRequiredData];
        expectedResult = service.addJunkFoodToCollectionIfMissing(junkFoodCollection, undefined, null);
        expect(expectedResult).toEqual(junkFoodCollection);
      });
    });

    describe('compareJunkFood', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareJunkFood(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareJunkFood(entity1, entity2);
        const compareResult2 = service.compareJunkFood(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareJunkFood(entity1, entity2);
        const compareResult2 = service.compareJunkFood(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareJunkFood(entity1, entity2);
        const compareResult2 = service.compareJunkFood(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
