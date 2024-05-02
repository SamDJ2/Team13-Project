import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { JoinedTeamsDetailComponent } from './joined-teams-detail.component';

describe('JoinedTeams Management Detail Component', () => {
  let comp: JoinedTeamsDetailComponent;
  let fixture: ComponentFixture<JoinedTeamsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JoinedTeamsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ joinedTeams: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(JoinedTeamsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(JoinedTeamsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load joinedTeams on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.joinedTeams).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
