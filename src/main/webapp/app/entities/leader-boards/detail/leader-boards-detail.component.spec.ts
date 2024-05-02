import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LeaderBoardsDetailComponent } from './leader-boards-detail.component';

describe('LeaderBoards Management Detail Component', () => {
  let comp: LeaderBoardsDetailComponent;
  let fixture: ComponentFixture<LeaderBoardsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaderBoardsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ leaderBoards: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LeaderBoardsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LeaderBoardsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load leaderBoards on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.leaderBoards).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
