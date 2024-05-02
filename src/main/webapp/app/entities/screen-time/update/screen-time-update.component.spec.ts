import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ScreenTimeFormService } from './screen-time-form.service';
import { ScreenTimeService } from '../service/screen-time.service';
import { IScreenTime } from '../screen-time.model';
import { IVideoGames } from 'app/entities/video-games/video-games.model';
import { VideoGamesService } from 'app/entities/video-games/service/video-games.service';
import { IMovies } from 'app/entities/movies/movies.model';
import { MoviesService } from 'app/entities/movies/service/movies.service';
import { ISocialMedia } from 'app/entities/social-media/social-media.model';
import { SocialMediaService } from 'app/entities/social-media/service/social-media.service';
import { IMusic } from 'app/entities/music/music.model';
import { MusicService } from 'app/entities/music/service/music.service';

import { ScreenTimeUpdateComponent } from './screen-time-update.component';

describe('ScreenTime Management Update Component', () => {
  let comp: ScreenTimeUpdateComponent;
  let fixture: ComponentFixture<ScreenTimeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let screenTimeFormService: ScreenTimeFormService;
  let screenTimeService: ScreenTimeService;
  let videoGamesService: VideoGamesService;
  let moviesService: MoviesService;
  let socialMediaService: SocialMediaService;
  let musicService: MusicService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ScreenTimeUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ScreenTimeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ScreenTimeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    screenTimeFormService = TestBed.inject(ScreenTimeFormService);
    screenTimeService = TestBed.inject(ScreenTimeService);
    videoGamesService = TestBed.inject(VideoGamesService);
    moviesService = TestBed.inject(MoviesService);
    socialMediaService = TestBed.inject(SocialMediaService);
    musicService = TestBed.inject(MusicService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call VideoGames query and add missing value', () => {
      const screenTime: IScreenTime = { id: 456 };
      const videoGames: IVideoGames = { id: 18799 };
      screenTime.videoGames = videoGames;

      const videoGamesCollection: IVideoGames[] = [{ id: 48711 }];
      jest.spyOn(videoGamesService, 'query').mockReturnValue(of(new HttpResponse({ body: videoGamesCollection })));
      const additionalVideoGames = [videoGames];
      const expectedCollection: IVideoGames[] = [...additionalVideoGames, ...videoGamesCollection];
      jest.spyOn(videoGamesService, 'addVideoGamesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ screenTime });
      comp.ngOnInit();

      expect(videoGamesService.query).toHaveBeenCalled();
      expect(videoGamesService.addVideoGamesToCollectionIfMissing).toHaveBeenCalledWith(
        videoGamesCollection,
        ...additionalVideoGames.map(expect.objectContaining)
      );
      expect(comp.videoGamesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Movies query and add missing value', () => {
      const screenTime: IScreenTime = { id: 456 };
      const movies: IMovies = { id: 68313 };
      screenTime.movies = movies;

      const moviesCollection: IMovies[] = [{ id: 85128 }];
      jest.spyOn(moviesService, 'query').mockReturnValue(of(new HttpResponse({ body: moviesCollection })));
      const additionalMovies = [movies];
      const expectedCollection: IMovies[] = [...additionalMovies, ...moviesCollection];
      jest.spyOn(moviesService, 'addMoviesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ screenTime });
      comp.ngOnInit();

      expect(moviesService.query).toHaveBeenCalled();
      expect(moviesService.addMoviesToCollectionIfMissing).toHaveBeenCalledWith(
        moviesCollection,
        ...additionalMovies.map(expect.objectContaining)
      );
      expect(comp.moviesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call SocialMedia query and add missing value', () => {
      const screenTime: IScreenTime = { id: 456 };
      const socialMedia: ISocialMedia = { id: 64744 };
      screenTime.socialMedia = socialMedia;

      const socialMediaCollection: ISocialMedia[] = [{ id: 9975 }];
      jest.spyOn(socialMediaService, 'query').mockReturnValue(of(new HttpResponse({ body: socialMediaCollection })));
      const additionalSocialMedias = [socialMedia];
      const expectedCollection: ISocialMedia[] = [...additionalSocialMedias, ...socialMediaCollection];
      jest.spyOn(socialMediaService, 'addSocialMediaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ screenTime });
      comp.ngOnInit();

      expect(socialMediaService.query).toHaveBeenCalled();
      expect(socialMediaService.addSocialMediaToCollectionIfMissing).toHaveBeenCalledWith(
        socialMediaCollection,
        ...additionalSocialMedias.map(expect.objectContaining)
      );
      expect(comp.socialMediasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Music query and add missing value', () => {
      const screenTime: IScreenTime = { id: 456 };
      const music: IMusic = { id: 7029 };
      screenTime.music = music;

      const musicCollection: IMusic[] = [{ id: 6885 }];
      jest.spyOn(musicService, 'query').mockReturnValue(of(new HttpResponse({ body: musicCollection })));
      const additionalMusic = [music];
      const expectedCollection: IMusic[] = [...additionalMusic, ...musicCollection];
      jest.spyOn(musicService, 'addMusicToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ screenTime });
      comp.ngOnInit();

      expect(musicService.query).toHaveBeenCalled();
      expect(musicService.addMusicToCollectionIfMissing).toHaveBeenCalledWith(
        musicCollection,
        ...additionalMusic.map(expect.objectContaining)
      );
      expect(comp.musicSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const screenTime: IScreenTime = { id: 456 };
      const videoGames: IVideoGames = { id: 32377 };
      screenTime.videoGames = videoGames;
      const movies: IMovies = { id: 47639 };
      screenTime.movies = movies;
      const socialMedia: ISocialMedia = { id: 55087 };
      screenTime.socialMedia = socialMedia;
      const music: IMusic = { id: 61654 };
      screenTime.music = music;

      activatedRoute.data = of({ screenTime });
      comp.ngOnInit();

      expect(comp.videoGamesSharedCollection).toContain(videoGames);
      expect(comp.moviesSharedCollection).toContain(movies);
      expect(comp.socialMediasSharedCollection).toContain(socialMedia);
      expect(comp.musicSharedCollection).toContain(music);
      expect(comp.screenTime).toEqual(screenTime);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IScreenTime>>();
      const screenTime = { id: 123 };
      jest.spyOn(screenTimeFormService, 'getScreenTime').mockReturnValue(screenTime);
      jest.spyOn(screenTimeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ screenTime });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: screenTime }));
      saveSubject.complete();

      // THEN
      expect(screenTimeFormService.getScreenTime).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(screenTimeService.update).toHaveBeenCalledWith(expect.objectContaining(screenTime));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IScreenTime>>();
      const screenTime = { id: 123 };
      jest.spyOn(screenTimeFormService, 'getScreenTime').mockReturnValue({ id: null });
      jest.spyOn(screenTimeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ screenTime: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: screenTime }));
      saveSubject.complete();

      // THEN
      expect(screenTimeFormService.getScreenTime).toHaveBeenCalled();
      expect(screenTimeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IScreenTime>>();
      const screenTime = { id: 123 };
      jest.spyOn(screenTimeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ screenTime });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(screenTimeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareVideoGames', () => {
      it('Should forward to videoGamesService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(videoGamesService, 'compareVideoGames');
        comp.compareVideoGames(entity, entity2);
        expect(videoGamesService.compareVideoGames).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareMovies', () => {
      it('Should forward to moviesService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(moviesService, 'compareMovies');
        comp.compareMovies(entity, entity2);
        expect(moviesService.compareMovies).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareSocialMedia', () => {
      it('Should forward to socialMediaService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(socialMediaService, 'compareSocialMedia');
        comp.compareSocialMedia(entity, entity2);
        expect(socialMediaService.compareSocialMedia).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareMusic', () => {
      it('Should forward to musicService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(musicService, 'compareMusic');
        comp.compareMusic(entity, entity2);
        expect(musicService.compareMusic).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
