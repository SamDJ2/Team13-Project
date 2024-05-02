import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IVideoGames } from '../video-games.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../video-games.test-samples';

import { VideoGamesService } from './video-games.service';

const requireRestSample: IVideoGames = {
  ...sampleWithRequiredData,
};

describe('VideoGames Service', () => {
  let service: VideoGamesService;
  let httpMock: HttpTestingController;
  let expectedResult: IVideoGames | IVideoGames[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VideoGamesService);
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

    it('should create a VideoGames', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const videoGames = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(videoGames).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a VideoGames', () => {
      const videoGames = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(videoGames).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a VideoGames', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of VideoGames', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a VideoGames', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addVideoGamesToCollectionIfMissing', () => {
      it('should add a VideoGames to an empty array', () => {
        const videoGames: IVideoGames = sampleWithRequiredData;
        expectedResult = service.addVideoGamesToCollectionIfMissing([], videoGames);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(videoGames);
      });

      it('should not add a VideoGames to an array that contains it', () => {
        const videoGames: IVideoGames = sampleWithRequiredData;
        const videoGamesCollection: IVideoGames[] = [
          {
            ...videoGames,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVideoGamesToCollectionIfMissing(videoGamesCollection, videoGames);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a VideoGames to an array that doesn't contain it", () => {
        const videoGames: IVideoGames = sampleWithRequiredData;
        const videoGamesCollection: IVideoGames[] = [sampleWithPartialData];
        expectedResult = service.addVideoGamesToCollectionIfMissing(videoGamesCollection, videoGames);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(videoGames);
      });

      it('should add only unique VideoGames to an array', () => {
        const videoGamesArray: IVideoGames[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const videoGamesCollection: IVideoGames[] = [sampleWithRequiredData];
        expectedResult = service.addVideoGamesToCollectionIfMissing(videoGamesCollection, ...videoGamesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const videoGames: IVideoGames = sampleWithRequiredData;
        const videoGames2: IVideoGames = sampleWithPartialData;
        expectedResult = service.addVideoGamesToCollectionIfMissing([], videoGames, videoGames2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(videoGames);
        expect(expectedResult).toContain(videoGames2);
      });

      it('should accept null and undefined values', () => {
        const videoGames: IVideoGames = sampleWithRequiredData;
        expectedResult = service.addVideoGamesToCollectionIfMissing([], null, videoGames, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(videoGames);
      });

      it('should return initial array if no VideoGames is added', () => {
        const videoGamesCollection: IVideoGames[] = [sampleWithRequiredData];
        expectedResult = service.addVideoGamesToCollectionIfMissing(videoGamesCollection, undefined, null);
        expect(expectedResult).toEqual(videoGamesCollection);
      });
    });

    describe('compareVideoGames', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVideoGames(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareVideoGames(entity1, entity2);
        const compareResult2 = service.compareVideoGames(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareVideoGames(entity1, entity2);
        const compareResult2 = service.compareVideoGames(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareVideoGames(entity1, entity2);
        const compareResult2 = service.compareVideoGames(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
