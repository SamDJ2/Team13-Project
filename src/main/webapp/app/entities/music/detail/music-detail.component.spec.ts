import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MusicDetailComponent } from './music-detail.component';

describe('Music Management Detail Component', () => {
  let comp: MusicDetailComponent;
  let fixture: ComponentFixture<MusicDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MusicDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ music: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MusicDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MusicDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load music on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.music).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
