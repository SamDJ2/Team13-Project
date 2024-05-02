import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ITimer } from '../timer.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../timer.test-samples';

import { TimerService, RestTimer } from './timer.service';

const requireRestSample: RestTimer = {
  ...sampleWithRequiredData,
  startTime: sampleWithRequiredData.startTime?.format(DATE_FORMAT),
};

describe('Timer Service', () => {
  let service: TimerService;
  let httpMock: HttpTestingController;
  let expectedResult: ITimer | ITimer[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TimerService);
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

    it('should create a Timer', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const timer = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(timer).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Timer', () => {
      const timer = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(timer).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Timer', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Timer', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Timer', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTimerToCollectionIfMissing', () => {
      it('should add a Timer to an empty array', () => {
        const timer: ITimer = sampleWithRequiredData;
        expectedResult = service.addTimerToCollectionIfMissing([], timer);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(timer);
      });

      it('should not add a Timer to an array that contains it', () => {
        const timer: ITimer = sampleWithRequiredData;
        const timerCollection: ITimer[] = [
          {
            ...timer,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTimerToCollectionIfMissing(timerCollection, timer);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Timer to an array that doesn't contain it", () => {
        const timer: ITimer = sampleWithRequiredData;
        const timerCollection: ITimer[] = [sampleWithPartialData];
        expectedResult = service.addTimerToCollectionIfMissing(timerCollection, timer);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(timer);
      });

      it('should add only unique Timer to an array', () => {
        const timerArray: ITimer[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const timerCollection: ITimer[] = [sampleWithRequiredData];
        expectedResult = service.addTimerToCollectionIfMissing(timerCollection, ...timerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const timer: ITimer = sampleWithRequiredData;
        const timer2: ITimer = sampleWithPartialData;
        expectedResult = service.addTimerToCollectionIfMissing([], timer, timer2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(timer);
        expect(expectedResult).toContain(timer2);
      });

      it('should accept null and undefined values', () => {
        const timer: ITimer = sampleWithRequiredData;
        expectedResult = service.addTimerToCollectionIfMissing([], null, timer, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(timer);
      });

      it('should return initial array if no Timer is added', () => {
        const timerCollection: ITimer[] = [sampleWithRequiredData];
        expectedResult = service.addTimerToCollectionIfMissing(timerCollection, undefined, null);
        expect(expectedResult).toEqual(timerCollection);
      });
    });

    describe('compareTimer', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTimer(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTimer(entity1, entity2);
        const compareResult2 = service.compareTimer(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTimer(entity1, entity2);
        const compareResult2 = service.compareTimer(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTimer(entity1, entity2);
        const compareResult2 = service.compareTimer(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
