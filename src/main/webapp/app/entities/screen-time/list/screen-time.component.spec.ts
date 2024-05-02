import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ScreenTimeService } from '../service/screen-time.service';

import { ScreenTimeComponent } from './screen-time.component';

describe('ScreenTime Management Component', () => {
  let comp: ScreenTimeComponent;
  let fixture: ComponentFixture<ScreenTimeComponent>;
  let service: ScreenTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'screen-time', component: ScreenTimeComponent }]), HttpClientTestingModule],
      declarations: [ScreenTimeComponent],
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
      .overrideTemplate(ScreenTimeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ScreenTimeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ScreenTimeService);

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
    expect(comp.screenTimes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to screenTimeService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getScreenTimeIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getScreenTimeIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
