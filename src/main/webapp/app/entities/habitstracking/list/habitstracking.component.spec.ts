import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { HabitstrackingService } from '../service/habitstracking.service';

import { HabitstrackingComponent } from './habitstracking.component';

describe('Habitstracking Management Component', () => {
  let comp: HabitstrackingComponent;
  let fixture: ComponentFixture<HabitstrackingComponent>;
  let service: HabitstrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'habitstracking', component: HabitstrackingComponent }]), HttpClientTestingModule],
      declarations: [HabitstrackingComponent],
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
      .overrideTemplate(HabitstrackingComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HabitstrackingComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(HabitstrackingService);

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
    expect(comp.habitstrackings?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to habitstrackingService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getHabitstrackingIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getHabitstrackingIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
