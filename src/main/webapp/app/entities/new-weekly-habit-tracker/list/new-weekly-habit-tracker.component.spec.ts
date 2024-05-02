import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { NewWeeklyHabitTrackerService } from '../service/new-weekly-habit-tracker.service';

import { NewWeeklyHabitTrackerComponent } from './new-weekly-habit-tracker.component';

describe('NewWeeklyHabitTracker Management Component', () => {
  let comp: NewWeeklyHabitTrackerComponent;
  let fixture: ComponentFixture<NewWeeklyHabitTrackerComponent>;
  let service: NewWeeklyHabitTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'new-weekly-habit-tracker', component: NewWeeklyHabitTrackerComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [NewWeeklyHabitTrackerComponent],
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
      .overrideTemplate(NewWeeklyHabitTrackerComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NewWeeklyHabitTrackerComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(NewWeeklyHabitTrackerService);

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
    expect(comp.newWeeklyHabitTrackers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to newWeeklyHabitTrackerService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getNewWeeklyHabitTrackerIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getNewWeeklyHabitTrackerIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
