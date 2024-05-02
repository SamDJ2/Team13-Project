import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { HabitstrackingDetailComponent } from './habitstracking-detail.component';

describe('Habitstracking Management Detail Component', () => {
  let comp: HabitstrackingDetailComponent;
  let fixture: ComponentFixture<HabitstrackingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HabitstrackingDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ habitstracking: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(HabitstrackingDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(HabitstrackingDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load habitstracking on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.habitstracking).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
