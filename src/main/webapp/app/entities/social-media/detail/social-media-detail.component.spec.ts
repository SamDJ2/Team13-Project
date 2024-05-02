import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SocialMediaDetailComponent } from './social-media-detail.component';

describe('SocialMedia Management Detail Component', () => {
  let comp: SocialMediaDetailComponent;
  let fixture: ComponentFixture<SocialMediaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SocialMediaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ socialMedia: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SocialMediaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SocialMediaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load socialMedia on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.socialMedia).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
