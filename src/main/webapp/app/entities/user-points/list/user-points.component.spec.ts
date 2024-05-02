import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserPointsService } from '../service/user-points.service';

import { UserPointsComponent } from './user-points.component';

describe('UserPoints Management Component', () => {
  let comp: UserPointsComponent;
  let fixture: ComponentFixture<UserPointsComponent>;
  let service: UserPointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'user-points', component: UserPointsComponent }]), HttpClientTestingModule],
      declarations: [UserPointsComponent],
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
      .overrideTemplate(UserPointsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserPointsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserPointsService);

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
    expect(comp.userPoints?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to userPointsService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getUserPointsIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getUserPointsIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
