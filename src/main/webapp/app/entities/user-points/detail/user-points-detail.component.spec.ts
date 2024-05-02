import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserPointsDetailComponent } from './user-points-detail.component';

describe('UserPoints Management Detail Component', () => {
  let comp: UserPointsDetailComponent;
  let fixture: ComponentFixture<UserPointsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserPointsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ userPoints: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UserPointsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UserPointsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load userPoints on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.userPoints).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
