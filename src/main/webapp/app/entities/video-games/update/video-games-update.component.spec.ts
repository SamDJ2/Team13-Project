import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VideoGamesFormService } from './video-games-form.service';
import { VideoGamesService } from '../service/video-games.service';
import { IVideoGames } from '../video-games.model';

import { VideoGamesUpdateComponent } from './video-games-update.component';

describe('VideoGames Management Update Component', () => {
  let comp: VideoGamesUpdateComponent;
  let fixture: ComponentFixture<VideoGamesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let videoGamesFormService: VideoGamesFormService;
  let videoGamesService: VideoGamesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VideoGamesUpdateComponent],
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
      .overrideTemplate(VideoGamesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VideoGamesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    videoGamesFormService = TestBed.inject(VideoGamesFormService);
    videoGamesService = TestBed.inject(VideoGamesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const videoGames: IVideoGames = { id: 456 };

      activatedRoute.data = of({ videoGames });
      comp.ngOnInit();

      expect(comp.videoGames).toEqual(videoGames);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVideoGames>>();
      const videoGames = { id: 123 };
      jest.spyOn(videoGamesFormService, 'getVideoGames').mockReturnValue(videoGames);
      jest.spyOn(videoGamesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ videoGames });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: videoGames }));
      saveSubject.complete();

      // THEN
      expect(videoGamesFormService.getVideoGames).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(videoGamesService.update).toHaveBeenCalledWith(expect.objectContaining(videoGames));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVideoGames>>();
      const videoGames = { id: 123 };
      jest.spyOn(videoGamesFormService, 'getVideoGames').mockReturnValue({ id: null });
      jest.spyOn(videoGamesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ videoGames: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: videoGames }));
      saveSubject.complete();

      // THEN
      expect(videoGamesFormService.getVideoGames).toHaveBeenCalled();
      expect(videoGamesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVideoGames>>();
      const videoGames = { id: 123 };
      jest.spyOn(videoGamesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ videoGames });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(videoGamesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
