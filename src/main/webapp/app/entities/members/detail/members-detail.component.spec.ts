import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MembersDetailComponent } from './members-detail.component';

describe('Members Management Detail Component', () => {
  let comp: MembersDetailComponent;
  let fixture: ComponentFixture<MembersDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MembersDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ members: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MembersDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MembersDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load members on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.members).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
