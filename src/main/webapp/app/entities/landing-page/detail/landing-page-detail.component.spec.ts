import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LandingPageDetailComponent } from './landing-page-detail.component';

describe('LandingPage Management Detail Component', () => {
  let comp: LandingPageDetailComponent;
  let fixture: ComponentFixture<LandingPageDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingPageDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ landingPage: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LandingPageDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LandingPageDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load landingPage on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.landingPage).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
