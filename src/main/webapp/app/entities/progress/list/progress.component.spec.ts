import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProgressService } from '../service/progress.service';

import { ProgressComponent } from './progress.component';

describe('Progress Management Component', () => {
  let comp: ProgressComponent;
  let fixture: ComponentFixture<ProgressComponent>;
  let service: ProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'progress', component: ProgressComponent }]), HttpClientTestingModule],
      declarations: [ProgressComponent],
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
      .overrideTemplate(ProgressComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProgressComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ProgressService);

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
    expect(comp.progresses?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to progressService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getProgressIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getProgressIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
