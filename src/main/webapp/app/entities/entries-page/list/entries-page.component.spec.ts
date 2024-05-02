import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EntriesPageService } from '../service/entries-page.service';

import { EntriesPageComponent } from './entries-page.component';

describe('EntriesPage Management Component', () => {
  let comp: EntriesPageComponent;
  let fixture: ComponentFixture<EntriesPageComponent>;
  let service: EntriesPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'entries-page', component: EntriesPageComponent }]), HttpClientTestingModule],
      declarations: [EntriesPageComponent],
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
      .overrideTemplate(EntriesPageComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EntriesPageComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EntriesPageService);

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
    expect(comp.entriesPages?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to entriesPageService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getEntriesPageIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getEntriesPageIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
