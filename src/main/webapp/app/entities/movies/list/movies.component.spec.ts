import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MoviesService } from '../service/movies.service';

import { MoviesComponent } from './movies.component';

describe('Movies Management Component', () => {
  let comp: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;
  let service: MoviesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'movies', component: MoviesComponent }]), HttpClientTestingModule],
      declarations: [MoviesComponent],
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
      .overrideTemplate(MoviesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MoviesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MoviesService);

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
    expect(comp.movies?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to moviesService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMoviesIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMoviesIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
