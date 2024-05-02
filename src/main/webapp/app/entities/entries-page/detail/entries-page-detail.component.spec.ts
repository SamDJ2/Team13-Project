import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EntriesPageDetailComponent } from './entries-page-detail.component';

describe('EntriesPage Management Detail Component', () => {
  let comp: EntriesPageDetailComponent;
  let fixture: ComponentFixture<EntriesPageDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntriesPageDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ entriesPage: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EntriesPageDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EntriesPageDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load entriesPage on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.entriesPage).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
