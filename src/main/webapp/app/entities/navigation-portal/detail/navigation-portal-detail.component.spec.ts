import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { NavigationPortalDetailComponent } from './navigation-portal-detail.component';

describe('NavigationPortal Management Detail Component', () => {
  let comp: NavigationPortalDetailComponent;
  let fixture: ComponentFixture<NavigationPortalDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavigationPortalDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ navigationPortal: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(NavigationPortalDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(NavigationPortalDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load navigationPortal on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.navigationPortal).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
