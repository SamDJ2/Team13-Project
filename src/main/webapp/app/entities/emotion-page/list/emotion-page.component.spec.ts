import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EmotionPageService } from '../service/emotion-page.service';

import { EmotionPageComponent } from './emotion-page.component';

describe('EmotionPage Management Component', () => {
  let comp: EmotionPageComponent;
  let fixture: ComponentFixture<EmotionPageComponent>;
  let service: EmotionPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'emotion-page', component: EmotionPageComponent }]), HttpClientTestingModule],
      declarations: [EmotionPageComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(EmotionPageComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EmotionPageComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EmotionPageService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.emotionPages?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to emotionPageService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getEmotionPageIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getEmotionPageIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
