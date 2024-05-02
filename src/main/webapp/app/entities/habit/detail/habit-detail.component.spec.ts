import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { HabitDetailComponent } from './habit-detail.component';

describe('Habit Management Detail Component', () => {
  let comp: HabitDetailComponent;
  let fixture: ComponentFixture<HabitDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HabitDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ habit: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(HabitDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(HabitDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load habit on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.habit).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
