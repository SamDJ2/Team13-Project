import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { WeeklySummaryDetailComponent } from './weekly-summary-detail.component';

describe('WeeklySummary Management Detail Component', () => {
  let comp: WeeklySummaryDetailComponent;
  let fixture: ComponentFixture<WeeklySummaryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeeklySummaryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ weeklySummary: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(WeeklySummaryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(WeeklySummaryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load weeklySummary on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.weeklySummary).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
