import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../video-games.test-samples';

import { VideoGamesFormService } from './video-games-form.service';

describe('VideoGames Form Service', () => {
  let service: VideoGamesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoGamesFormService);
  });

  describe('Service methods', () => {
    describe('createVideoGamesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVideoGamesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            levels: expect.any(Object),
            progress: expect.any(Object),
            timer: expect.any(Object),
          })
        );
      });

      it('passing IVideoGames should create a new form with FormGroup', () => {
        const formGroup = service.createVideoGamesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            levels: expect.any(Object),
            progress: expect.any(Object),
            timer: expect.any(Object),
          })
        );
      });
    });

    describe('getVideoGames', () => {
      it('should return NewVideoGames for default VideoGames initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createVideoGamesFormGroup(sampleWithNewData);

        const videoGames = service.getVideoGames(formGroup) as any;

        expect(videoGames).toMatchObject(sampleWithNewData);
      });

      it('should return NewVideoGames for empty VideoGames initial value', () => {
        const formGroup = service.createVideoGamesFormGroup();

        const videoGames = service.getVideoGames(formGroup) as any;

        expect(videoGames).toMatchObject({});
      });

      it('should return IVideoGames', () => {
        const formGroup = service.createVideoGamesFormGroup(sampleWithRequiredData);

        const videoGames = service.getVideoGames(formGroup) as any;

        expect(videoGames).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVideoGames should not enable id FormControl', () => {
        const formGroup = service.createVideoGamesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVideoGames should disable id FormControl', () => {
        const formGroup = service.createVideoGamesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
