import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MoodJournalPageDetailComponent } from './mood-journal-page-detail.component';

describe('MoodJournalPage Management Detail Component', () => {
  let comp: MoodJournalPageDetailComponent;
  let fixture: ComponentFixture<MoodJournalPageDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MoodJournalPageDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ moodJournalPage: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MoodJournalPageDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MoodJournalPageDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load moodJournalPage on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.moodJournalPage).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
