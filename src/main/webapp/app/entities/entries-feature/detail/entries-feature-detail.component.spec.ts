import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EntriesFeatureDetailComponent } from './entries-feature-detail.component';

describe('EntriesFeature Management Detail Component', () => {
  let comp: EntriesFeatureDetailComponent;
  let fixture: ComponentFixture<EntriesFeatureDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntriesFeatureDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ entriesFeature: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EntriesFeatureDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EntriesFeatureDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load entriesFeature on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.entriesFeature).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
