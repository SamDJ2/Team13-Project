import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { NewMoodPickerFormService } from './new-mood-picker-form.service';
import { NewMoodPickerService } from '../service/new-mood-picker.service';
import { INewMoodPicker } from '../new-mood-picker.model';

import { NewMoodPickerUpdateComponent } from './new-mood-picker-update.component';

describe('NewMoodPicker Management Update Component', () => {
  let comp: NewMoodPickerUpdateComponent;
  let fixture: ComponentFixture<NewMoodPickerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let newMoodPickerFormService: NewMoodPickerFormService;
  let newMoodPickerService: NewMoodPickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [NewMoodPickerUpdateComponent],
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
      .overrideTemplate(NewMoodPickerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NewMoodPickerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    newMoodPickerFormService = TestBed.inject(NewMoodPickerFormService);
    newMoodPickerService = TestBed.inject(NewMoodPickerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const newMoodPicker: INewMoodPicker = { id: 456 };

      activatedRoute.data = of({ newMoodPicker });
      comp.ngOnInit();

      expect(comp.newMoodPicker).toEqual(newMoodPicker);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INewMoodPicker>>();
      const newMoodPicker = { id: 123 };
      jest.spyOn(newMoodPickerFormService, 'getNewMoodPicker').mockReturnValue(newMoodPicker);
      jest.spyOn(newMoodPickerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ newMoodPicker });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: newMoodPicker }));
      saveSubject.complete();

      // THEN
      expect(newMoodPickerFormService.getNewMoodPicker).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(newMoodPickerService.update).toHaveBeenCalledWith(expect.objectContaining(newMoodPicker));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INewMoodPicker>>();
      const newMoodPicker = { id: 123 };
      jest.spyOn(newMoodPickerFormService, 'getNewMoodPicker').mockReturnValue({ id: null });
      jest.spyOn(newMoodPickerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ newMoodPicker: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: newMoodPicker }));
      saveSubject.complete();

      // THEN
      expect(newMoodPickerFormService.getNewMoodPicker).toHaveBeenCalled();
      expect(newMoodPickerService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INewMoodPicker>>();
      const newMoodPicker = { id: 123 };
      jest.spyOn(newMoodPickerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ newMoodPicker });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(newMoodPickerService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
