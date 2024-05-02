import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MoviesDetailComponent } from './movies-detail.component';

describe('Movies Management Detail Component', () => {
  let comp: MoviesDetailComponent;
  let fixture: ComponentFixture<MoviesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MoviesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ movies: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MoviesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MoviesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load movies on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.movies).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
