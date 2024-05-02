import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SmokingService } from '../service/smoking.service';

import { SmokingComponent } from './smoking.component';

describe('Smoking Management Component', () => {
  let comp: SmokingComponent;
  let fixture: ComponentFixture<SmokingComponent>;
  let service: SmokingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'smoking', component: SmokingComponent }]), HttpClientTestingModule],
      declarations: [SmokingComponent],
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
      .overrideTemplate(SmokingComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SmokingComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SmokingService);

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
    expect(comp.smokings?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to smokingService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getSmokingIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSmokingIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
