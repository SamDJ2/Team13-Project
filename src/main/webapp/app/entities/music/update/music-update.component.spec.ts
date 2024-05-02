import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MusicFormService } from './music-form.service';
import { MusicService } from '../service/music.service';
import { IMusic } from '../music.model';

import { MusicUpdateComponent } from './music-update.component';

describe('Music Management Update Component', () => {
  let comp: MusicUpdateComponent;
  let fixture: ComponentFixture<MusicUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let musicFormService: MusicFormService;
  let musicService: MusicService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MusicUpdateComponent],
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
      .overrideTemplate(MusicUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MusicUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    musicFormService = TestBed.inject(MusicFormService);
    musicService = TestBed.inject(MusicService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const music: IMusic = { id: 456 };

      activatedRoute.data = of({ music });
      comp.ngOnInit();

      expect(comp.music).toEqual(music);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMusic>>();
      const music = { id: 123 };
      jest.spyOn(musicFormService, 'getMusic').mockReturnValue(music);
      jest.spyOn(musicService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ music });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: music }));
      saveSubject.complete();

      // THEN
      expect(musicFormService.getMusic).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(musicService.update).toHaveBeenCalledWith(expect.objectContaining(music));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMusic>>();
      const music = { id: 123 };
      jest.spyOn(musicFormService, 'getMusic').mockReturnValue({ id: null });
      jest.spyOn(musicService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ music: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: music }));
      saveSubject.complete();

      // THEN
      expect(musicFormService.getMusic).toHaveBeenCalled();
      expect(musicService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMusic>>();
      const music = { id: 123 };
      jest.spyOn(musicService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ music });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(musicService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
