import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LeaderBoardsService } from '../service/leader-boards.service';

import { LeaderBoardsComponent } from './leader-boards.component';

describe('LeaderBoards Management Component', () => {
  let comp: LeaderBoardsComponent;
  let fixture: ComponentFixture<LeaderBoardsComponent>;
  let service: LeaderBoardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'leader-boards', component: LeaderBoardsComponent }]), HttpClientTestingModule],
      declarations: [LeaderBoardsComponent],
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
      .overrideTemplate(LeaderBoardsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LeaderBoardsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LeaderBoardsService);

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
    expect(comp.leaderBoards?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to leaderBoardsService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getLeaderBoardsIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getLeaderBoardsIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
