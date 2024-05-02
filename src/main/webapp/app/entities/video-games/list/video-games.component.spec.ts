import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { VideoGamesService } from '../service/video-games.service';

import { VideoGamesComponent } from './video-games.component';

describe('VideoGames Management Component', () => {
  let comp: VideoGamesComponent;
  let fixture: ComponentFixture<VideoGamesComponent>;
  let service: VideoGamesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'video-games', component: VideoGamesComponent }]), HttpClientTestingModule],
      declarations: [VideoGamesComponent],
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
      .overrideTemplate(VideoGamesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VideoGamesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(VideoGamesService);

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
    expect(comp.videoGames?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to videoGamesService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getVideoGamesIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getVideoGamesIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
