import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { JoinedTeamsFormService } from './joined-teams-form.service';
import { JoinedTeamsService } from '../service/joined-teams.service';
import { IJoinedTeams } from '../joined-teams.model';

import { JoinedTeamsUpdateComponent } from './joined-teams-update.component';

describe('JoinedTeams Management Update Component', () => {
  let comp: JoinedTeamsUpdateComponent;
  let fixture: ComponentFixture<JoinedTeamsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let joinedTeamsFormService: JoinedTeamsFormService;
  let joinedTeamsService: JoinedTeamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [JoinedTeamsUpdateComponent],
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
      .overrideTemplate(JoinedTeamsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(JoinedTeamsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    joinedTeamsFormService = TestBed.inject(JoinedTeamsFormService);
    joinedTeamsService = TestBed.inject(JoinedTeamsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const joinedTeams: IJoinedTeams = { id: 456 };

      activatedRoute.data = of({ joinedTeams });
      comp.ngOnInit();

      expect(comp.joinedTeams).toEqual(joinedTeams);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJoinedTeams>>();
      const joinedTeams = { id: 123 };
      jest.spyOn(joinedTeamsFormService, 'getJoinedTeams').mockReturnValue(joinedTeams);
      jest.spyOn(joinedTeamsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ joinedTeams });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: joinedTeams }));
      saveSubject.complete();

      // THEN
      expect(joinedTeamsFormService.getJoinedTeams).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(joinedTeamsService.update).toHaveBeenCalledWith(expect.objectContaining(joinedTeams));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJoinedTeams>>();
      const joinedTeams = { id: 123 };
      jest.spyOn(joinedTeamsFormService, 'getJoinedTeams').mockReturnValue({ id: null });
      jest.spyOn(joinedTeamsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ joinedTeams: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: joinedTeams }));
      saveSubject.complete();

      // THEN
      expect(joinedTeamsFormService.getJoinedTeams).toHaveBeenCalled();
      expect(joinedTeamsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJoinedTeams>>();
      const joinedTeams = { id: 123 };
      jest.spyOn(joinedTeamsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ joinedTeams });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(joinedTeamsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
