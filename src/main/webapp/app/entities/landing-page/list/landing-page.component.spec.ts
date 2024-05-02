import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LandingPageService } from '../service/landing-page.service';

import { LandingPageComponent } from './landing-page.component';

describe('LandingPage Management Component', () => {
  let comp: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let service: LandingPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'landing-page', component: LandingPageComponent }]), HttpClientTestingModule],
      declarations: [LandingPageComponent],
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
      .overrideTemplate(LandingPageComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LandingPageService);

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
    expect(comp.landingPages?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to landingPageService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getLandingPageIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getLandingPageIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
