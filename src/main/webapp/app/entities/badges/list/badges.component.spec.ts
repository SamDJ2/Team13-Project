import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BadgesService } from '../service/badges.service';

import { BadgesComponent } from './badges.component';

describe('Badges Management Component', () => {
  let comp: BadgesComponent;
  let fixture: ComponentFixture<BadgesComponent>;
  let service: BadgesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'badges', component: BadgesComponent }]), HttpClientTestingModule],
      declarations: [BadgesComponent],
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
      .overrideTemplate(BadgesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BadgesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BadgesService);

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
    expect(comp.badges?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to badgesService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getBadgesIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getBadgesIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
