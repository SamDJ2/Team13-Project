import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IHabit } from '../habit.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../habit.test-samples';

import { HabitService } from './habit.service';

const requireRestSample: IHabit = {
  ...sampleWithRequiredData,
};

describe('Habit Service', () => {
  let service: HabitService;
  let httpMock: HttpTestingController;
  let expectedResult: IHabit | IHabit[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(HabitService);
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

    it('should create a Habit', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const habit = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(habit).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Habit', () => {
      const habit = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(habit).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Habit', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Habit', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Habit', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addHabitToCollectionIfMissing', () => {
      it('should add a Habit to an empty array', () => {
        const habit: IHabit = sampleWithRequiredData;
        expectedResult = service.addHabitToCollectionIfMissing([], habit);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(habit);
      });

      it('should not add a Habit to an array that contains it', () => {
        const habit: IHabit = sampleWithRequiredData;
        const habitCollection: IHabit[] = [
          {
            ...habit,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addHabitToCollectionIfMissing(habitCollection, habit);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Habit to an array that doesn't contain it", () => {
        const habit: IHabit = sampleWithRequiredData;
        const habitCollection: IHabit[] = [sampleWithPartialData];
        expectedResult = service.addHabitToCollectionIfMissing(habitCollection, habit);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(habit);
      });

      it('should add only unique Habit to an array', () => {
        const habitArray: IHabit[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const habitCollection: IHabit[] = [sampleWithRequiredData];
        expectedResult = service.addHabitToCollectionIfMissing(habitCollection, ...habitArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const habit: IHabit = sampleWithRequiredData;
        const habit2: IHabit = sampleWithPartialData;
        expectedResult = service.addHabitToCollectionIfMissing([], habit, habit2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(habit);
        expect(expectedResult).toContain(habit2);
      });

      it('should accept null and undefined values', () => {
        const habit: IHabit = sampleWithRequiredData;
        expectedResult = service.addHabitToCollectionIfMissing([], null, habit, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(habit);
      });

      it('should return initial array if no Habit is added', () => {
        const habitCollection: IHabit[] = [sampleWithRequiredData];
        expectedResult = service.addHabitToCollectionIfMissing(habitCollection, undefined, null);
        expect(expectedResult).toEqual(habitCollection);
      });
    });

    describe('compareHabit', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareHabit(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareHabit(entity1, entity2);
        const compareResult2 = service.compareHabit(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareHabit(entity1, entity2);
        const compareResult2 = service.compareHabit(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareHabit(entity1, entity2);
        const compareResult2 = service.compareHabit(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
