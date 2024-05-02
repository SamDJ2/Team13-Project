import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AchievementDetailComponent } from './achievement-detail.component';

describe('Achievement Management Detail Component', () => {
  let comp: AchievementDetailComponent;
  let fixture: ComponentFixture<AchievementDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AchievementDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ achievement: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AchievementDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AchievementDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load achievement on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.achievement).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
