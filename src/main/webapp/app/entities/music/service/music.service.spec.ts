import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMusic } from '../music.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../music.test-samples';

import { MusicService } from './music.service';

const requireRestSample: IMusic = {
  ...sampleWithRequiredData,
};

describe('Music Service', () => {
  let service: MusicService;
  let httpMock: HttpTestingController;
  let expectedResult: IMusic | IMusic[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MusicService);
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

    it('should create a Music', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const music = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(music).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Music', () => {
      const music = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(music).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Music', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Music', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Music', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMusicToCollectionIfMissing', () => {
      it('should add a Music to an empty array', () => {
        const music: IMusic = sampleWithRequiredData;
        expectedResult = service.addMusicToCollectionIfMissing([], music);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(music);
      });

      it('should not add a Music to an array that contains it', () => {
        const music: IMusic = sampleWithRequiredData;
        const musicCollection: IMusic[] = [
          {
            ...music,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMusicToCollectionIfMissing(musicCollection, music);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Music to an array that doesn't contain it", () => {
        const music: IMusic = sampleWithRequiredData;
        const musicCollection: IMusic[] = [sampleWithPartialData];
        expectedResult = service.addMusicToCollectionIfMissing(musicCollection, music);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(music);
      });

      it('should add only unique Music to an array', () => {
        const musicArray: IMusic[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const musicCollection: IMusic[] = [sampleWithRequiredData];
        expectedResult = service.addMusicToCollectionIfMissing(musicCollection, ...musicArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const music: IMusic = sampleWithRequiredData;
        const music2: IMusic = sampleWithPartialData;
        expectedResult = service.addMusicToCollectionIfMissing([], music, music2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(music);
        expect(expectedResult).toContain(music2);
      });

      it('should accept null and undefined values', () => {
        const music: IMusic = sampleWithRequiredData;
        expectedResult = service.addMusicToCollectionIfMissing([], null, music, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(music);
      });

      it('should return initial array if no Music is added', () => {
        const musicCollection: IMusic[] = [sampleWithRequiredData];
        expectedResult = service.addMusicToCollectionIfMissing(musicCollection, undefined, null);
        expect(expectedResult).toEqual(musicCollection);
      });
    });

    describe('compareMusic', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMusic(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMusic(entity1, entity2);
        const compareResult2 = service.compareMusic(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMusic(entity1, entity2);
        const compareResult2 = service.compareMusic(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMusic(entity1, entity2);
        const compareResult2 = service.compareMusic(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
