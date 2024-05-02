import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { WeeklySummaryService } from '../service/weekly-summary.service';

import { WeeklySummaryComponent } from './weekly-summary.component';

describe('WeeklySummary Management Component', () => {
  let comp: WeeklySummaryComponent;
  let fixture: ComponentFixture<WeeklySummaryComponent>;
  let service: WeeklySummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'weekly-summary', component: WeeklySummaryComponent }]), HttpClientTestingModule],
      declarations: [WeeklySummaryComponent],
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
      .overrideTemplate(WeeklySummaryComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WeeklySummaryComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(WeeklySummaryService);

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
    expect(comp.weeklySummaries?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to weeklySummaryService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getWeeklySummaryIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getWeeklySummaryIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
