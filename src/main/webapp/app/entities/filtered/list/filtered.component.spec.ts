import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { FilteredService } from '../service/filtered.service';

import { FilteredComponent } from './filtered.component';

describe('Filtered Management Component', () => {
  let comp: FilteredComponent;
  let fixture: ComponentFixture<FilteredComponent>;
  let service: FilteredService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'filtered', component: FilteredComponent }]), HttpClientTestingModule],
      declarations: [FilteredComponent],
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
      .overrideTemplate(FilteredComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FilteredComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FilteredService);

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
    expect(comp.filtereds?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to filteredService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getFilteredIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getFilteredIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
