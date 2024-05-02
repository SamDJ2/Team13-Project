import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SocialMediaService } from '../service/social-media.service';

import { SocialMediaComponent } from './social-media.component';

describe('SocialMedia Management Component', () => {
  let comp: SocialMediaComponent;
  let fixture: ComponentFixture<SocialMediaComponent>;
  let service: SocialMediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'social-media', component: SocialMediaComponent }]), HttpClientTestingModule],
      declarations: [SocialMediaComponent],
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
      .overrideTemplate(SocialMediaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SocialMediaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SocialMediaService);

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
    expect(comp.socialMedias?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to socialMediaService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getSocialMediaIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSocialMediaIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
