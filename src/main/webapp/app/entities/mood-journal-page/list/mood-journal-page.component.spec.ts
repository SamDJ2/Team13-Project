import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MoodJournalPageService } from '../service/mood-journal-page.service';

import { MoodJournalPageComponent } from './mood-journal-page.component';

describe('MoodJournalPage Management Component', () => {
  let comp: MoodJournalPageComponent;
  let fixture: ComponentFixture<MoodJournalPageComponent>;
  let service: MoodJournalPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'mood-journal-page', component: MoodJournalPageComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [MoodJournalPageComponent],
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
      .overrideTemplate(MoodJournalPageComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MoodJournalPageComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MoodJournalPageService);

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
    expect(comp.moodJournalPages?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to moodJournalPageService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMoodJournalPageIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMoodJournalPageIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
