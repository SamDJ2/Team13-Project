import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AlcoholService } from '../service/alcohol.service';

import { AlcoholComponent } from './alcohol.component';

describe('Alcohol Management Component', () => {
  let comp: AlcoholComponent;
  let fixture: ComponentFixture<AlcoholComponent>;
  let service: AlcoholService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'alcohol', component: AlcoholComponent }]), HttpClientTestingModule],
      declarations: [AlcoholComponent],
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
      .overrideTemplate(AlcoholComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AlcoholComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AlcoholService);

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
    expect(comp.alcohol?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to alcoholService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAlcoholIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAlcoholIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
