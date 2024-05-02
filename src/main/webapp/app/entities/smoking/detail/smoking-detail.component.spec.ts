import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SmokingDetailComponent } from './smoking-detail.component';

describe('Smoking Management Detail Component', () => {
  let comp: SmokingDetailComponent;
  let fixture: ComponentFixture<SmokingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SmokingDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ smoking: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SmokingDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SmokingDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load smoking on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.smoking).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
