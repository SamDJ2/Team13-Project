import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { JoinedTeamsService } from '../service/joined-teams.service';

import { JoinedTeamsComponent } from './joined-teams.component';

describe('JoinedTeams Management Component', () => {
  let comp: JoinedTeamsComponent;
  let fixture: ComponentFixture<JoinedTeamsComponent>;
  let service: JoinedTeamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'joined-teams', component: JoinedTeamsComponent }]), HttpClientTestingModule],
      declarations: [JoinedTeamsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(JoinedTeamsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(JoinedTeamsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(JoinedTeamsService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.joinedTeams?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to joinedTeamsService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getJoinedTeamsIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getJoinedTeamsIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
