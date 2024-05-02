import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PromptsFeatureFormService } from './prompts-feature-form.service';
import { PromptsFeatureService } from '../service/prompts-feature.service';
import { PromptsFeature } from '../prompts-feature.model';

import { PromptsFeatureUpdateComponent } from './prompts-feature-update.component';

describe('PromptsFeature Management Update Component', () => {
  let comp: PromptsFeatureUpdateComponent;
  let fixture: ComponentFixture<PromptsFeatureUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let promptsFeatureFormService: PromptsFeatureFormService;
  let promptsFeatureService: PromptsFeatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PromptsFeatureUpdateComponent],
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
      .overrideTemplate(PromptsFeatureUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PromptsFeatureUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    promptsFeatureFormService = TestBed.inject(PromptsFeatureFormService);
    promptsFeatureService = TestBed.inject(PromptsFeatureService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const promptsFeature: PromptsFeature = { id: 456 };

      activatedRoute.data = of({ promptsFeature });
      comp.ngOnInit();

      expect(comp.promptsFeature).toEqual(promptsFeature);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PromptsFeature>>();
      const promptsFeature = { id: 123 };
      jest.spyOn(promptsFeatureFormService, 'getPromptsFeature').mockReturnValue(promptsFeature);
      jest.spyOn(promptsFeatureService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ promptsFeature });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: promptsFeature }));
      saveSubject.complete();

      // THEN
      expect(promptsFeatureFormService.getPromptsFeature).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(promptsFeatureService.update).toHaveBeenCalledWith(expect.objectContaining(promptsFeature));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PromptsFeature>>();
      const promptsFeature = { id: 123 };
      jest.spyOn(promptsFeatureFormService, 'getPromptsFeature').mockReturnValue({ id: null });
      jest.spyOn(promptsFeatureService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ promptsFeature: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: promptsFeature }));
      saveSubject.complete();

      // THEN
      expect(promptsFeatureFormService.getPromptsFeature).toHaveBeenCalled();
      expect(promptsFeatureService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PromptsFeature>>();
      const promptsFeature = { id: 123 };
      jest.spyOn(promptsFeatureService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ promptsFeature });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(promptsFeatureService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
