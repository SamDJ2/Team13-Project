import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TimerDetailComponent } from './timer-detail.component';

describe('Timer Management Detail Component', () => {
  let comp: TimerDetailComponent;
  let fixture: ComponentFixture<TimerDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimerDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ timer: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TimerDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TimerDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load timer on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.timer).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
