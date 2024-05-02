import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserDBService } from '../service/user-db.service';

import { UserDBComponent } from './user-db.component';

describe('UserDB Management Component', () => {
  let comp: UserDBComponent;
  let fixture: ComponentFixture<UserDBComponent>;
  let service: UserDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'user-db', component: UserDBComponent }]), HttpClientTestingModule],
      declarations: [UserDBComponent],
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
      .overrideTemplate(UserDBComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserDBComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserDBService);

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
    expect(comp.userDBS?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to userDBService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getUserDBIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getUserDBIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
