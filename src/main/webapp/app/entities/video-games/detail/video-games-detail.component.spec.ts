import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VideoGamesDetailComponent } from './video-games-detail.component';

describe('VideoGames Management Detail Component', () => {
  let comp: VideoGamesDetailComponent;
  let fixture: ComponentFixture<VideoGamesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideoGamesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ videoGames: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(VideoGamesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(VideoGamesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load videoGames on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.videoGames).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
