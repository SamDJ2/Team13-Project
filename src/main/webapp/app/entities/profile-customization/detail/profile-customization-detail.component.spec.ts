import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProfileCustomizationDetailComponent } from './profile-customization-detail.component';

describe('ProfileCustomization Management Detail Component', () => {
  let comp: ProfileCustomizationDetailComponent;
  let fixture: ComponentFixture<ProfileCustomizationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileCustomizationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ profileCustomization: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ProfileCustomizationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ProfileCustomizationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load profileCustomization on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.profileCustomization).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
