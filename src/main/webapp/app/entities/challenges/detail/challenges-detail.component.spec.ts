import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ChallengesDetailComponent } from './challenges-detail.component';

describe('Challenges Management Detail Component', () => {
  let comp: ChallengesDetailComponent;
  let fixture: ComponentFixture<ChallengesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChallengesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ challenges: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ChallengesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ChallengesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load challenges on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.challenges).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
