import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMembers } from '../members.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../members.test-samples';

import { MembersService } from './members.service';

const requireRestSample: IMembers = {
  ...sampleWithRequiredData,
};

describe('Members Service', () => {
  let service: MembersService;
  let httpMock: HttpTestingController;
  let expectedResult: IMembers | IMembers[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MembersService);
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

    it('should create a Members', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const members = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(members).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Members', () => {
      const members = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(members).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Members', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Members', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Members', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMembersToCollectionIfMissing', () => {
      it('should add a Members to an empty array', () => {
        const members: IMembers = sampleWithRequiredData;
        expectedResult = service.addMembersToCollectionIfMissing([], members);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(members);
      });

      it('should not add a Members to an array that contains it', () => {
        const members: IMembers = sampleWithRequiredData;
        const membersCollection: IMembers[] = [
          {
            ...members,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMembersToCollectionIfMissing(membersCollection, members);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Members to an array that doesn't contain it", () => {
        const members: IMembers = sampleWithRequiredData;
        const membersCollection: IMembers[] = [sampleWithPartialData];
        expectedResult = service.addMembersToCollectionIfMissing(membersCollection, members);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(members);
      });

      it('should add only unique Members to an array', () => {
        const membersArray: IMembers[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const membersCollection: IMembers[] = [sampleWithRequiredData];
        expectedResult = service.addMembersToCollectionIfMissing(membersCollection, ...membersArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const members: IMembers = sampleWithRequiredData;
        const members2: IMembers = sampleWithPartialData;
        expectedResult = service.addMembersToCollectionIfMissing([], members, members2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(members);
        expect(expectedResult).toContain(members2);
      });

      it('should accept null and undefined values', () => {
        const members: IMembers = sampleWithRequiredData;
        expectedResult = service.addMembersToCollectionIfMissing([], null, members, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(members);
      });

      it('should return initial array if no Members is added', () => {
        const membersCollection: IMembers[] = [sampleWithRequiredData];
        expectedResult = service.addMembersToCollectionIfMissing(membersCollection, undefined, null);
        expect(expectedResult).toEqual(membersCollection);
      });
    });

    describe('compareMembers', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMembers(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMembers(entity1, entity2);
        const compareResult2 = service.compareMembers(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMembers(entity1, entity2);
        const compareResult2 = service.compareMembers(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMembers(entity1, entity2);
        const compareResult2 = service.compareMembers(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
