import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GroupingDetailComponent } from './grouping-detail.component';

describe('Grouping Management Detail Component', () => {
  let comp: GroupingDetailComponent;
  let fixture: ComponentFixture<GroupingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupingDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ grouping: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(GroupingDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(GroupingDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load grouping on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.grouping).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
