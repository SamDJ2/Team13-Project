import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { HistoryDetailComponent } from './history-detail.component';

describe('History Management Detail Component', () => {
  let comp: HistoryDetailComponent;
  let fixture: ComponentFixture<HistoryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ history: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(HistoryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(HistoryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load history on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.history).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
