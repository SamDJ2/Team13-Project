import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SocialMediaFormService } from './social-media-form.service';
import { SocialMediaService } from '../service/social-media.service';
import { ISocialMedia } from '../social-media.model';

import { SocialMediaUpdateComponent } from './social-media-update.component';

describe('SocialMedia Management Update Component', () => {
  let comp: SocialMediaUpdateComponent;
  let fixture: ComponentFixture<SocialMediaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let socialMediaFormService: SocialMediaFormService;
  let socialMediaService: SocialMediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SocialMediaUpdateComponent],
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
      .overrideTemplate(SocialMediaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SocialMediaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    socialMediaFormService = TestBed.inject(SocialMediaFormService);
    socialMediaService = TestBed.inject(SocialMediaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const socialMedia: ISocialMedia = { id: 456 };

      activatedRoute.data = of({ socialMedia });
      comp.ngOnInit();

      expect(comp.socialMedia).toEqual(socialMedia);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISocialMedia>>();
      const socialMedia = { id: 123 };
      jest.spyOn(socialMediaFormService, 'getSocialMedia').mockReturnValue(socialMedia);
      jest.spyOn(socialMediaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ socialMedia });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: socialMedia }));
      saveSubject.complete();

      // THEN
      expect(socialMediaFormService.getSocialMedia).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(socialMediaService.update).toHaveBeenCalledWith(expect.objectContaining(socialMedia));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISocialMedia>>();
      const socialMedia = { id: 123 };
      jest.spyOn(socialMediaFormService, 'getSocialMedia').mockReturnValue({ id: null });
      jest.spyOn(socialMediaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ socialMedia: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: socialMedia }));
      saveSubject.complete();

      // THEN
      expect(socialMediaFormService.getSocialMedia).toHaveBeenCalled();
      expect(socialMediaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISocialMedia>>();
      const socialMedia = { id: 123 };
      jest.spyOn(socialMediaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ socialMedia });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(socialMediaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
