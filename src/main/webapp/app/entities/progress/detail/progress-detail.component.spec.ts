import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProgressDetailComponent } from './progress-detail.component';

describe('Progress Management Detail Component', () => {
  let comp: ProgressDetailComponent;
  let fixture: ComponentFixture<ProgressDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgressDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ progress: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ProgressDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ProgressDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load progress on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.progress).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
